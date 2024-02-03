import { Help } from '@styled-icons/ionicons-outline/Help';
import { PestControlRodent } from '@styled-icons/material/PestControlRodent';

export namespace NavItems {
   export type IFooterNames = 'play' | 'guide';
   interface IFooter {
      name: IFooterNames;
      icon: JSX.Element;
   }

   export const footer: IFooter[] = [
      {
         name: 'play',
         icon: <PestControlRodent />,
      },
      {
         name: 'guide',
         icon: <Help />,
      },
   ];

   export const sidebar = [...NavItems.footer];
}

export default NavItems;
