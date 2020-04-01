/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { check, body } from "express-validator";
/* --------------------------------- CUSTOM --------------------------------- */
import { controllerService } from "@services";
const { validateRequest, validateMongoID } = controllerService;

/* -------------------------------------------------------------------------- */
/*                            VALIDATOR DEFINITIONS                           */
/* -------------------------------------------------------------------------- */
export const fooValidator = {
  validateMongoID: validateRequest(validateMongoID),
  validatePost: validateRequest([]),
  validatePut: validateRequest(validateMongoID.concat([
    check("someInt").isInt().withMessage("'someInt' must be an integer value."),
    check("someString").isString().withMessage("'someString' must be a string value.")]))
};


