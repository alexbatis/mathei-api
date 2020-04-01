import { logger } from "@common";

export const withError = (promise: Promise<any>) => promise.then(data => [null, data]).catch(err => [err]);
export const logAndThrowError = (e: any) => { logger.error(<Error>e); throw (e); };
export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) 
    await callback(array[index], index, array);
}