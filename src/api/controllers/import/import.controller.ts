/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { interfaces, controller, request, httpPost, requestBody } from "inversify-express-utils";
// import { auth } from "@common";
import { auth } from "../../../common/auth/auth";
import { importValidator } from "./import.validator";
import { inject } from "inversify";
import { ImportService } from "@services";

/* -------------------------------------------------------------------------- */
/*                            CONTROLLER DEFINITION                           */
/* -------------------------------------------------------------------------- */
@controller("/api/v1/import")
export class ImportController implements interfaces.Controller {

  constructor(
    @inject("ImportService") private importService: ImportService
  ) { }


  @httpPost("/duolingo", auth.required, importValidator.validateDuoLingo)
  async handleRoot(@request() req, @requestBody() body) {
    const { duoEmail, duoPassword } = body
    return this.importService.duolingo(duoEmail, duoPassword, req.user)
  }
}
