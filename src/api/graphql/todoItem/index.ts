import { makeExecutableSchema } from "apollo-server-express";
import { todoItemResolvers } from "./todoItem.resolvers";
import * as fs from "fs";

const typeDefs = fs.readFileSync("src/api/graphql/todoItem/todoItem.schema.graphql", { encoding: "utf8" });

export const todoItemSchema = makeExecutableSchema({
  typeDefs,
  resolvers: todoItemResolvers
});
