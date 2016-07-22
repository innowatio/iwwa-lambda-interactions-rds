import {INTERACTION_PAGEVIEW} from "config";
import {savePageview} from "cases/pageview";

export default async function pipeline (event) {

    const interaction = event.data.element;

    const id = event.data.id;

    if (!id) {
        return null;
    }

    if (!interaction || !interaction.type|| !interaction.body) {
        return null;
    }

    switch (interaction.type) {
    case INTERACTION_PAGEVIEW:
        await savePageview({
            ...interaction,
            ...interaction.body,
            id: id
        });

        break;
    default:
        return null;
    }
}
