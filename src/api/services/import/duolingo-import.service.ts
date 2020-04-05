/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { injectable, inject } from "inversify";
import axios from 'axios';
/* --------------------------------- CUSTOM --------------------------------- */
// import { Foo, FooModel } from "@models";
import { LessonService } from "../lesson/lesson.service";
import { TranslationService } from "../translation/translation.service";

const loginUrl = "https://www.duolingo.com/login"
const userInfoUrl = "https://www.duolingo.com/api/1/users/show?email="
const vocabularyOverviewUrl = 'https://www.duolingo.com/vocabulary/overview';
const lexemeUrl = 'https://www.duolingo.com/api/1/dictionary_page?lexeme_id='

/* -------------------------------------------------------------------------- */
/*                             SERVICE DEFINITION                             */
/* -------------------------------------------------------------------------- */
@injectable()
export class DuoLingoImportService {

  constructor(
    @inject("LessonService") private lessonService: LessonService,
    @inject("TranslationService") private translationService: TranslationService
  ) { }

  async import(duoEmail: string, duoPassword: string, user: User) {
    // Login to DuoLingo
    const jwt = await this.duoLingoLogin(duoEmail, duoPassword)
    const headers = { 'Authorization': 'Bearer ' + jwt }

    // Get DuoLingo user info
    const userInfo = await axios.get(userInfoUrl + duoEmail, { headers })
    const languageTo: string = userInfo.data.ui_language
    const languageData = userInfo.data.language_data

    // Get DuoLingo vocabulary overview
    const vocabularyOverviewResponse = await axios.get(vocabularyOverviewUrl, { headers })
    const languageKey: string = vocabularyOverviewResponse.data.learning_language
    const vocabularyList: Array<object> = vocabularyOverviewResponse.data.vocab_overview

    const map = {}
    await asyncForEach(vocabularyList, async (vocabEntry) => {
      const skill = languageData[languageKey].skills.find(skill => skill.name === vocabEntry.skill)
      const existingLessons = await this.lessonService.byQuery({ user: user._id, importKey: skill.id })
      if (existingLessons.length) return

      const lexeme = await this.getLexeme(vocabEntry.lexeme_id, jwt)
      if (!map[skill.id])
        map[skill.id] = {
          name: skill.name,
          duolingoSkillId: skill.id,
          resources: [`https://www.duolingo.com/skill/${languageKey}/${skill.url_title}`],
          words: []
        }

      map[skill.id].words.push({
        translated: vocabEntry["word_string"],
        phonetic: vocabEntry["normalized_string"],
        phrase: lexeme["translations"],
        tags: []
      })

      lexeme["alternative_forms"].forEach(alternativeForm => {
        map[skill.id].words.push({
          translated: alternativeForm["text"],
          phrase: alternativeForm["translation_text"],
          tags: ["exercise"]
        })
        console.log(`mapped ${alternativeForm["text"]} to skill ${skill.id}`)
      })

      console.log(`mapped ${vocabEntry["word_string"]} to skill ${skill.id}`)
    })

    let translationsCount = 0;
    const importOperations = Object.keys(map).map(async (skillId) => {
      const existingLessons = await this.lessonService.byQuery({ importKey: skillId })
      if (existingLessons.length) return
      const skill = map[skillId]
      const lesson = new Lesson({
        user: user._id,
        name: skill.name,
        importKey: skill.duolingoSkillId,
        resources: skill.resources,
        languageCode: languageKey,
        tags: ["duolingo"]
      })
      const createdLesson = await this.lessonService.create(lesson)
      const translationOpts = skill.words.map(word => {
        const translation = new Translation({
          user: user._id,
          lesson: createdLesson._id,
          phrase: word.phrase,
          translated: word.translated,
          phonetic: word.phonetic || null,
          languageCode: languageKey,
          tags: word.tags.concat(["duolingo"])
        })
        translationsCount++;
        return this.translationService.create(translation)
      });
      await Promise.all(translationOpts)
    })

    await Promise.all(importOperations)
    return {
      lessonsCreated: importOperations.length,
      translationsCreated: translationsCount
    }
  }

  /* ---------------------------- LOGIN TO DUOLINGO --------------------------- */
  private async duoLingoLogin(duoEmail: string, duoPassword: string) {
    // Perform login request
    const loginData = { login: duoEmail, password: duoPassword }
    const loginResponse = await axios.post(loginUrl, loginData)

    if (loginResponse.data.failure)
      throw new ABError({ "status": 401, "error": loginResponse.data.failure, message: loginResponse.data.message });

    // Extract DuoLingo JWT
    const jwt: string = loginResponse.headers.jwt
    return jwt;
  }

  private async getLexeme(id, jwt) {
    const headers = { 'Authorization': 'Bearer ' + jwt }
    const lexemeResponse = await axios.get(lexemeUrl + id, { headers })
    return lexemeResponse.data
  }

  private
}

// Exported Instance
export const importService = new DuoLingoImportService(new LessonService(), new TranslationService());
import { ABError, User, Lesson } from '@models';
import { asyncForEach } from "@common";
import { Translation } from '@models';


