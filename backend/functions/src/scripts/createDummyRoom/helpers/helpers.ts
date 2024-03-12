import type { IFullUser, IRoom, IUser, IUserStates } from '../../../helpers/FirebaseHelp';

export const baseDummyUser: IFullUser = {
   userStatus: 'connected',
   statusUpdatedAt: new Date().toISOString(),
   userId: 'dummyUser1',
   totalScore: 0,
   roundScores: [],
   clue: '',
   guess: '',
   votedFor: '',
   spectate: false,
};

export function createCopyOfDummyUser(
   dummyUser: IFullUser,
   changedFields: Partial<IFullUser>,
): IFullUser {
   const clone = JSON.parse(JSON.stringify(dummyUser));
   return Object.assign(clone, changedFields);
}

export function generateDummyUsers(
   baseDummyUser: IFullUser,
   usersWithChangedFields: Partial<IFullUser>[],
): IFullUser[] {
   const dummyUsersWithoutBase = usersWithChangedFields.map((changedFields) =>
      createCopyOfDummyUser(baseDummyUser, changedFields),
   );
   return [baseDummyUser, ...dummyUsersWithoutBase];
}

export function addDummyUsersToRoom(room: IRoom, dummyUsers: IFullUser[]): IRoom {
   const userStatesFields: IUserStates[] = dummyUsers.map((user) => ({
      userId: user.userId,
      totalScore: user.totalScore,
      roundScores: user.roundScores,
      clue: user.clue,
      guess: user.guess,
      votedFor: user.votedFor,
      spectate: user.spectate,
   }));
   const userFields: IUser[] = dummyUsers.map((user) => ({
      userStatus: user.userStatus,
      statusUpdatedAt: user.statusUpdatedAt,
      userId: user.userId,
   }));
   const roomClone = JSON.parse(JSON.stringify(room));
   roomClone.users = userFields;
   roomClone.gameState.userStates = userStatesFields;
   return roomClone;
}
