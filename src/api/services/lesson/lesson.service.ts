/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
import { Lesson, LessonModel, ABError } from "@models";


/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class LessonService {

    async all(): Promise<Lesson[]> {
        return LessonModel.find({});
    }

    async byQuery(query: object): Promise<Lesson[]> {
        return LessonModel.find(query);
    }

    async byUserId(userId): Promise<Lesson[]> {
        return LessonModel.find({ user: userId });
    }

    async byID(id): Promise<Lesson> {
        const lesson: Lesson = await LessonModel.findById(id);
        if (!lesson) throw new ABError({ "status": 404, "error": `Could not retrieve lesson with id ${id}` });
        return lesson;
    }

    async update(id: string, updatedLesson: Lesson): Promise<Lesson> {
        const existingLesson: Lesson = await LessonModel.findById(id);
        if (!existingLesson) throw new ABError({ "status": 404, "error": `Could not retrieve lesson with id ${id}` });
        await existingLesson.updateAndValidate(updatedLesson);
        const lesson: Lesson = await LessonModel.findByIdAndUpdate(id, existingLesson, { new: true });
        return lesson;
    }

    async create(lesson: Lesson): Promise<Lesson> {
        await this.validateLesson(lesson);
        return new LessonModel(lesson).save();
    }

    async delete(id: string): Promise<Lesson> {
        const lesson: Lesson = await LessonModel.findByIdAndRemove(id);
        if (!lesson) throw new ABError({ "status": 404, "error": `Could not delete lesson with id ${id}` });
        return lesson;
    }

    async deleteBy(query: object): Promise<number> {
        const lessons = await LessonModel.deleteMany(query)
        return lessons.deletedCount;
    }

    async validateLesson(lesson: any) {
        const lessonToValidate = new Lesson(lesson);
        try { await lessonToValidate.validateInstance(); }
        catch (err) { throw new ABError({ error: err, status: 400, message: "Bad Request" }); }
    }
}

// Exported Instance
export const lessonService = new LessonService();

