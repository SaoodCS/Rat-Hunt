import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';

export default function App(): JSX.Element {
   return (
      <BrowserRouter>
         <AppRouter />
      </BrowserRouter>
   );
}
