export class ArrayHelp {
  public static getObj<T>(arr: T[], key: keyof T, value: T[keyof T]): T {
    return arr.find((obj) => obj[key] === value) as T;
  }

  public static filterOut<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
    return arr.filter((obj) => obj[key] !== value);
  }
}
