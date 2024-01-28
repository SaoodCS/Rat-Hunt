import { ExclamationOctagon } from '@styled-icons/bootstrap/ExclamationOctagon';
import { MessageAltCheck } from '@styled-icons/boxicons-solid/MessageAltCheck';
import { Warning } from '@styled-icons/entypo/Warning';
import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import type { IBannerType } from '../../../context/widget/banner/BannerContext';
import { VerticalSeperator } from '../positionModifiers/verticalSeperator/VerticalSeperator';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { BannerBackground, BannerContainer, BannerContent } from './Style';

interface IBanner {
   message: string;
   handleClick?: () => void;
   isVisible: boolean;
   Icon?: ReactNode;
   onClose: () => void;
   heightEm?: number;
   zIndex?: number;
   bannerType?: IBannerType;
}

function Banner(props: IBanner): JSX.Element {
   const backgroundId = 'bannerBackground';
   const containerId = 'bannerContainer';
   const {
      message,
      handleClick,
      isVisible,
      Icon,
      onClose,
      heightEm,
      zIndex,
      bannerType = 'default',
   } = props;
   const { isDarkTheme } = useContext(ThemeContext);
   const [renderBanner, setRenderBanner] = useState(isVisible);
   const [mouseDown, setMouseDown] = useState(false);
   let timeout1: NodeJS.Timeout;
   let timeout2: NodeJS.Timeout;

   useEffect(() => {
      if (isVisible && !mouseDown) {
         setRenderBanner(true);
         timeout1 = setTimeout(() => {
            setRenderBanner(false);
            timeout2 = setTimeout(() => {
               onClose();
            }, 300);
         }, 2000);
      }
      return () => {
         clearTimeout(timeout1);
         clearTimeout(timeout2);
      };
   }, [isVisible, mouseDown]);

   const handleMouseDown = (): void => {
      setMouseDown(true);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
   };

   const handleMouseUp = (): void => {
      setMouseDown(false);
      const currentScrollPos = document.getElementById(backgroundId)?.scrollTop || 0;
      if (currentScrollPos > 0) {
         document.getElementById(backgroundId)!.style.top = `-${(heightEm || 5) * 1.3}em`;
         timeout1 = setTimeout(() => {
            document.getElementById(backgroundId)!.style.display = `none`;
         }, 300);
      }
   };

   return (
      <ConditionalRender condition={isVisible}>
         <BannerBackground
            renderBanner={renderBanner}
            id={backgroundId}
            heightEm={heightEm || 5}
            zIndex={zIndex}
         >
            <BannerContainer
               onClick={handleClick && handleClick}
               renderBanner={renderBanner}
               id={containerId}
               heightEm={heightEm || 5}
               isDarkTheme={isDarkTheme}
               onMouseDown={handleMouseDown}
               onMouseUp={handleMouseUp}
               onTouchStart={handleMouseDown}
               onTouchEnd={handleMouseUp}
               bannerType={bannerType || 'default'}
            >
               <BannerContent hasIcon={Icon !== undefined || bannerType !== 'default'}>
                  <ConditionalRender condition={Icon !== undefined}>{Icon}</ConditionalRender>
                  <ConditionalRender condition={Icon === undefined}>
                     <ConditionalRender condition={bannerType === 'success'}>
                        <MessageAltCheck height={'50px'} />
                     </ConditionalRender>
                     <ConditionalRender condition={bannerType === 'warning'}>
                        <Warning height={'50px'} />
                     </ConditionalRender>
                     <ConditionalRender condition={bannerType === 'error'}>
                        <ExclamationOctagon height={'50px'} />
                     </ConditionalRender>
                  </ConditionalRender>
                  {message}
               </BannerContent>
            </BannerContainer>
            <VerticalSeperator margTopEm={6} margBottomEm={0} />
         </BannerBackground>
      </ConditionalRender>
   );
}

export default Banner;

Banner.defaultProps = {
   Icon: undefined,
   handleClick: undefined,
   heightEm: 5,
};
