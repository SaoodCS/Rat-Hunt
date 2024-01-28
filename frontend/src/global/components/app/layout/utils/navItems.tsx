import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { Dashboard } from '@styled-icons/material-rounded/Dashboard';

export namespace NavItems {
   export type IFooterNames = 'home' | 'settings';
   interface IFooter {
      name: IFooterNames;
      icon: JSX.Element;
   }

   export const footer: IFooter[] = [
      {
         name: 'home',
         icon: <Dashboard />,
      },
      {
         name: 'settings',
         icon: <Settings />,
      },
   ];

   export const sidebar = [...NavItems.footer];
}

export default NavItems;
