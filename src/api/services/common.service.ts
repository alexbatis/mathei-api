/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { JsonConvert, ValueCheckingMode } from "json2typescript";
/* --------------------------------- CUSTOM --------------------------------- */
import { logAndThrowError } from "@common";


/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
export class CommonService {


    /* ---------------------------- MEMBER FUNCTIONS ---------------------------- */
    createHttpOptions(requestType: string, path: string, auth: string): any {
        return {
            method: requestType,
            uri: path,
            headers: {
                Authorization: "Basic " + auth
            }
        };
    }

    withError = (promise: Promise<any>) => promise.then(data => [null, data]).catch(err => [err]);


    /* ----------- Deserialize a json object into an object of type T ----------- */
    deserialize<T>(jsonObj: Object, type: any): T {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.ignorePrimitiveChecks = false; // don"t allow assigning number to string etc.
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // allow null
        try {
            return jsonConvert.deserializeObject(jsonObj, type);
        } catch (e) {
            logAndThrowError(e);
        }
    }


    /* --------- Deserialize a json array object into an array of type T -------- */
    deserializeArray<T>(jsonArray: Object[], type: any) {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.ignorePrimitiveChecks = false; // don"t allow assigning number to string etc.
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // allow null
        let deserializedArray: Array<T>;
        try {
            deserializedArray = jsonConvert.deserializeArray<T>(jsonArray, type);
            return deserializedArray;
        } catch (e) {
            logAndThrowError(e);
        }
    }
}

export default new CommonService();
