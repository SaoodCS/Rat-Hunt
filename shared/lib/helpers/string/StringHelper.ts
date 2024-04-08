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

   static containsOneOf(str: string, chars: string[]): boolean {
      return chars.some((char) => str.includes(char));
   }

   static generateRandUID(length: number): string {
      return Math.random()
         .toString(36)
         .substring(2, length + 2);
   }
}
