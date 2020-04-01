/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { Container } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
// SERVICE IMPORTS - **DO NOT REMOVE THIS COMMENT**
import {
  FooService,
  TranslationService,
  UserService,
  TodoItemService,
  LessonService,
  ImportService,
  DuoLingoImportService
} from "@services";



export const registerInjectables = (container: Container) => {
  container.bind<UserService>("UserService").to(UserService);
  container.bind<ImportService>("ImportService").to(ImportService);
  container.bind<DuoLingoImportService>("DuoLingoImportService").to(DuoLingoImportService);
  container.bind<FooService>("FooService").to(FooService);
  container.bind<TodoItemService>("TodoItemService").to(TodoItemService);
  container.bind<TranslationService>("TranslationService").to(TranslationService);
  container.bind<LessonService>("LessonService").to(LessonService);
};
