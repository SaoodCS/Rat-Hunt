import { createContext } from 'react';
import type { SetValue } from '../../../global/hooks/useLocalStorage';

export interface IGameContext {
   allUsers: string[];
   setAllUsers: React.Dispatch<React.SetStateAction<string[]>>;
   localDbRoom: string;
   setLocalDbRoom: SetValue<string>;
   localDbUser: string;
   setLocalDbUser: SetValue<string>;
}

export const GameContext = createContext<IGameContext>({
   allUsers: [],
   setAllUsers: () => {},
   localDbRoom: '',
   setLocalDbRoom: () => '',
   localDbUser: '',
   setLocalDbUser: () => '',
});
