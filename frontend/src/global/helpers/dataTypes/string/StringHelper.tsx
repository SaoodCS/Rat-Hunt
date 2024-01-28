export default class StringHelper {
   static firstLetterToUpper(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
   }

   static isNumber(str: string): boolean {
      return !isNaN(Number(str));
   }

   static removeSequence(str: string, sequence: string): string {
      return str.replace(sequence, '');
   }
}
