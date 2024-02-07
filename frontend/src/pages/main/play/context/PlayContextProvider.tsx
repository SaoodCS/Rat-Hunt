import { get, onChildChanged, onDisconnect, push, ref, remove, set } from 'firebase/database';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { realtime } from '../../../../global/firebase/config/config';
import useLocalStorage from '../../../../global/hooks/useLocalStorage';
import { PlayContext } from './PlayContext';

interface IPlayContextProvider {
   children: ReactNode;
}

export default function PlayContextProvider(props: IPlayContextProvider): JSX.Element {
   const { children } = props;
   const [savedUserName, setSavedUserName] = useLocalStorage('userName', '');
   const [savedRoomId, setSavedRoomId] = useLocalStorage('roomId', '');

   const navigation = useNavigate();

   useEffect(() => {
      const roomRef = ref(realtime, `rooms/${savedRoomId}`);
      get(roomRef).then((roomSnapshot) => {
         if (!roomSnapshot.exists()) {
            setSavedRoomId('');
            setSavedUserName('');
            navigation('/main/play');
         } else {
            // check if the user exists in the room, and if they do, set their connected status to true
            const userRef = ref(realtime, `rooms/${savedRoomId}/users/${savedUserName}`);
            get(userRef).then((userSnapshot) => {
               if (!userSnapshot.exists()) {
                  setSavedRoomId('');
                  setSavedUserName('');
                  navigation('/main/play');
               } else {
                  set(ref(realtime, `rooms/${savedRoomId}/users/${savedUserName}/connected`), true);
                  onDisconnect(
                     ref(realtime, `rooms/${savedRoomId}/users/${savedUserName}/connected`),
                  ).set(false);
                  // check if the gameStarted node value is true, and if it is, navigate to the startedGame page, otherwise navigate to the waiting room
                  const gameStartedRef = ref(realtime, `rooms/${savedRoomId}/gameStarted`);
                  get(gameStartedRef).then((gameStartedSnapshot) => {
                     if (gameStartedSnapshot.exists() && gameStartedSnapshot.val() === true) {
                        navigation('/main/startedgame');
                     } else {
                        navigation('/main/waitingroom');
                     }
                  });
               }
            });
         }
      });

      //TODO: if there has been no change to the room for a certain amount of time, remove the room, reset saved local storage data, and navigate the users back to main/play
   }, []);

   useEffect(() => {
      // when a user node is changed, check if all users except this user has a connection status set to false (if there exists one user who's connection status is set to true then don't remove the room). If they do, remove the room, reset saved local storage data, and navigate the users back to main/play:
      const usersRef = ref(realtime, `rooms/${savedRoomId}/users`);
      // when this child changes, check if all users have a connection status set to false:
      onChildChanged(usersRef, (userSnapshot) => {
         // get a snapshot of all the users in the room
         get(usersRef).then((users) => {
            // append each user's connectionStatus to an array 'connectionStatuses'
            const connectionStatuses: boolean[] = [];
            users.forEach((u) => {
               connectionStatuses.push(u.val().connected);
            });
            // if there is only one user who has a connection status set to true, then remove the room, reset saved local storage data, and navigate the users back to main/play
            if (connectionStatuses.filter((c) => c).length === 1) {
               remove(ref(realtime, `rooms/${savedRoomId}`));
               setSavedRoomId('');
               setSavedUserName('');
               navigation('/main/play');
            }
         });
      });
   }, []);

   return <PlayContext.Provider value={{}}>{children}</PlayContext.Provider>;
}
