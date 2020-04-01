/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { gql } from "apollo-server-express";
import * as fs from "fs";
/* --------------------------------- CUSTOM --------------------------------- */
export * from "./lesson.resolvers";

export const lessonTypeDefs = gql(fs.readFileSync("src/api/graphql/lesson/lesson.schema.graphql", { encoding: "utf8" }));
