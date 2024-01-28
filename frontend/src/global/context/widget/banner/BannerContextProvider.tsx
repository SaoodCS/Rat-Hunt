import type { ReactNode } from 'react';
import { useState } from 'react';
import Banner from '../../../components/lib/banner/Banner';
import useFuncState from '../../../hooks/useFuncState';
import type { IBannerType } from './BannerContext';
import { BannerContext } from './BannerContext';

interface IBannerContextProvider {
   children: ReactNode;
}

export const BannerContextProvider = (props: IBannerContextProvider): JSX.Element => {
   const { children } = props;
   const [isBannerDisplayed, setIsBannerDisplayed] = useState(false);
   const [bannerMessage, setBannerMessage] = useState('');
   const [handleBannerClick, setHandleBannerClick] = useFuncState(() => null);
   const [BannerIcon, setBannerIcon] = useState<ReactNode>(undefined);
   const [bannerHeightEm, setBannerHeightEm] = useState(5);
   const [bannerZIndex, setBannerZIndex] = useState<number | undefined>(undefined);
   const [bannerType, setBannerType] = useState<IBannerType>('default');

   function onClose(): void {
      setIsBannerDisplayed(false);
      setBannerIcon(undefined);
      setBannerMessage('');
      setHandleBannerClick(() => null);
      setBannerZIndex(undefined);
      setBannerType('default');
   }

   function toggleBanner(show: boolean): void {
      if (show) setIsBannerDisplayed(true);
      else setIsBannerDisplayed(false);
   }

   return (
      <>
         <BannerContext.Provider
            value={{
               isBannerDisplayed,
               bannerMessage,
               setBannerMessage,
               setHandleBannerClick,
               setBannerIcon,
               setBannerHeightEm,
               bannerZIndex,
               setBannerZIndex,
               setBannerType,
               toggleBanner,
            }}
         >
            {children}
         </BannerContext.Provider>
         <Banner
            message={bannerMessage}
            handleClick={handleBannerClick}
            isVisible={isBannerDisplayed}
            Icon={BannerIcon ? BannerIcon : undefined}
            onClose={onClose}
            heightEm={bannerHeightEm}
            zIndex={bannerZIndex}
            bannerType={bannerType}
         />
      </>
   );
};
