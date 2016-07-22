import {expect} from "chai";
import moment from "moment";

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
                (id, user_name)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING`,
            "id-user-1", "test-user-1");
    });

    afterEach(async () => {
        await db.query({
            text: "DELETE FROM pageview; DELETE FROM visit"
        });
    });

    after(async () => {
        await db.query({
            text: "DELETE FROM user_app"
        });
    });

    it("INSERT with new visit", async () => {
        const event = getEventFromObject({
            data: {
                id: 1,
                element: {
                    userId: "id-user-1",
                    type: INTERACTION_PAGEVIEW,
                    timestamp: "2016-01-01T01:02:03Z",
                    body: {
                        visitId: "visit-1",
                        view: "home"
                    }
                }
            },
            type: "element inserted in collection user-interactions"
        });

        await run(handler, event);

        const result = await db.rows("SELECT * from pageview");

        expect(result.length).to.equal(1);
        expect({
            ...result[0],
            id: undefined
        }).to.deep.equal({
            id: undefined,
            visit_id: "visit-1",
            date: moment("2016-01-01").toDate(),
            time: "01:02:03",
            time_spent: null,
            full_timestamp: new Date("2016-01-01T01:02:03Z"),
            device: null,
            application: null,
            page_name: "home"
        });
    });

    it("INSERT with existing visit", async () => {
        await findOrCreateVisit(1, "id-user-1");
        const event = getEventFromObject({
            data: {
                id: 1,
                element: {
                    userId: "id-user-1",
                    type: INTERACTION_PAGEVIEW,
                    timestamp: "2016-01-01T01:02:03Z",
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

        const result = await db.rows("SELECT * from pageview");

        expect(result.length).to.equal(1);
        expect({
            ...result[0],
            id: undefined
        }).to.deep.equal({
            id: undefined,
            visit_id: "visit-1",
            date: moment("2016-01-01T00:00:00").toDate(),
            time: "01:02:03",
            time_spent: "00:01:10",
            full_timestamp: new Date("2016-01-01T01:02:03Z"),
            device: null,
            application: null,
            page_name: "home"
        });
    });

});
