/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* --------------------------------- CUSTOM --------------------------------- */
import { interfaces, controller, httpGet, httpPost, httpPut, httpDelete, response, requestParam, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import { Response } from "express";
/* --------------------------------- CUSTOM --------------------------------- */
import { FooService } from "@services";
import { fooValidator } from "./foo.validator";


/* -------------------------------------------------------------------------- */
/*                            CONTROLLER DEFINITION                           */
/* -------------------------------------------------------------------------- */
@controller("/api/v1/foos")
export class FooController implements interfaces.Controller {

    /* ------------------------------- CONSTRUCTOR ------------------------------ */
    constructor(@inject("FooService") private fooService: FooService) { }

    @httpGet("/")
    async index() {
        return this.fooService.all();
    }

    @httpGet("/:id", fooValidator.validateMongoID)
    async list(@requestParam("id") id: string) {
        return this.fooService.byID(id);
    }

    @httpPost("/")
    async create(@requestBody() body, @response() res: Response) {
        const foo = await this.fooService.create(body);
        return res.status(201).json(foo);
    }

    @httpPut("/:id", fooValidator.validatePut)
    async update(@requestParam("id") id: string, @requestBody() body) {
        return this.fooService.update(id, body);
    }

    @httpDelete("/:id")
    async delete(@requestParam("id") id: string, @response() res: Response) {
        await this.fooService.delete(id);
        return res.status(204).send();
    }
}