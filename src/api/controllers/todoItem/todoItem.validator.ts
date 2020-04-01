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
export const todoItemValidator = {
  validateMongoID: validateRequest(validateMongoID),
  validatePost: validateRequest([]),
  validatePut: validateRequest(validateMongoID.concat([
    check("description").not().isEmpty().withMessage("'description' must not be empty."),
    check("description").isString().withMessage("'description' must be a string value."),
    check("completed").isBoolean().withMessage("'completed' must be an boolean value.")]))
};


