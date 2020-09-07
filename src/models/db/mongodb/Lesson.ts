/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { JsonObject, JsonProperty } from "json2typescript";
import {
  validate,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsArray,
  IsOptional,
} from "class-validator";
import { ObjectId } from "bson";
import { User } from "./User";

/* ---------------------------- PARTIAL INTERFACE --------------------------- */
interface ILesson {
  name?: string;
}

/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
@JsonObject("Lesson")
export class Lesson {
  /* ---------------------------- MEMBER VARIABLES ---------------------------- */
  readonly _id: ObjectId;
  readonly id: ObjectId;

  @IsNotEmpty()
  // @IsMongoId()
  @prop({ ref: User, index: true })
  user: Ref<User>;

  @IsNotEmpty()
  @IsString()
  @JsonProperty("name", String)
  @prop()
  name: string;

  @IsArray()
  @prop()
  resources?: string[] = [];

  @IsOptional()
  @IsString()
  @prop()
  description?: string;

  @IsOptional()
  @IsString()
  @prop()
  importKey?: string;

  @IsOptional()
  @IsArray()
  @prop()
  tags?: string[] = [];

  @IsOptional()
  @IsString()
  @prop()
  languageCode?: string;

  @IsOptional()
  @prop({ ref: Lesson, index: true })
  from?: Ref<Lesson>;

  /* ------------------------------- CONSTRUCTOR ------------------------------ */
  constructor(lesson?: Partial<Lesson>) {
    Object.assign(this, lesson);
  }

  /* --------------------------------- METHODS -------------------------------- */
  async validateInstance() {
    const errors = await validate(this);
    if (errors.length) throw errors;
    return true;
  }

  async updateAndValidate(updatedLesson?: ILesson) {
    const updatedObject = Object.assign({}, this, updatedLesson);
    const errors = await validate(updatedObject);
    if (errors.length) throw errors;
    Object.assign(this, updatedLesson);
    return true;
  }
}

/* ----------------------------- TYPEGOOSE MODEL ---------------------------- */
export const LessonModel = getModelForClass(Lesson, {
  schemaOptions: { timestamps: true },
});
