export default class ArrayHelper {
   static trimLength<T>(array: T[], length: number, trimItemsAt: 'start' | 'end'): T[] {
      if (array.length <= length) return array;
      if (trimItemsAt === 'start') return array.slice(array.length - length);
      return array.slice(0, length);
   }
}
