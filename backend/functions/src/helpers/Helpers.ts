export interface IUser {
  lastOnline: string;
  score: number;
  userStatus: "connected" | "disconnected";
  userId: string;
}

export interface IRoom {
  activeTopic: string;
  gameStarted: boolean;
  roomId: string;
  users: IUser[];
}

interface NestedObject {
  [key: string]: NestedObject | any;
}

interface IChangeDetails {
  fullPath: string;
  roomId: IRoom["roomId"];
  userId: IUser["userId"];
  field: keyof IUser;
  value: IUser[keyof IUser];
}

export default class Helpers {
  public static getChangedValDetails<T extends NestedObject>(
    originalValue: T,
    newValue: T,
    path = ""
  ): IChangeDetails {
    for (const key in newValue) {
      if (typeof newValue[key] === "object") {
        const currentPath = path ? `${path}/${key}` : key;
        const result = Helpers.getChangedValDetails(
          originalValue[key],
          newValue[key],
          currentPath
        );
        if (result) return result;
      } else {
        if (originalValue[key] !== newValue[key]) {
          const changedPath = path ? `${path}/${key}` : key;
          const roomId = changedPath.split("/")[1];
          const userId = changedPath.split("/")[2];
          const field = changedPath.split("/")[3] as keyof IUser;

          return {
            fullPath: changedPath,
            roomId,
            userId,
            field,
            value: newValue[key],
          };
        }
      }
    }
    return null as unknown as IChangeDetails;
  }
}
