export default class MiscHelper {
   static isNotFalsyOrEmpty<T>(value: unknown): value is NonNullable<T> {
      if (Array.isArray(value)) return value.length !== 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length !== 0;
      if (typeof value === 'string') return value !== '';
      if (value === null) return false;
      if (value === undefined) return false;
      if (typeof value === 'boolean' && value === false) return false;
      return true;
   }
}
