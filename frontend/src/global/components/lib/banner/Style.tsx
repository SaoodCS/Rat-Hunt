import styled from 'styled-components';
import type { IBannerType } from '../../../context/widget/banner/BannerContext';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';

export const BannerBackground = styled.div<{
   renderBanner: boolean;
   heightEm: number;
   zIndex?: number;
}>`
   position: fixed;
   top: ${({ renderBanner, heightEm }) => (renderBanner ? '0em' : `-${heightEm * 2}em}`)};
   transition: top 0.3s ease-out;
   width: 100%;
   min-height: ${({ heightEm }) => heightEm * 1.3}em;
   max-height: ${({ heightEm }) => heightEm * 1.3}em;
   overflow: scroll;
   ${MyCSS.Scrollbar.hide};
   display: flex;
   align-items: center;
   flex-direction: column;
   backdrop-filter: blur(2px);
   z-index: ${({ zIndex }) => zIndex};
`;

export const BannerContainer = styled.div<{
   renderBanner: boolean;
   heightEm: number;
   isDarkTheme: boolean;
   bannerType: IBannerType;
}>`
   transition: top 0.3s ease-out;
   border: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   box-shadow: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.darkThm.boxShadow : Color.lightThm.boxShadow};
   width: 90%;
   margin-top: 1em;
   min-height: ${({ heightEm }) => heightEm}em;
   max-height: ${({ heightEm }) => heightEm}em;
   border-radius: 10px;
   display: flex;
   justify-content: center;
   align-items: center;
   backdrop-filter: blur(100px);
   :hover {
      cursor: pointer;
   }
   :not(:active) {
      background-color: ${({ isDarkTheme, bannerType }) => {
         if (isDarkTheme) {
            if (bannerType === 'success') return Color.setRgbOpacity(Color.darkThm.success, 0.8);
            if (bannerType === 'error') return Color.setRgbOpacity(Color.darkThm.error, 0.8);
            if (bannerType === 'warning') return Color.setRgbOpacity(Color.darkThm.warning, 0.8);
            return Color.setRgbOpacity(Color.darkThm.bg, 0.8);
         }
         if (bannerType === 'success') return Color.setRgbOpacity(Color.lightThm.success, 0.8);
         if (bannerType === 'error') return Color.setRgbOpacity(Color.lightThm.error, 0.8);
         if (bannerType === 'warning') return Color.setRgbOpacity(Color.lightThm.warning, 0.8);
         return Color.setRgbOpacity(Color.lightThm.bg, 0.8);
      }};
   }
   :active {
      background-color: ${({ isDarkTheme, bannerType }) => {
         if (isDarkTheme) {
            if (bannerType === 'success') return Color.setRgbOpacity(Color.darkThm.success, 0.7);
            if (bannerType === 'error') return Color.setRgbOpacity(Color.darkThm.error, 0.7);
            if (bannerType === 'warning') return Color.setRgbOpacity(Color.darkThm.warning, 0.7);
            return Color.setRgbOpacity(Color.darkThm.bg, 0.8);
         }
         if (bannerType === 'success') return Color.setRgbOpacity(Color.lightThm.success, 0.7);
         if (bannerType === 'error') return Color.setRgbOpacity(Color.lightThm.error, 0.7);
         if (bannerType === 'warning') return Color.setRgbOpacity(Color.lightThm.warning, 0.7);
         return Color.setRgbOpacity(Color.lightThm.bg, 0.8);
      }};
   }
   user-select: none;
`;

export const BannerContent = styled.div<{ hasIcon: boolean }>`
   padding: 1em;
   width: 100%;
   display: grid;
   grid-template-columns: ${({ hasIcon }) => (hasIcon ? '1fr 4fr' : '1fr')};
   grid-gap: 1em;
   align-items: center;
   font-size: 0.9em;
`;
