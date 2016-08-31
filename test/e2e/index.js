import {expect} from "chai";

import {handler} from "index";
import {getEventFromObject, run} from "../mocks";
import {getClient, findOrCreateVisit} from "services/db";
import {INTERACTION_PAGEVIEW} from "config";
import {createTestDB} from "../../scripts/create-tables";

describe("`interactions` on RDS", () => {

    const db = getClient();

    before(async () => {
        // create tables
        await db.query(createTestDB);

        // insert an user
        await db.query(
            `INSERT INTO user_app
                (id, user_name, external_uid)
                VALUES ($1, $2, $3)
                ON CONFLICT DO NOTHING`,
            1, "test-user-1", "id-user-1");
    });

    afterEach(async () => {
        await db.query({
            text: "DELETE FROM page_view; DELETE FROM visit"
        });
    });

    after(async () => {
        await db.query({
            text: "DELETE FROM user_app"
        });
    });

    describe("SKIPS", async () => {

        it("if the event is empty", async () => {
            const event = getEventFromObject({
                data: {
                    id: "1",
                    element: {}
                },
                type: "element inserted in collection user-interactions"
            });

            await run(handler, event);

            const result = await db.rows("SELECT * from page_view");

            expect(result.length).to.equal(0);
        });

        it("if `userId` is missing", async () => {
            const event = getEventFromObject({
                data: {
                    id: "1",
                    element: {
                        type: INTERACTION_PAGEVIEW,
                        timestamp: "2016-01-01T01:02:03Z",
                        details: {
                            platform: "Android"
                        },
                        body: {
                            visitId: "visit-1",
                            view: "home"
                        }
                    }
                },
                type: "element inserted in collection user-interactions"
            });

            await run(handler, event);

            const result = await db.rows("SELECT * from page_view");

            expect(result.length).to.equal(0);
        });

        it("if `userId` is not on database", async () => {
            const event = getEventFromObject({
                data: {
                    id: "1",
                    element: {
                        userId: "id-user-2",
                        type: INTERACTION_PAGEVIEW,
                        timestamp: "2016-01-01T01:02:03Z",
                        details: {
                            platform: "Android"
                        },
                        body: {
                            visitId: "visit-1",
                            view: "home"
                        }
                    }
                },
                type: "element inserted in collection user-interactions"
            });

            await run(handler, event);

            const result = await db.rows("SELECT * from page_view");

            expect(result.length).to.equal(0);
        });

        it("if `type` is missing", async () => {
            const event = getEventFromObject({
                data: {
                    id: "1",
                    element: {
                        userId: "id-user-1",
                        timestamp: "2016-01-01T01:02:03Z",
                        details: {
                            platform: "Android",
                            bundle: "com.my.app",
                            appVersion: "1.0.1"
                        },
                        body: {
                            visitId: "visit-1",
                            view: "home"
                        }
                    }
                },
                type: "element inserted in collection user-interactions"
            });

            await run(handler, event);

            const result = await db.rows("SELECT * from page_view");

            expect(result.length).to.equal(0);
        });

        it("if `body` is missing", async () => {
            const event = getEventFromObject({
                data: {
                    id: "1",
                    element: {
                        userId: "id-user-1",
                        type: INTERACTION_PAGEVIEW,
                        timestamp: "2016-01-01T01:02:03Z",
                        details: {
                            platform: "Android",
                            bundle: "com.my.app",
                            appVersion: "1.0.1"
                        }
                    }
                },
                type: "element inserted in collection user-interactions"
            });

            await run(handler, event);

            const result = await db.rows("SELECT * from page_view");

            expect(result.length).to.equal(0);
        });

    });

    it("INSERT with new visit", async () => {
        const event = getEventFromObject({
            data: {
                id: "1",
                element: {
                    userId: "id-user-1",
                    type: INTERACTION_PAGEVIEW,
                    timestamp: "2016-01-01T01:02:03Z",
                    details: {
                        platform: "Android",
                        bundle: "com.my.app",
                        appVersion: "1.0.1"
                    },
                    body: {
                        visitId: "visit-1",
                        view: "home"
                    }
                }
            },
            type: "element inserted in collection user-interactions"
        });

        await run(handler, event);

        const result = await db.rows("SELECT * from page_view");

        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({
            id: "1",
            visit_id: "visit-1",
            time_spent: null,
            datetime: new Date("2016-01-01T01:02:03Z"),
            device: "Android",
            application: "com.my.app 1.0.1",
            page_name: "home"
        });
    });

    it("INSERT with existing visit", async () => {
        await findOrCreateVisit("visit-1", 1);
        const event = getEventFromObject({
            data: {
                id: "1",
                element: {
                    userId: "id-user-1",
                    type: INTERACTION_PAGEVIEW,
                    timestamp: "2016-01-01T01:02:03Z",
                    details: {
                        platform: "Android",
                        bundle: "com.my.app",
                        appVersion: "1.0.1"
                    },
                    body: {
                        visitId: "visit-1",
                        view: "home",
                        timeSpent: "00:01:10"
                    }
                }
            },
            type: "element inserted in collection user-interactions"
        });

        await run(handler, event);

        const result = await db.rows("SELECT * from page_view");

        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({
            id: "1",
            visit_id: "visit-1",
            time_spent: "00:01:10",
            datetime: new Date("2016-01-01T01:02:03Z"),
            device: "Android",
            application: "com.my.app 1.0.1",
            page_name: "home"
        });
    });

});
