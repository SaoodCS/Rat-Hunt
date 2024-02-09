import type { ReactNode } from 'react';
import { useState } from 'react';
import { GameContext } from './GameContext';

interface IGameContextProvider {
   children: ReactNode;
}

export default function GameContextProvider(props: IGameContextProvider): JSX.Element {
   const { children } = props;
   const [allUsers, setAllUsers] = useState<string[]>([]);

   return <GameContext.Provider value={{ allUsers, setAllUsers }}>{children}</GameContext.Provider>;
}
