import { TodoItemService } from "@services";
const todoItemService = new TodoItemService();

const Query = {
  todoItems: () => todoItemService.all(),
  todoItem: (_, { id }) => todoItemService.byID(id)
};

const Mutation = {
  createTodoItem: (_, { todoItem }) => todoItemService.create(todoItem),
  updateTodoItem: (_, { id, todoItem }) => todoItemService.update(id, todoItem),
  deleteTodoItem: (_, { id }) => todoItemService.delete(id)
};

export const todoItemResolvers = { Query, Mutation };
