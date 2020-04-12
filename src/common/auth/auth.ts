/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from "inversify";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as GoogleStrategy from "passport-google-oauth20";
const GoogleTokenStrategy = require("passport-google-token").Strategy;
import * as jwt from "jsonwebtoken";
import * as expressJwt from "express-jwt";
/* --------------------------------- CUSTOM --------------------------------- */
import {AuthRole, UserModel } from "@models";
import { UserService } from "@services";
const userService = new UserService();

/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class AuthService {

  configurePassport() {
    /* ----------------------------- LOCAL STRATEGY ----------------------------- */
    const fields = { usernameField: "email", passwordField: "password" };
    passport.use(new LocalStrategy(fields, async (email, password, done) => {
      try {
        const user = await userService.byEmail(email);
        if (user.validatePassword(password)) throw new Error("Invalid password");
        return done(null, user);
      }
      catch (error) {
        return done(error);
      }
    }));


    /* ----------------------------- GOOGLE STRATEGY ---------------------------- */
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/redirect"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const { name: { givenName: firstName, familyName: lastName } } = profile;
        const email = profile.emails[0].value;
        const user = await UserModel.findOne({ email });
        if (user) return done(null, user);
        const createdUser = await new UserModel({ email, firstName, lastName, authType: "GOOGLE" }).save();
        done(null, createdUser);
      }
      catch (err) {
        done(err);
      }
    }));

    /* -------------------------- GOOGLE TOKEN STRATEGY ------------------------- */
    passport.use(new GoogleTokenStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: "DOp2ngWqfBlKrIeUx0kkZMOT",
    },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name: { givenName: firstName, familyName: lastName } } = profile;
          const email = profile.emails[0].value;
          const user = await UserModel.findOne({ email });
          if (user) return done(null, user);
          const newUser: any = { email, firstName, lastName, authType: "GOOGLE" };

          try {
            const raw = JSON.parse(profile._raw);
            if (raw.picture) newUser.avatar = raw.picture;
          } catch (err) { }

          const createdUser = await new UserModel(newUser).save();
          done(null, createdUser);
        }
        catch (err) {
          done(err);
        }
      }
    ));
  }
}

// Exported Instance
export const authService = new AuthService();

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  return (authorization) ? authorization.split(" ")[1] : null;
};


/* -------------------------------------------------------------------------- */
/*                                AUTH SCHEMES                                */
/* -------------------------------------------------------------------------- */
export const auth = {
  required: expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    getToken: getTokenFromHeaders,
  }),
  optional: expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
  google: passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"]
  }),
  googleToken: passport.authenticate("google-token", {
    session: false,
    scope: ["profile", "email"]
  }),
  graphQlJWT: ({ req, connection }) => {
    const token = (connection && connection.context && connection.context.accessToken) ?
      connection.context.accessToken :
      getTokenFromHeaders(req);

    if (!token) return null
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    return userService.byEmail(decodedUser["email"]);
  },
  checkHasRole: (roles: Array<AuthRole>) => async (req, res, next) => {
    try {
      const user = await userService.byID(req.user.id)
      const hasRole = user.roles.filter(x => roles.includes(x)).length !== 0;
      return (hasRole) ? next() : res.send('Unauthorized').status(401)
    } catch (e) {
      return res.send('Unauthorized').status(401)
    }
  }
};
