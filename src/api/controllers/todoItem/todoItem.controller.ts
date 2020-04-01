/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* --------------------------------- CUSTOM --------------------------------- */
import { interfaces, controller, httpGet, httpPost, httpPut, httpDelete, response, requestParam, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import { Response } from "express";
/* --------------------------------- CUSTOM --------------------------------- */
import { TodoItemService } from "@services";
import { todoItemValidator } from "./todoItem.validator";


/* -------------------------------------------------------------------------- */
/*                            CONTROLLER DEFINITION                           */
/* -------------------------------------------------------------------------- */
@controller("/api/v1/todoItems")
export class TodoItemController implements interfaces.Controller {

    constructor(@inject("TodoItemService") private todoItemService: TodoItemService) { }

    @httpGet("/")
    async index() {
        return this.todoItemService.all();
    }

    @httpGet("/:id", todoItemValidator.validateMongoID)
    async list(@requestParam("id") id: string) {
        return this.todoItemService.byID(id);
    }

    @httpPost("/")
    async create(@requestBody() body, @response() res: Response) {
        const todoItem = await this.todoItemService.create(body);
        return res.status(201).json(todoItem);
    }

    @httpPut("/:id", todoItemValidator.validatePut)
    async update(@requestParam("id") id: string, @requestBody() body) {
        return this.todoItemService.update(id, body);
    }

    @httpDelete("/:id")
    async delete(@requestParam("id") id: string, @response() res: Response) {
        await this.todoItemService.delete(id);
        return res.status(204).send();
    }
}