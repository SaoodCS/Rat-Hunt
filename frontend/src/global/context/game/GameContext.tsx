import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';
import type { SetValue } from '../../hooks/useLocalStorage';
import type GameHelper from '../../utils/GameHelper/GameHelper';

export interface IGameContext {
   allUsers: string[];
   setAllUsers: Dispatch<SetStateAction<string[]>>;
   localDbRoom: string;
   setLocalDbRoom: SetValue<string>;
   localDbUser: string;
   setLocalDbUser: SetValue<string>;
   activeTopicWords: GameHelper.I.WordCell[];
   setActiveTopicWords: Dispatch<SetStateAction<GameHelper.I.WordCell[]>>;
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
