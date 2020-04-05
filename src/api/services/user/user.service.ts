/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
import { User, UserModel, ABError } from "@models";


/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class UserService {

  async byID(id): Promise<User> {
    const user: User = await UserModel.findById(id);
    if (!user) throw new ABError({ "status": 404, "error": `Could not retrieve user with id ${id}` });
    return user;
  }

  async byEmail(email): Promise<User> {
    const user: User = await UserModel.findOne({ email });
    if (!user) throw new ABError({ "status": 404, "error": `Could not retrieve user with email ${email}` });
    return user;
  }

  async update(id: string, updatedUser: User): Promise<User> {
    const existingUser: User = await UserModel.findById(id);
    if (!existingUser) throw new ABError({ "status": 404, "error": `Could not retrieve user with id ${id}` });
    if (existingUser.authType === 'GOOGLE')
      delete existingUser.email

    const validatedUser = await existingUser.updateAndValidate(updatedUser)
    // const updatedUserToValidate = new User(existingUser);
    // await updatedUserToValidate.updateAndValidate(updatedUser);
    const user: User = await UserModel.findByIdAndUpdate(id, validatedUser, { new: true });
    return user;
  }

  async create(user: User, password: string): Promise<User> {
    const newUser = new User(user, password);
    await this.validateUser(newUser);
    return new UserModel(newUser).save();
  }

  // async delete(id: string): Promise<User> {
  //   const user: User = await UserModel.findByIdAndRemove(id);
  //   if (!user) throw new ABError({ "status": 404, "error": `Could not delete user with id ${id}` });
  //   return user;
  // }

  async validateUser(user: any) {
    const userToValidate = new User(user);
    try { await userToValidate.validateInstance(); }
    catch (err) { throw new ABError({ error: err, status: 400, message: "Bad Request" }); }
  }
}

// Exported Instance
export const userService = new UserService();

