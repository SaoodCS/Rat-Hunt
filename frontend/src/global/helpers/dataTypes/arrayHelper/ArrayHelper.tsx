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

   static findMostRepeatedItems(array: string[]): string[] {
      const countMap: Map<string, number> = new Map();
      for (const item of array) {
         countMap.set(item, (countMap.get(item) || 0) + 1);
      }
      let maxCount = 0;
      countMap.forEach((count) => {
         if (count > maxCount) {
            maxCount = count;
         }
      });

      const mostRepeatedItems: string[] = [];
      countMap.forEach((count, item) => {
         if (count === maxCount) {
            mostRepeatedItems.push(item);
         }
      });
      return mostRepeatedItems;
   }

   static sort<T extends string[] | number[]>(arr: T, descending?: boolean): T {
      const deepCopy: T = JSON.parse(JSON.stringify(arr));
      if (descending) {
         return deepCopy.sort((a, b) => {
            if (a > b) {
               return -1;
            }
            if (a < b) {
               return 1;
            }
            return 0;
         }) as T;
      }

      return deepCopy.sort((a, b) => {
         if (a < b) {
            return -1;
         }
         if (a > b) {
            return 1;
         }
         return 0;
      }) as T;
   }

   static toUpperCase<T extends string[]>(arr: T): T {
      const deepCopy: T = JSON.parse(JSON.stringify(arr));
      return deepCopy.map((item) => item.toUpperCase()) as T;
   }
}
