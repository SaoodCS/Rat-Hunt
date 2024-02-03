import { Navigate, Route } from 'react-router-dom';
import MainLayout from '../../pages/main/MainLayout';
import HostGame from '../../pages/main/game/hostGame';
import JoinGame from '../../pages/main/game/joinGame';
import MainGame from '../../pages/main/game/mainGame';
import Guide from '../../pages/main/guide/Guide';
import Play from '../../pages/main/play/Play';

export default function MainRoutes(): JSX.Element {
   return (
      <Route path="/main" element={<MainLayout />}>
         <Route index element={<Navigate to="play" replace={true} />} />
         <Route path="play" element={<Play />} />
         <Route path="guide" element={<Guide />} />
         <Route path="host" element={<HostGame />} />
         <Route path="join" element={<JoinGame />} />
         <Route path="game" element={<MainGame />} />
      </Route>
   );
}
