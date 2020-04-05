/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from 'inversify';
/* --------------------------------- CUSTOM --------------------------------- */
import { LessonService, TranslationService } from "@services";
import { Lesson, User, Translation } from "@models";
import { checkAuth } from "../utils";
const lessonService = new LessonService();
const translationService = new TranslationService();

/* -------------------------------------------------------------------------- */
/*                             RESOLVER DEFINITION                            */
/* -------------------------------------------------------------------------- */
@injectable()
export class LessonsResolver {

  /* ---------------------------- MEMBER VARIABLES ---------------------------- */
  public resolver;

  /* ------------------------------- CONSTRUCTOR ------------------------------ */
  constructor() {
    this.resolver = {
      Query: {
        lessons: checkAuth((root, args, { user }) => this.getLessons(user._id)),
        lesson: checkAuth((root, { id }) => this.getLesson(id))
      },
      Mutation: {
        createLesson: checkAuth((root, { lesson }, { user }: { user?: User }) => this.createLesson(lesson, user._id)),
        updateLesson: checkAuth((root, { id, lesson }, { user }: { user?: User }) => this.updateLesson(lesson, id, user._id)),
        deleteLesson: checkAuth((root, { id }, { user }: { user?: User }) => this.deleteLesson(id))
      },
      Lesson: {
        translations: (lesson: Lesson) => this.getTranslations(lesson._id)
      }
    };
  }

  /* ----------------------------- LESSON QUERIES ----------------------------- */
  private async getLessons(userId: string) {
    return lessonService.byUserId(userId)
  }

  private async getLesson(lessonId: string) {
    return lessonService.byID(lessonId)
  }

  private async getTranslations(lessonId) {
    return translationService.byLessonID(lessonId)
  }

  /* -------------------------------- MUTATIONS ------------------------------- */
  private async createLesson(lesson, userId) {
    lesson.user = userId;
    const createdLesson = await lessonService.create(lesson);
    await this.createOrUpdateTranslations(createdLesson._id, userId, lesson.translations || []);
    return createdLesson;
  }

  private async updateLesson(lesson, lessonId, userId) {
    const existingLesson = await lessonService.byID(lessonId);
    if (!existingLesson) throw new Error(`No Lesson found with id ${lessonId}`);
    if (existingLesson.user.toString() !== userId.toString()) throw new Error("Unauthorized");
    const _lesson = await lessonService.update(lessonId, lesson);
    const translationResults = await this.createOrUpdateTranslations(_lesson._id, userId, lesson.translations || []);
    const translations = (lesson.translations || []).concat(translationResults)
    await this.deleteTranslationsFromLesson(_lesson._id, translations);
    return _lesson;
  }

  private async deleteLesson(lessonId) {
    const deletedLesson = await lessonService.delete(lessonId)
    await translationService.deleteBy({ lesson: deletedLesson._id })
    return deletedLesson
  }

  private async createOrUpdateTranslations(lessonId, userId, translations): Promise<Array<Translation>> {
    const translationMutations = translations.map(translation => {
      translation.user = userId;
      translation.lesson = lessonId;
      return (translation.id) ?
        translationService.update(translation.id, translation) :
        translationService.create(translation);
    });
    return await Promise.all(translationMutations);
  }

  private async deleteTranslationsFromLesson(lessonId, translations) {
    const existingLesson = await lessonService.byID(lessonId);
    const translationIds = translations.map(translation => translation.id)
    return await translationService.deleteBy({
      $and: [
        { lesson: lessonId },
        {
          _id: { $nin: translationIds }
        }
      ]
    })
  }

}

export const lessonResolvers = new LessonsResolver().resolver