import { Navigate, Route } from 'react-router-dom';
import MainLayout from '../../pages/main/MainLayout';
import Play from '../../pages/main/play/Play';
import StartedGame from '../../pages/main/startedGame/StartedGame';
import WaitingRoom from '../../pages/main/waitingRoom/WaitingRoom';

export default function MainRoutes(): JSX.Element {
   return (
      <Route path="/main" element={<MainLayout />}>
         <Route index element={<Navigate to="play" replace={true} />} />
         <Route path="play" element={<Play />} />
         <Route path="waitingroom" element={<WaitingRoom />} />
         <Route path="startedgame" element={<StartedGame />} />
      </Route>
   );
}
