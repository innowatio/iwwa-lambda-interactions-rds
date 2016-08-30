import {findOrCreateVisit, insertPageview} from "../services/db";
import moment from "moment";


export async function savePageview (interaction, userId) {

    const utcTimestamp = moment.utc(interaction.timestamp);

    const device = getDeviceName(interaction.details);
    const application = getApplicationName(interaction.details);


    // VISIT
    // id, user_app_id, date, time, time_spent, zulu_time, device, application
    await findOrCreateVisit(
        interaction.visitId,
        userId,
        utcTimestamp.format("YYYY-MM-DD"),
        utcTimestamp.format("HH:mm:ss"),
        "00:01:20",
        interaction.timestamp,
        device,
        application
    );

    // PAGEVIEW
    // id, visit_id, date, time, time_spent, full_timestamp, device, application, page_name
    await insertPageview(
        interaction.id,
        interaction.visitId,
        utcTimestamp.format("YYYY-MM-DD"),
        utcTimestamp.format("HH:mm:ss"),
        interaction.timeSpent,
        interaction.timestamp,
        device,
        application,
        interaction.view
    );
}

export function getDeviceName (details) {
    if (!details) {
        return "";
    }
    return [details.platform, details.version]
        .filter(detail => detail !== undefined && detail !== null)
        .join(" ")
        .trim();
}

export function getApplicationName (details) {
    if (!details) {
        return "";
    }
    return [details.bundle, details.appVersion]
        .filter(detail => detail !== undefined && detail !== null)
        .join(" ")
        .trim();
}
