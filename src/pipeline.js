import {INTERACTION_PAGEVIEW} from "config";
import {savePageview} from "cases/pageview";
import {findUserOnDatabase} from "services/db";
import log from "services/logger";


export default async function pipeline (event) {

    const interaction = event.data.element;

    const id = event.data.id;

    if (!id) {
        return null;
    }

    if (!(interaction && interaction.type  && interaction.body && interaction.userId)) {
        log.info(interaction, "Malformed event");
        return null;
    }

    // skip if user not found
    const userOnDB = await findUserOnDatabase(interaction.userId);
    if (userOnDB.length < 1) {
        log.info(`User not found on DB '${interaction.userId}'`);
        return null;
    }

    switch (interaction.type) {
    case INTERACTION_PAGEVIEW:
        await savePageview({
            ...interaction,
            ...interaction.body,
            id: id
        },
        userOnDB[0].id);

        break;
    default:
        return null;
    }
}
