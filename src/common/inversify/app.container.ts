/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { Container } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
import { registerInjectables } from "./injectables";


export const createContainer = () => {
    const container = new Container();
    registerInjectables(container);
    return container;
};