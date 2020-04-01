/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { interfaces, controller, httpGet } from "inversify-express-utils";
/* --------------------------------- CUSTOM --------------------------------- */
import * as controllers from "@controllers";


/* -------------------------------------------------------------------------- */
/*                            CONTROLLER DEFINITION                           */
/* -------------------------------------------------------------------------- */
@controller("/api/v1")
export class ApiRootController implements interfaces.Controller {

    @httpGet("/")
    async handleRoot() {
        const endpoints: any = [`${process.env.DOMAIN}`, `${process.env.DOMAIN}/docs`];
        let controllerKeys = Object.keys(controllers)
            .map(key => key.toLowerCase())
            .filter(key => key.includes("controller") && !key.includes("general") && !key.includes("apiroot"))
            .map(key => key.replace("controller", ""));

        controllerKeys = Array.from(new Set(controllerKeys)); // Remove Duplicates

        controllerKeys.forEach(key => endpoints.push(`${process.env.DOMAIN}/api/v1/${key}s`));
        return { endpoints };
    }
}