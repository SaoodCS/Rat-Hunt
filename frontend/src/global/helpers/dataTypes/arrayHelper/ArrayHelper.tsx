export default class ArrayHelper {
   static trimLength<T>(array: T[], length: number, trimItemsAt: 'start' | 'end'): T[] {
      if (array.length <= length) return array;
      if (trimItemsAt === 'start') return array.slice(array.length - length);
      return array.slice(0, length);
   }

   // for each item capitalize the first letter of each word, and return the new array with the capitalized items, but DO NOT mutate the original array at all:
   static capFirstLetterOfWords(array: string[]): string[] {
      return array.map((item) => {
         return item
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      });
   }
}
