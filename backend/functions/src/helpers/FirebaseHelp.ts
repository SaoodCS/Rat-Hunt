import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { ArrayHelp } from "./ArrayHelp";

export interface IUser {
  userStatus: "connected" | "disconnected";
  statusUpdatedAt: string;
  userId: string;
}
export interface IUserStates {
  userId: string;
  totalScore: number;
  roundScore: number;
  clue: string;
  guess: string;
  votedFor: string;
}
export interface IGameState {
  activeTopic: string;
  activeWord: string;
  currentRat: string;
  currentRound: number;
  numberOfRoundsSet: number;
  currentTurn: string;
  userStates: IUserStates[];
}
export interface IRoom {
  gameStarted: boolean;
  roomId: string;
  users: IUser[];
  gameState: IGameState;
}

export interface ITopics {
  key: string;
  values: string[];
}

export interface IActiveTopicWords {
  cellId: string;
  word: string;
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

  public static async getTopics() {
    const topicsSnapshot = await admin
      .firestore()
      .collection("topics")
      .doc("topics")
      .get();
    return topicsSnapshot.data() as ITopics[];
  }

  public static getActiveTopicWords(
    topics: ITopics[],
    activeTopic: string
  ): IActiveTopicWords[] {
    const topicObj = ArrayHelp.getObjWithKeyValuePair(
      topics,
      "key",
      activeTopic
    );
    const words = topicObj.values;
    const sortedWords = ArrayHelp.sort(words);
    const words16 = sortedWords.slice(0, 16);
    const wordsWithCellIds: IActiveTopicWords[] = [];
    const letters = ["A", "B", "C", "D"];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        wordsWithCellIds.push({
          cellId: letters[i] + (j + 1),
          word: words16[i * 4 + j],
        });
      }
    }
    return wordsWithCellIds;
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

  public static getUserInUsers(usersArr: IUser[], userId: string) {
    const userIndex = usersArr.findIndex((user) => user.userId === userId);
    if (userIndex === -1) return undefined;
    return {
      userIndex,
      user: usersArr[userIndex],
    };
  }

  public static getUserState(userStatesArr: IUserStates[], userId: string) {
    const userIndex = userStatesArr.findIndex((user) => user.userId === userId);
    if (userIndex === -1) return undefined;
    return {
      userIndex,
      user: userStatesArr[userIndex],
    };
  }

  static resetRoundGameState(
    gameState: IGameState,
    userStatesWithoutLeavingUser: IUserStates[],
    activeTopic: string,
    topics: ITopics[]
  ): IGameState {
    const newRat = ArrayHelp.getRandItem(userStatesWithoutLeavingUser).userId;

    const newWords = FBHelp.getActiveTopicWords(topics, activeTopic);
    const newWord = newWords[Math.floor(Math.random() * newWords.length)].word;
    const updatedUserStates = ArrayHelp.setAllValuesOfKeys(
      userStatesWithoutLeavingUser,
      [
        { key: "clue", value: "" },
        { key: "guess", value: "" },
        { key: "votedFor", value: "" },
      ]
    );
    const sortedUserStates = ArrayHelp.sortObjects(
      userStatesWithoutLeavingUser,
      "userId"
    );
    const updatedCurrentTurn = sortedUserStates[0].userId;
    const updatedGameState: IGameState = {
      ...gameState,
      activeTopic,
      activeWord: newWord,
      currentRat: newRat,
      currentTurn: updatedCurrentTurn,
      userStates: updatedUserStates,
    };
    return updatedGameState;
  }
}
