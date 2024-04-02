export namespace BoolHelper {
   export type IAsString = 'true' | 'false';

   export function strToBool(value: IAsString): boolean {
      return value === 'true';
   }

   export function boolToStr(value: boolean): IAsString {
      return value.toString() as IAsString;
   }
}

export default BoolHelper;
