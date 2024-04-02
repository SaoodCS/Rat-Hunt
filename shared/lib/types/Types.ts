export namespace Types {
   export type RequiredFieldsOnly<T> = {
      [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
   };

   export type OptionalFieldsOnly<T> = {
      [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
   };

   export namespace MakeAllRequired {
      export type AddORUndefined<T> = { [K in keyof T]-?: [T[K]] } extends infer U
         ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
           U extends Record<keyof U, [any]>
            ? { [K in keyof U]: U[K][0] }
            : never
         : never;
      export type RemoveOrUndefined<T> = Required<T>;
   }
}

export default Types;
