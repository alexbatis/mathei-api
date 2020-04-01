/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { interfaces, controller, httpGet, request, response, next } from "inversify-express-utils";
import { httpPost } from "inversify-express-utils";
import { inject } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
import { UserService } from "@services";
import { User } from "@models";
import { auth } from "../../../common/auth/auth";


/* -------------------------------------------------------------------------- */
/*                            CONTROLLER DEFINITION                           */
/* -------------------------------------------------------------------------- */
@controller("/auth")
export class AuthController implements interfaces.Controller {

  /* ------------------------------- CONSTRUCTOR ------------------------------ */
  constructor(@inject("UserService") private userService: UserService) { }


  /* ------------------------------- CREATE USER ------------------------------ */
  @httpPost("/register")
  async register(@request() req, @response() res) {
    const { body: { password } } = req;
    try {
      const _user = new User(req.body, password);
      const user = await this.userService.create(_user, password);
      return res.json(user.toAuthJSON());
    } catch (error) {
      return res.json({ error }).status(500);
    }
  }

  /* ------------------------------ AUTHENTICATE ------------------------------ */
  @httpPost("/login")
  async login(@request() req) {
    const { body: { email, password } } = req;
    const user = await this.userService.byEmail(email);

    if (!user) throw new Error(`Email ${email} is not registered`);
    if (!user.validatePassword(password)) throw new Error("Invalid password");

    return user.toAuthJSON()
  }


  @httpGet("/refresh", auth.required)
  async refresh(@request() req) {
    const user = await this.userService.byEmail(req.user.email);
    return user.toAuthJSON();
  }

  /* ------------------------------- GOOGLE AUTH ------------------------------ */
  @httpGet("/login/google", auth.google)
  async googleLogin() { }

  @httpPost("/login/google", auth.googleToken)
  async googleTest(@request() req) {
    return req.user.toAuthJSON();
  }

  @httpGet("/redirect", auth.google)
  async redirect(@request() req) {
    const user = await this.userService.byEmail(req.user.email);
    return user.toAuthJSON();
  }

}
