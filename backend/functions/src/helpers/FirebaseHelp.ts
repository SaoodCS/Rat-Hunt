import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";

export interface IUser {
  statusUpdatedAt: string;
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

interface IChangeDetails {
  fullPath: string;
  roomId: IRoom["roomId"];
  userId: IUser["userId"];
  userStatus: IUser["userStatus"];
}
interface NestedObject {
  [key: string]: NestedObject | any;
}

export class FBHelp {
  public static getChangedStatus<T extends NestedObject>(
    originalValue: T,
    newValue: T,
    path = ""
  ): IChangeDetails {
    for (const key in newValue) {
      if (typeof newValue[key] === "object") {
        const currentPath = path ? `${path}/${key}` : key;
        const result = FBHelp.getChangedStatus(
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

          return {
            fullPath: changedPath,
            roomId,
            userId,
            userStatus: newValue[key],
          };
        }
      }
    }
    return null as unknown as IChangeDetails;
  }

  public static async getRoomFromFS(roomRefFS: DocumentReference) {
    const roomSnapshot = await roomRefFS.get();
    return roomSnapshot.data() as IRoom | undefined;
  }

  public static getRefs(roomId: string, userId: string) {
    const roomRefFS = admin
      .firestore()
      .collection("games")
      .doc(`room-${roomId}`);
    const roomRefRT = admin.database().ref(`/rooms/${roomId}`);
    const userRefRT = admin.database().ref(`/rooms/${roomId}/${userId}`);
    return { roomRefRT, userRefRT, roomRefFS };
  }

  public static getUser(usersArr: IUser[], userId: string) {
    const userIndex = usersArr.findIndex((user) => user.userId === userId);
    if (userIndex === -1) return undefined;
    return {
      userIndex,
      user: usersArr[userIndex],
    };
  }
}