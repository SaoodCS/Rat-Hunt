import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../../../../../resources/icons/logo-192x192.png';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { StyledLink } from '../footer/Style';
import NavItems from '../utils/navItems';
import { ActiveTag, CompanyTag, LogoWrapper, SidebarContainer, SidebarItem } from './Style';

export default function Sidebar(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const location = useLocation();

   return (
      <SidebarContainer isDarkTheme={isDarkTheme}>
         <LogoWrapper>
            <img src={logo} alt="Logo" width="50px" height="50px" />
         </LogoWrapper>
         {NavItems.sidebar.map((item) => (
            <Fragment key={item.name}>
               <StyledLink to={item.name}>
                  <SidebarItem
                     isActive={location.pathname.includes(item.name)}
                     isDarkTheme={isDarkTheme}
                  >
                     <ActiveTag />
                     {item.icon}
                     {item.name}
                  </SidebarItem>
               </StyledLink>
            </Fragment>
         ))}
         <CompanyTag isDarkTheme={isDarkTheme}>
            {'Rat Hunt 2024'} &copy; All rights reserved.
         </CompanyTag>
      </SidebarContainer>
   );
}
