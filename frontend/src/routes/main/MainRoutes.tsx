import { Navigate, Route } from 'react-router-dom';
import MainLayout from '../../pages/main/MainLayout';
import Homepage from '../../pages/main/home/Homepage';
import Settings from '../../pages/main/settings/Settings';
import HostGame from '../../pages/main/game/hostGame';
import JoinGame from '../../pages/main/game/joinGame';
import MainGame from '../../pages/main/game/mainGame';

export default function MainRoutes(): JSX.Element {
   return (
      <Route path="/main" element={<MainLayout />}>
         <Route index element={<Navigate to="home" replace={true} />} />
         <Route path="home" element={<Homepage />} />
         <Route path="settings" element={<Settings />} />
         <Route path="host" element={<HostGame />} />
         <Route path="join" element={<JoinGame />} />
         <Route path="game" element={<MainGame />} />
      </Route>
   );
}
