/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
import { TodoItem, TodoItemModel, ABError } from "@models";


/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class TodoItemService {

    async all(): Promise<TodoItem[]> {
        return TodoItemModel.find({});
    }

    async byID(id: string): Promise<TodoItem> {
        const todoItem: TodoItem = await TodoItemModel.findById(id);
        if (!todoItem) throw new ABError({ "status": 404, "error": `Could not retrieve todoItem with id ${id}` });
        return todoItem;
    }

    async update(id: string, updatedTodoItem: TodoItem): Promise<TodoItem> {
        const existingTodoItem: TodoItem = await TodoItemModel.findById(id);
        if (!existingTodoItem) throw new ABError({ "status": 404, "error": `Could not retrieve todoItem with id ${id}` });
        const updatedTodoItemToValidate = new TodoItem(existingTodoItem);
        await updatedTodoItemToValidate.updateAndValidate(updatedTodoItem);
        const todoItem: TodoItem = await TodoItemModel.findByIdAndUpdate(id, updatedTodoItemToValidate, { new: true });
        return todoItem;
    }

    async create(todoItem: TodoItem): Promise<TodoItem> {
        await this.validateTodoItem(todoItem);
        return new TodoItemModel(todoItem).save();
    }

    async delete(id: string): Promise<TodoItem> {
        const todoItem: TodoItem = await TodoItemModel.findByIdAndRemove(id);
        if (!todoItem) throw new ABError({ "status": 404, "error": `Could not delete todoItem with id ${id}` });
        return todoItem;
    }

    async validateTodoItem(todoItem: any) {
        const todoItemToValidate = new TodoItem(todoItem);
        try { await todoItemToValidate.validateInstance(); }
        catch (err) { throw new ABError({ error: err, status: 400, message: "Bad Request" }); }
    }
}

// Exported Instance
export const todoItemService = new TodoItemService();

