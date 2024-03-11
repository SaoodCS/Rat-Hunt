type FixedSizeArray<Length extends number, Type> = Length extends 0
  ? never[]
  : { 0: Type; length: Length } & ReadonlyArray<Type>;


export default interface ITopic {
  key: string;
  values: FixedSizeArray<16, string>;
}
