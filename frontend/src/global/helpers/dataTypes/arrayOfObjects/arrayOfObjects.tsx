import DateHelper from '../date/DateHelper';

export default class ArrayOfObjects {
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

   static getObjWithKeyValuePair<T>(arr: T[], key: keyof T, value: T[keyof T]): T {
      return arr.find((obj) => obj[key] === value) as T;
   }

   static getObjectsWithKeyValuePair<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] === value) as T[];
   }

   static sumKeyValues<T>(arr: T[], key: keyof T): number {
      return arr.reduce((acc, curr) => acc + Number(curr[key]), 0);
   }

   static deleteDuplicates<T>(arr: T[], key: keyof T): T[] {
      return arr.filter((obj, index, self) => self.findIndex((o) => o[key] === obj[key]) === index);
   }

   static filterOut<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] !== value);
   }

   static filterIn<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] === value);
   }

   static combine<T>(arr1: T[], arr2: T[]): T[] {
      return arr1.concat(arr2);
   }

   static isEmpty<T>(arr: T[]): boolean {
      return arr.length === 0;
   }

   static isNotEmpty<T>(arr: T[]): boolean {
      return arr.length > 0;
   }

   static doAllObjectsHaveKeyValuePair<T>(arr: T[], key: keyof T, value: T[keyof T]): boolean {
      return arr.every((obj) => obj[key] === value);
   }

   static isKeyInAllObjsNotValuedAs<T>(arr: T[], key: keyof T, value: T[keyof T]): boolean {
      return arr.every((obj) => obj[key] !== value);
   }

   static getArrOfValuesFromKey<T, K extends keyof T>(arr: T[], key: K): T[K][] {
      return arr.map((obj) => obj[key]);
   }

   static getArrOfValuesFromNestedKey<T, K extends keyof T, N extends keyof T[K]>(
      arr: T[],
      outerKey: K,
      nestedKey: N,
   ): T[K][N][] {
      return arr.map((obj) => obj[outerKey][nestedKey]);
   }

   static sortByDateStr<T>(arrayOfObj: T[], ddmmyyPropName: keyof T, descending?: boolean): T[] {
      const sortedArr = arrayOfObj.sort(
         (a, b) =>
            DateHelper.fromDDMMYYYY(b[ddmmyyPropName] as string).getTime() -
            DateHelper.fromDDMMYYYY(a[ddmmyyPropName] as string).getTime(),
      );
      if (descending) {
         return sortedArr.reverse();
      }
      return sortedArr;
   }

   static calcSumOfKeyValue<T>(arr: T[], key: keyof T): number {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
         const keyValue = arr[i][key];
         const keyValueAsNumber = Number(keyValue);
         if (isNaN(keyValueAsNumber)) {
            throw new Error('Value is not a number');
         }
         sum += keyValueAsNumber;
      }
      return sum;
   }

   // function that sets the value of a key in all object to a new value
   static setAllValuesOfKey<T>(arr: T[], key: keyof T, newValue: T[keyof T]): T[] {
      const deepCopy: T[] = JSON.parse(JSON.stringify(arr));
      for (let i = 0; i < deepCopy.length; i++) {
         deepCopy[i][key] = newValue;
      }
      return deepCopy;
   }

   // function that can do setAllValuesOfKeys for multiple keys
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
