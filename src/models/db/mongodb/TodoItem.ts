/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { prop, getModelForClass } from "@typegoose/typegoose";
import { JsonObject, JsonProperty } from "json2typescript";;
import { validate, IsNotEmpty, IsString, IsBoolean } from "class-validator";


/* ---------------------------- PARTIAL INTERFACE --------------------------- */
interface ITodoItem {
    description?: string;
    completed?: boolean;
}


/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
@JsonObject
export class TodoItem {
    /* ---------------------------- MEMBER VARIABLES ---------------------------- */
    @IsNotEmpty()
    @IsString()
    @JsonProperty("description", String)
    @prop()
    description: string;

    @IsBoolean()
    @JsonProperty("completed", Boolean)
    @prop()
    completed: boolean;

    /* ------------------------------- CONSTRUCTOR ------------------------------ */
    constructor(todoItem?: ITodoItem) {
        this.description = todoItem && todoItem.description || null;
        this.completed = (todoItem && typeof todoItem.completed !== "undefined") ? todoItem.completed : null;
    }

    /* --------------------------------- METHODS -------------------------------- */
    async validateInstance() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }

    async updateAndValidate(updatedTodoItem?: ITodoItem) {
        this.description = updatedTodoItem && updatedTodoItem.description || this.description;
        this.completed = typeof updatedTodoItem.completed === "boolean" ? updatedTodoItem.completed : updatedTodoItem && updatedTodoItem.completed || this.completed;
        await this.validateInstance();
        return true;
    }
}


/* ----------------------------- TYPEGOOSE MODEL ---------------------------- */
export const TodoItemModel = getModelForClass(TodoItem, { schemaOptions: { timestamps: true } });
