/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";
/* --------------------------------- CUSTOM --------------------------------- */
import { lessonTypeDefs, lessonResolvers } from "./lesson";
import { translationTypeDefs, translationResolvers } from "./translation";
export * from './utils'

/* ---------------------------- EXPANDABLE SCHEMA --------------------------- */
const Default = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

/* ----------------------------- GRAPHQL SCHEMA ----------------------------- */
export const schemas = makeExecutableSchema({
  typeDefs: [Default, lessonTypeDefs, translationTypeDefs],
  resolvers: merge(lessonResolvers, translationResolvers)
});
