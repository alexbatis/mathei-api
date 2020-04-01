/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
import { Foo, FooModel, ABError } from "@models";


/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class FooService {

    async all(): Promise<Foo[]> {
        return FooModel.find({});
    }

    async byID(id: string): Promise<Foo> {
        const foo: Foo = await FooModel.findById(id);
        if (!foo) throw new ABError({ "status": 404, "error": `Could not retrieve foo with id ${id}` });
        return foo;
    }

    async update(id: string, updatedFoo: Foo): Promise<Foo> {
        const existingFoo: Foo = await FooModel.findById(id);
        if (!existingFoo) throw new ABError({ "status": 404, "error": `Could not retrieve foo with id ${id}` });
        const updatedFooToValidate = new Foo(existingFoo);
        await updatedFooToValidate.updateAndValidate(updatedFoo);
        const foo: Foo = await FooModel.findByIdAndUpdate(id, updatedFooToValidate, { new: true });
        return foo;
    }

    async create(foo: Foo): Promise<Foo> {
        await this.validateFoo(foo);
        return new FooModel(foo).save();
    }

    async delete(id: string): Promise<Foo> {
        const foo: Foo = await FooModel.findByIdAndRemove(id);
        if (!foo) throw new ABError({ "status": 404, "error": `Could not delete foo with id ${id}` });
        return foo;
    }

    async validateFoo(foo: any) {
        const fooToValidate = new Foo(foo);
        try { await fooToValidate.validateInstance(); }
        catch (err) { throw new ABError({ error: err, status: 400, message: "Bad Request" }); }
    }
}

// Exported Instance
export const fooService = new FooService();

