export default class ArrOfObj {
   // GETTERS
   static getObj<T>(arr: T[], key: keyof T, value: T[keyof T]): T | undefined {
      return arr.find((obj) => obj[key] === value);
   }

   static getObjects<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] === value);
   }

   static getRandItem<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
   }

   static getArrOfValuesFromKey<T, K extends keyof T>(arr: T[], key: K): T[K][] {
      return arr.map((obj) => obj[key]);
   }

   static filterOut<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] !== value);
   }

   static filterOutValues<T>(array: T[], key: keyof T, values: T[keyof T][]): T[] {
      return array.filter((item) => !values.includes(item[key]));
   }

   // SETTERS
   static setKeyValsInAllObjects<T>(
      arr: T[],
      keyValues: { key: keyof T; value: T[keyof T] }[],
   ): T[] {
      const deepCopy: T[] = JSON.parse(JSON.stringify(arr));
      for (let i = 0; i < deepCopy.length; i++) {
         for (let j = 0; j < keyValues.length; j++) {
            deepCopy[i][keyValues[j].key] = keyValues[j].value;
         }
      }
      return deepCopy;
   }

   static setKeyValsInObj<T>(
      arr: T[],
      objIdentifier: { key: keyof T; value: T[keyof T] },
      updatedKeyValues: { key: keyof T; value: T[keyof T] }[],
   ): T[] {
      const deepCopy: T[] = JSON.parse(JSON.stringify(arr));
      for (let i = 0; i < deepCopy.length; i++) {
         if (deepCopy[i][objIdentifier.key] === objIdentifier.value) {
            for (let j = 0; j < updatedKeyValues.length; j++) {
               deepCopy[i][updatedKeyValues[j].key] = updatedKeyValues[j].value;
            }
         }
      }
      return deepCopy;
   }

   static deleteDuplicates<T>(arr: T[], key: keyof T): T[] {
      return arr.filter((obj, index, self) => self.findIndex((o) => o[key] === obj[key]) === index);
   }

   static sort<T>(arr: T[], key: keyof T, descending?: boolean): T[] {
      const deepCopy: T[] = JSON.parse(JSON.stringify(arr));
      if (descending) {
         return deepCopy.sort((a, b) => {
            if (a[key] > b[key]) {
               return -1;
            }
            if (a[key] < b[key]) {
               return 1;
            }
            return 0;
         });
      }

      return deepCopy.sort((a, b) => {
         if (a[key] < b[key]) {
            return -1;
         }
         if (a[key] > b[key]) {
            return 1;
         }
         return 0;
      });
   }

   static orderByArrOfVals<T, K extends keyof T>(arr: T[], prop: K, order: T[K][]): T[] {
      return arr.sort((a, b) => order.indexOf(a[prop]) - order.indexOf(b[prop]));
   }

   // OPERATORS
   static sumKeyValues<T>(arr: T[], key: keyof T): number {
      return arr.reduce((acc, curr) => acc + Number(curr[key]), 0);
   }

   static combine<T>(arr1: T[], arr2: T[]): T[] {
      return arr1.concat(arr2);
   }

   // CHECKERS
   static hasKeyVal<T>(arr: T[], key: keyof T, value: T[keyof T]): boolean {
      return arr.some((obj) => obj[key] === value);
   }

   static doAllObjectsHave<T>(arr: T[], key: keyof T, value: T[keyof T]): boolean {
      return arr.every((obj) => obj[key] === value);
   }

   static isEmpty<T>(arr: T[]): boolean {
      return arr.length === 0;
   }
}
