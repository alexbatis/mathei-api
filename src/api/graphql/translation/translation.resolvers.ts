/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from 'inversify';
/* --------------------------------- CUSTOM --------------------------------- */
import { LessonService, TranslationService } from "@services";
import { User, Translation } from "@models";
import { checkAuth } from "../utils";
const lessonService = new LessonService();
const translationService = new TranslationService();

/* -------------------------------------------------------------------------- */
/*                             RESOLVER DEFINITION                            */
/* -------------------------------------------------------------------------- */
@injectable()
export class TranslationResolver {

  /* ---------------------------- MEMBER VARIABLES ---------------------------- */
  public resolver;

  /* ------------------------------- CONSTRUCTOR ------------------------------ */
  constructor() {
    this.resolver = {
      Query: {
        translations: checkAuth((_, _1, { user }: { user?: User }) => this.getTranslations(user._id)),
        paginatedTranslations: checkAuth((_, { opts }, { user }: { user?: User }) => {
          console.log('sdf')
          return this.getTranslations(user._id, opts)
        }),
        translation: checkAuth((_, { id }) => this.getTranslation(id))
      },
      Mutation: {
        createTranslation: checkAuth((root, { translation }, { user }: { user?: User }) => this.createTranslation(translation, user._id)),
        updateTranslation: (_, { id, translation }) => translationService.update(id, translation),
        deleteTranslation: (_, { id }) => translationService.delete(id)
      },
      Translation: {
        lesson: (translation: Translation) => lessonService.byID(translation.lesson)
      }
    };
  }

  /* --------------------------------- QUERIES -------------------------------- */
  private async getTranslations(userId, opts?) {
    return translationService.byUserId(userId, opts)
  }

  private async getTranslation(translationId: string) {
    return translationService.byID(translationId)
  }


  /* -------------------------------- MUTATIONS ------------------------------- */
  private async createTranslation(translation, userId) {
    translation.user = userId;
    return await translationService.create(translation);
  }

}

export const translationResolvers = new TranslationResolver().resolver