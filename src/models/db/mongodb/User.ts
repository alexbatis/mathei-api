/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { prop, getModelForClass, index } from "@typegoose/typegoose";
import { JsonObject, JsonProperty } from "json2typescript";
import { validate, IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";
import { ObjectId } from "bson";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";


export enum AuthType {
  BASIC = "basic",
  GOOGLE = "google"
}

/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
@JsonObject
export class User {
  /* ---------------------------- MEMBER VARIABLES ---------------------------- */
  readonly _id: ObjectId;

  @IsNotEmpty()
  @IsString()
  @JsonProperty("firstName", String)
  @prop()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @JsonProperty("lastName", String)
  @prop()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @JsonProperty("email", String)
  @prop({ unique: true, index: true })
  email: string;


  @IsNotEmpty()
  @IsString()
  @JsonProperty("salt", String)
  @prop()
  salt: string;

  @IsNotEmpty()
  @IsString()
  @JsonProperty("hash", String)
  @prop()
  hash: string;

  @IsOptional()
  @IsString()
  @JsonProperty("avatar", String)
  @prop()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  @JsonProperty("authType", String)
  @prop()
  authType: string = AuthType.BASIC;


  /* ------------------------------- CONSTRUCTOR ------------------------------ */
  constructor(user?: Partial<User>, password?: string) {
    if (password) {
      this.setPassword(password);
    }
    Object.assign(this, user);
  }

  /* --------------------------------- METHODS -------------------------------- */
  async validateInstance() {
    const errors = await validate(this);
    if (errors.length) throw errors;
    return true;
  }

  async updateAndValidate(updatedTranslation?: Partial<User>) {
    const updatedObject = Object.assign({}, this, updatedTranslation);
    const errors = await validate(updatedObject);
    if (errors.length) throw errors;
    Object.assign(this, updatedTranslation);
    return this;
  }

  setPassword(password: string) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
  }

  validatePassword(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
    return this.hash === hash;
  }

  generateJWT() {
    // if (this.type === "GOOGLE")
    const today = new Date();
    const expirationDate = new Date(today);
    // expirationDate.setSeconds(today.getSeconds() + 15);
    expirationDate.setDate(today.getDate() + 30);
    return jwt.sign({
      email: this.email,
      firstName : this.firstName,
      lastName : this.lastName,
      id: this._id,
      _id: this._id,
      avatar : this.avatar,
      exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
    }, process.env.JWT_SECRET);
  }

  generateRefreshToken() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 30);
    return jwt.sign({
      email: this.email,
      id: this._id,
      _id: this._id,
      exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
    }, process.env.JWT_SECRET);
  }

  toAuthJSON() {
    return {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      authType: this.authType,
      avatar : this.avatar,
      token: this.generateJWT(),
      refreshToken: this.generateRefreshToken()
    };
  }
}


/* ----------------------------- TYPEGOOSE MODEL ---------------------------- */
export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });
