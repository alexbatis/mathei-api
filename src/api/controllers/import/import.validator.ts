/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { check, body } from "express-validator";
/* --------------------------------- CUSTOM --------------------------------- */
import { controllerService } from "@services";
const { validateRequest } = controllerService;

/* -------------------------------------------------------------------------- */
/*                            VALIDATOR DEFINITIONS                           */
/* -------------------------------------------------------------------------- */
export const importValidator = {
  validateDuoLingo: validateRequest([
    check("duoEmail").isString().withMessage("'duoEmail' must be a string value."),
    check("duoPassword").isString().withMessage("'duoPassword' must be a string value.")
  ])
}
