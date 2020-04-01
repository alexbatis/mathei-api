/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { Request, Response, NextFunction } from "express";
import { Result, ValidationError, validationResult, check } from "express-validator";
import { ServerResponse } from "http";
import * as prettyjson from "prettyjson";
/* --------------------------------- CUSTOM --------------------------------- */
import { ABError, errorHandler } from "@models";
import { logger } from "@common";

/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
class ControllerService {
    /* ---------------------------- MEMBER VARIABLES ---------------------------- */

    validateMongoID = [check("id", "Must include a valid MongoDB objectID in the request url.").isMongoId()];


    /* --------------------------------- METHODS -------------------------------- */
    // Parse errors and send them as a response
    handleError(err: any, res: Response) {
        try {
            // If error being handled has options or response, strip them out in order to hide api request credentials in error response body
            delete err["options"];
            delete err["headers"];
            delete err["response"];

            // if the error message is in json, parse it instead of returning it as a string
            let errMsg = JSON.parse(JSON.stringify(err)).error;
            if (this.isJSONParsable(errMsg)) {
                errMsg = JSON.parse(errMsg);
                err["message"] = errMsg;
            }
        }
        catch (e) { /*couldnt parse error message, just continue */ }

        // De-serialize error and send it in a response body
        if (!(err instanceof ABError))
            err = errorHandler.handleError(err);
        res.status(err.status).json(err);
    }

    private isJSONParsable(text: string) {
        return (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, "@")
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            ? true
            : false;
    }

    assessErrors(req: Request, res: Response, next: NextFunction, errors: Result<ValidationError>, message?: string) {
        if (!message) message = "please make a valid request";
        if (!errors.isEmpty()) {
            const err = errorHandler.handleError(errors, `Bad request: ${message}`, 400);
            res.status(err.status).send(err);
        }
        else
            next();
    }

    validateRequest(validations: any) {
        return async (req: Request, res: Response, next: NextFunction) => {
            await Promise.all(validations.map((validation: any) => validation.run(req)));

            try {
                validationResult(req).throw();
                next();
            } catch (errors) {
                const err = errorHandler.handleError(errors.mapped(), "Bad request", 400);
                res.status(err.status).send(err);
            }
        };
    }

    performRequest(fn: any) {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (res.headersSent) return;

            try {
                const response = await fn(req, res, next);
                // response has already been sent, return
                if (response instanceof ServerResponse && response.headersSent) return;
                return res.send(response);
            } catch (err) {
                logger.error(err);
                if (err instanceof ServerResponse && err.headersSent) return;

                try {
                    // if the error message is in json, parse it instead of returning it as a string
                    let errMsg = JSON.parse(JSON.stringify(err)).error;
                    if (this.isJSONParsable(errMsg)) {
                        errMsg = JSON.parse(errMsg);
                        err.message = errMsg;
                    }
                }
                catch (e) { /* Couldn't parse error message, just continue */ }

                // de-serialize error and send it in a response body
                if (!(err instanceof ABError))
                    err = errorHandler.handleError(err);
                return res.status(err.status).json(err);

            }
        };
    }

    requestErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
        logger.error("\n" + prettyjson.render(err));
        if (err instanceof ServerResponse && err.headersSent) return;

        try {
            // if the error message is in json, parse it instead of returning it as a string
            let errMsg = JSON.parse(JSON.stringify(err)).error;
            if (this.isJSONParsable(errMsg)) {
                errMsg = JSON.parse(errMsg);
                err.message = errMsg;
            }
        }
        catch (e) { /* Couldn't parse error message, just continue */ }

        // de-serialize error and send it in a response body
        if (!(err instanceof ABError))
            err = errorHandler.handleError(err);
        return res.status(err.status).json(err);
    };

}

// Exported Instance
export const controllerService = new ControllerService();

