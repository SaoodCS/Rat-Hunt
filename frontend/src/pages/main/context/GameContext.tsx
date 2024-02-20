import { createContext } from 'react';
import type { SetValue } from '../../../global/hooks/useLocalStorage';
import type FirestoreDB from '../class/FirestoreDb';

export interface IGameContext {
   allUsers: string[];
   setAllUsers: React.Dispatch<React.SetStateAction<string[]>>;
   localDbRoom: string;
   setLocalDbRoom: SetValue<string>;
   localDbUser: string;
   setLocalDbUser: SetValue<string>;
   activeTopicWords: FirestoreDB.Room.IActiveTopicWords[];
   setActiveTopicWords: React.Dispatch<React.SetStateAction<FirestoreDB.Room.IActiveTopicWords[]>>;
}

export const GameContext = createContext<IGameContext>({
   allUsers: [],
   setAllUsers: () => {},
   localDbRoom: '',
   setLocalDbRoom: () => '',
   localDbUser: '',
   setLocalDbUser: () => '',
   activeTopicWords: [],
   setActiveTopicWords: () => {},
});
