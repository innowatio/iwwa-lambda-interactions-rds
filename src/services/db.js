import PgAsync from "pg-async";

import {
    DB_USER,
    DB_PASS,
    DB_URL,
    DB_NAME
} from "../config";

var db;
export function getClient () {
    if (!db) {
        db = new PgAsync(`postgres://${DB_USER}:${DB_PASS}@${DB_URL}/${DB_NAME}`);
    }
    return db;
}

export async function findUserOnDatabase (userId) {
    const db = await getClient();
    return db.rows(`
        SELECT * FROM user_app WHERE external_uid = $1`,
        userId);
}

export async function findOrCreateVisit (id, user_app_id, datetime, time_spent, device, application) {
    const db = await getClient();
    return db.query(`
        INSERT INTO visit
            (id, user_app_id, datetime, time_spent, device, application)
            VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING`,
        // TODO update fields
        id, user_app_id, datetime, time_spent, device, application);
}

export async function insertPageview (id, visit_id, datetime, time_spent, device, application, page_name) {
    const db = await getClient();
    return db.query(`
        INSERT INTO page_view
            (id, visit_id, datetime, time_spent, device, application, page_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING`,
        id, visit_id, datetime, time_spent, device, application, page_name);
}
