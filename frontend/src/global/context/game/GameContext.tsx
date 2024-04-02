import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';
import type { SetValue } from '../../hooks/useLocalStorage';
import type GameHelper from '../../../../../shared/GameHelper/GameHelper';

export interface IGameContext {
   localDbRoom: string;
   setLocalDbRoom: SetValue<string>;
   localDbUser: string;
   setLocalDbUser: SetValue<string>;
   activeTopicWords: GameHelper.I.WordCell[];
   setActiveTopicWords: Dispatch<SetStateAction<GameHelper.I.WordCell[]>>;
}

export const GameContext = createContext<IGameContext>({
   localDbRoom: '',
   setLocalDbRoom: () => '',
   localDbUser: '',
   setLocalDbUser: () => '',
   activeTopicWords: [],
   setActiveTopicWords: () => {},
});
