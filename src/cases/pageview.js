import {findOrCreateVisit, insertPageview} from "../services/db";

export async function savePageview (interaction, userId) {

    const device = getDeviceName(interaction.details);
    const application = getApplicationName(interaction.details);


    // VISIT
    // id, user_app_id, datetime, time_spent, device, application
    await findOrCreateVisit(
        interaction.visitId,
        userId,
        interaction.timestamp,
        "00:01:20",
        device,
        application
    );

    // PAGEVIEW
    // id, visit_id, date, time, time_spent, device, application, page_name
    await insertPageview(
        interaction.id,
        interaction.visitId,
        interaction.timestamp,
        interaction.timeSpent,
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
