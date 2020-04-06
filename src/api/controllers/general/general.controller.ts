/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { interfaces, controller, httpGet } from "inversify-express-utils";

/* -------------------------------------------------------------------------- */
/*                            CONTROLLER DEFINITION                           */
/* -------------------------------------------------------------------------- */
@controller("/")
export class GeneralController implements interfaces.Controller {
  @httpGet("/")
  async handleRoot() {
    return {
      message: "Server up and running!",
      environment: process.env.ENV_NAME,
      docs: `${process.env.DOMAIN}/docs`,
      api: `${process.env.DOMAIN}/api/v1/`,
      graphql: `${process.env.DOMAIN}/graphql`
    };
  }
}
