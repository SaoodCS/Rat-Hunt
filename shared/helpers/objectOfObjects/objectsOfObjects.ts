/* eslint-disable no-plusplus */
export default class ObjectOfObjects {
   // When using this function, pass through the type/interface of the object you expect to be returned in the angular brackets
   public static findObjFromUniqueVal<T>(
      obj: { [key: string]: T | Record<string, unknown> },
      uniqueVal: unknown,
   ): T | undefined {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
         const key = keys[i];
         const value = obj[key];

         if (typeof value === 'object' && value !== null) {
            if (Object.values(value).includes(uniqueVal)) {
               return value as T;
            }
            const nestedResult = this.findObjFromUniqueVal(
               value as { [key: string]: T | Record<string, unknown> },
               uniqueVal,
            );
            if (nestedResult !== undefined) {
               return nestedResult as T;
            }
         }
      }
      return undefined;
   }

   static convertToArrayOfObj<T extends Record<string, T[keyof T]>>(obj: T): T[keyof T][] {
      return Object.keys(obj).map((key) => obj[key as keyof T]);
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   static addPropsToAll<T extends Record<string, any>>(
      obj: T,
      props: { [key: string]: unknown },
   ): T {
      const newObj = { ...obj } as { [key: string]: T[keyof T] };
      Object.keys(newObj).forEach((key) => {
         const objKey = key as keyof typeof newObj;
         Object.keys(props).forEach((prop) => {
            const propKey = prop as keyof typeof props;
            newObj[objKey][propKey] = props[propKey];
         });
      });
      return newObj as T;
   }

   // create an isEmpty function that doesn't lead to the error "Index signature for type 'string' is missing in type 'ICalcSchema'.":
   static isEmpty<T extends Record<keyof T, T[keyof T]>>(obj: T): boolean {
      return Object.keys(obj).length === 0;
   }

   // function that takes an object and takes a property name in that object, converts that property from string to Date, and returns the object:
   static convertStrPropToDate<T>(obj: T, propName: keyof T): T {
      const newObj = { ...obj };
      newObj[propName] = new Date(obj[propName] as string) as T[keyof T];
      return newObj;
   }
}
