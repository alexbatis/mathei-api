/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable, inject } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
// import { Foo, FooModel } from "@models";
// import { LessonService } from "../lesson/lesson.service";
import { DuoLingoImportService } from "./duolingo-import.service";
import { User } from "@models";


/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class ImportService {

    constructor(
        @inject("DuoLingoImportService") private duoLingo: DuoLingoImportService,
    ) { }

    async duolingo(duoEmail: string, duoPassword: string, user: User) {
        return this.duoLingo.import(duoEmail, duoPassword, user)
    }

}

// Exported Instance
// export const importService = new ImportService(new DuoLingoImportService());


