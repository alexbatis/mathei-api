/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { prop, getModelForClass } from "@typegoose/typegoose";
import { JsonObject, JsonProperty } from "json2typescript";
import { validate, IsInt, IsString } from "class-validator";


/* ---------------------------- PARTIAL INTERFACE --------------------------- */
interface IFoo {
    someInt?: number;
    someString?: string;
}


/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
@JsonObject
export class Foo {
    /* ---------------------------- MEMBER VARIABLES ---------------------------- */
    @IsInt()
    @JsonProperty("someInt", Number)
    @prop()
    someInt: number;

    @IsString()
    @JsonProperty("someString", String)
    @prop()
    someString: string;

    /* ------------------------------- CONSTRUCTOR ------------------------------ */
    constructor(foo?: IFoo) {
        this.someInt = foo && foo.someInt || null;
        this.someString = foo && foo.someString || null;
    }

    /* --------------------------------- METHODS -------------------------------- */
    async validateInstance() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }

    async updateAndValidate(updatedFoo?: IFoo) {
        this.someInt = updatedFoo && updatedFoo.someInt || this.someInt;
        this.someString = updatedFoo && updatedFoo.someString || this.someString;
        await this.validateInstance();
        return true;
    }
}


/* ----------------------------- TYPEGOOSE MODEL ---------------------------- */
export const FooModel = getModelForClass(Foo, { schemaOptions: { timestamps: true } });
