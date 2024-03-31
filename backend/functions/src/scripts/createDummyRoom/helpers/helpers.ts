import type { IRoom, IUserStates } from '../../../helpers/FirebaseHelp';

export const baseDummyUser: IUserStates = {
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
   dummyUser: IUserStates,
   changedFields: Partial<IUserStates>,
): IUserStates {
   const clone = JSON.parse(JSON.stringify(dummyUser));
   return Object.assign(clone, changedFields);
}

export function generateDummyUsers(
   baseDummyUser: IUserStates,
   usersWithChangedFields: Partial<IUserStates>[],
): IUserStates[] {
   const dummyUsersWithoutBase = usersWithChangedFields.map((changedFields) =>
      createCopyOfDummyUser(baseDummyUser, changedFields),
   );
   return [baseDummyUser, ...dummyUsersWithoutBase];
}

export function addDummyUsersToRoom(room: IRoom, dummyUsers: IUserStates[]): IRoom {
   const userStatesFields: IUserStates[] = dummyUsers.map((user) => ({
      userId: user.userId,
      totalScore: user.totalScore,
      roundScores: user.roundScores,
      clue: user.clue,
      guess: user.guess,
      votedFor: user.votedFor,
      spectate: user.spectate,
      userStatus: user.userStatus,
      statusUpdatedAt: user.statusUpdatedAt,
   }));
   const roomClone = JSON.parse(JSON.stringify(room));
   roomClone.gameState.userStates = userStatesFields;
   return roomClone;
}
