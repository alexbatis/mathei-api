/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable } from "inversify";
/* --------------------------------- CUSTOM --------------------------------- */
import { Translation, TranslationModel, ABError, PaginationOpts } from "@models";
import { LessonService } from "@services";
const lessonService = new LessonService();


/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class TranslationService {


    async all(): Promise<Translation[]> {
        return TranslationModel.find({});
    }

    async byUserId(userId, opts?: PaginationOpts): Promise<Translation[]> {
        const query = opts?.searchText ?
            {
                $and: [
                    { user: userId },
                    {
                        phrase: {
                            $regex: opts.searchText, $options: 'i'
                        }
                    }
                ]
            } :
            { user: userId }

        let sort = {}
        if (opts?.sortBy)
            sort[opts.sortBy] = (opts.sortDir === 'asc') ? 1 : -1;

        return TranslationModel
            .find(query)
            .skip(opts?.start || 0)
            .limit(opts?.limit || null)
            .sort(sort);
    }

    async byID(id: string): Promise<Translation> {
        const translation: Translation = await TranslationModel.findById(id);
        if (!translation) throw new ABError({ "status": 404, "error": `Could not retrieve translation with id ${id}` });
        return translation;
    }

    async byLessonID(lessonId): Promise<Translation[]> {
        return TranslationModel.find({ lesson: lessonId });
    }

    async update(id: string, updatedTranslation: Translation): Promise<Translation> {
        const existingTranslation: Translation = await TranslationModel.findById(id);
        if (!existingTranslation) throw new ABError({ "status": 404, "error": `Could not retrieve translation with id ${id}` });
        await existingTranslation.updateAndValidate(updatedTranslation);
        const translation: Translation = await TranslationModel.findByIdAndUpdate(id, existingTranslation, { new: true });
        return translation;
    }

    async create(translation: Translation): Promise<Translation> {
        await this.validateTranslation(translation);
        const lesson = await lessonService.byID(translation.lesson);
        if (!lesson) throw new Error(`Cant create translation because lesson with id ${translation.lesson} doesn't exist`);
        if (lesson.user.toString() !== translation.user.toString()) throw new Error("Unauthorized");
        return new TranslationModel(translation).save();
    }

    async delete(id: string): Promise<Translation> {
        const translation: Translation = await TranslationModel.findByIdAndRemove(id);
        if (!translation) throw new ABError({ "status": 404, "error": `Could not delete translation with id ${id}` });
        return translation;
    }

    async deleteBy(query: object): Promise<Array<Translation>> {
        const translations: Array<Translation> = await TranslationModel.find(query).remove()
        return translations;
    }

    async validateTranslation(translation: any) {
        const translationToValidate = new Translation(translation);
        try { await translationToValidate.validateInstance(); }
        catch (err) { throw new ABError({ error: err, status: 400, message: "Bad Request" }); }
    }
}

// Exported Instance
export const translationService = new TranslationService();

