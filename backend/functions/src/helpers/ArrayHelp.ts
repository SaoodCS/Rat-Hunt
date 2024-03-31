export class ArrayHelp {
   public static getObj<T>(arr: T[], key: keyof T, value: T[keyof T]): T {
      return arr.find((obj) => obj[key] === value) as T;
   }

   public static isKeyInAllObjsNotValuedAs<T>(arr: T[], key: keyof T, value: T[keyof T]): boolean {
      return arr.every((obj) => obj[key] !== value);
   }

   public static filterOut<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] !== value);
   }
   public static getRandItem<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
   }

   public static getArrOfValuesFromKey<T, K extends keyof T>(arr: T[], key: K): T[K][] {
      return arr.map((obj) => obj[key]);
   }

   public static sort<T extends string[] | number[]>(arr: T, descending?: boolean): T {
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

   static sortObjects<T>(arr: T[], key: keyof T, descending?: boolean): T[] {
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

   static setAllValuesOfKeys<T>(arr: T[], keyValues: { key: keyof T; value: T[keyof T] }[]): T[] {
      const deepCopy: T[] = JSON.parse(JSON.stringify(arr));
      for (let i = 0; i < deepCopy.length; i++) {
         for (let j = 0; j < keyValues.length; j++) {
            deepCopy[i][keyValues[j].key] = keyValues[j].value;
         }
      }
      return deepCopy;
   }
}
