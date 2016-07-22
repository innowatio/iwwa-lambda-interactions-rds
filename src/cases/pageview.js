import {findOrCreateVisit, insertPageview} from "../services/db";
import moment from "moment";


export async function savePageview (interaction) {

    const utcTimestamp = moment.utc(interaction.timestamp);


    // VISIT
    // id, user_app_id, date, time, time_spent, zulu_time, device, application
    const visitParams = [
        interaction.visitId,
        interaction.userId,
        utcTimestamp.format("YYYY-MM-DD"),
        utcTimestamp.format("HH:mm:ss"),
        "00:01:20",
        interaction.timestamp,
        interaction.device,
        interaction.application
    ];
    await findOrCreateVisit(...visitParams);

    // PAGEVIEW
    // id, visit_id, date, time, time_spent, full_timestamp, device, application, page_name
    await insertPageview(
        interaction.id,
        interaction.visitId,
        utcTimestamp.format("YYYY-MM-DD"),
        utcTimestamp.format("HH:mm:ss"),
        interaction.timeSpent,
        interaction.timestamp,
        interaction.device,
        interaction.application,
        interaction.view
    );
}
