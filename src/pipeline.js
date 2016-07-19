import {INTERACTION_PAGEVIEW} from "config";
import {savePageview} from "cases/pageview";

export default async function pipeline (event) {

    const interaction = event.data.element;

    if (!interaction || !interaction.type|| !interaction.body) {
        return null;
    }

    switch (interaction.type) {
    case INTERACTION_PAGEVIEW:
        await savePageview({...interaction, ...interaction.body});
        break;
    default:
        return null;
    }
}
