import { createContext } from 'react';

export interface IGameContext {
   allUsers: string[];
   setAllUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

export const GameContext = createContext<IGameContext>({
   allUsers: [],
   setAllUsers: () => {},
});
