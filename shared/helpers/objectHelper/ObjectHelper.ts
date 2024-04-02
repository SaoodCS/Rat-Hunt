import MiscHelper from '../miscHelper/MiscHelper';

export default class ObjectHelper {
   static allPropValsEmpty<T extends Record<keyof T, T[keyof T]>>(obj: T): boolean {
      return Object.values(obj).every((value) => !MiscHelper.isNotFalsyOrEmpty(value));
   }
}
