import type AppTypes from '../../../../../shared/app/types/AppTypes';

export const baseDummyUser: AppTypes.UserState = {
   userStatus: 'disconnected',
   statusUpdatedAt: new Date().toISOString(),
   userId: 'dummyUser1',
   totalScore: 0,
   roundScores: [],
   clue: '',
   votedFor: '',
   spectate: false,
};

export function createCopyOfDummyUser(
   dummyUser: AppTypes.UserState,
   changedFields: Partial<AppTypes.UserState>,
): AppTypes.UserState {
   const clone = JSON.parse(JSON.stringify(dummyUser));
   return Object.assign(clone, changedFields);
}

export function generateDummyUsers(
   baseDummyUser: AppTypes.UserState,
   usersWithChangedFields: Partial<AppTypes.UserState>[],
): AppTypes.UserState[] {
   const dummyUsersWithoutBase = usersWithChangedFields.map((changedFields) =>
      createCopyOfDummyUser(baseDummyUser, changedFields),
   );
   return [baseDummyUser, ...dummyUsersWithoutBase];
}

export function addDummyUsersToRoom(
   room: AppTypes.Room,
   dummyUsers: AppTypes.UserState[],
): AppTypes.Room {
   const userStatesFields: AppTypes.UserState[] = dummyUsers.map((user) => ({
      userId: user.userId,
      totalScore: user.totalScore,
      roundScores: user.roundScores,
      clue: user.clue,
      votedFor: user.votedFor,
      spectate: user.spectate,
      userStatus: user.userStatus,
      statusUpdatedAt: user.statusUpdatedAt,
   }));
   const roomClone = JSON.parse(JSON.stringify(room));
   roomClone.gameState.userStates = userStatesFields;
   return roomClone;
}
