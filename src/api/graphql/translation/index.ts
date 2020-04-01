/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import * as fs from "fs";
import { gql } from "apollo-server-express";
/* --------------------------------- CUSTOM --------------------------------- */
export * from "./translation.resolvers";


export const translationTypeDefs = gql(fs.readFileSync("src/api/graphql/translation/translation.schema.graphql", { encoding: "utf8" }));
