import { useLocation } from 'react-router-dom';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import useFooterContext from '../../../../context/widget/footer/hooks/useFooterContext';
import NavItems from '../utils/navItems';
import { FooterContainer, FooterItem, StyledLink } from './Style';

export default function Footer(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const location = useLocation();
   const { handleFooterItemSecondClick } = useFooterContext();

   function isActive(name: NavItems.IFooterNames): boolean {
      return location.pathname.includes(name);
   }

   return (
      <FooterContainer isDarkTheme={isDarkTheme}>
         {NavItems.footer.map((item) => (
            <StyledLink
               key={item.name}
               to={item.name}
               onClick={() => isActive(item.name) && handleFooterItemSecondClick(item.name)}
               replace={true}
            >
               <FooterItem key={item.name} isActive={isActive(item.name)} isDarkTheme={isDarkTheme}>
                  {item.icon}
                  {item.name}
               </FooterItem>
            </StyledLink>
         ))}
      </FooterContainer>
   );
}
