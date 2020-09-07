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
  IsOptional,
  IsArray,
} from "class-validator";
import { ObjectId } from "bson";
import { Lesson } from "./Lesson";
import { User } from "./User";

/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
@JsonObject("Translation")
export class Translation {
  /* ---------------------------- MEMBER VARIABLES ---------------------------- */
  readonly _id: ObjectId;

  @IsNotEmpty()
  @IsString()
  @JsonProperty("phrase", String)
  @prop()
  phrase: string;

  @IsNotEmpty()
  @IsString()
  @JsonProperty("translated", String)
  @prop()
  translated: string;

  @IsOptional()
  @IsString()
  @JsonProperty("phonetic", String)
  @prop()
  phonetic?: string;

  @IsOptional()
  @IsString()
  @JsonProperty("type", String)
  @prop()
  type?: string;

  @prop({ ref: User, index: true })
  user: Ref<User>;

  @IsNotEmpty()
  @prop({ ref: Lesson, index: true })
  lesson: Ref<Lesson>;

  @IsOptional()
  @IsArray()
  @prop()
  tags?: string[] = [];

  @IsOptional()
  @IsString()
  @prop()
  languageCode?: string;

  /* ------------------------------- CONSTRUCTOR ------------------------------ */
  constructor(translation?: Partial<Translation>) {
    Object.assign(this, translation);
  }

  /* --------------------------------- METHODS -------------------------------- */
  async validateInstance() {
    const errors = await validate(this);
    if (errors.length) throw errors;
    return true;
  }

  async updateAndValidate(updatedTranslation?: Partial<Translation>) {
    const updatedObject = Object.assign({}, this, updatedTranslation);
    const errors = await validate(updatedObject);
    if (errors.length) throw errors;
    Object.assign(this, updatedTranslation);
    return true;
  }
}

/* ----------------------------- TYPEGOOSE MODEL ---------------------------- */
export const TranslationModel = getModelForClass(Translation, {
  schemaOptions: { timestamps: true },
});
