// Note -> Scroll animations for this component may not work on desktop browser if animation effects are turned off in Windows settings.
import { useContext } from 'react';
import { BannerContext } from '../../../context/widget/banner/BannerContext';

export default function BannerExample(): JSX.Element {
   const {
      setHandleBannerClick,
      toggleBanner,
      setBannerHeightEm,
      setBannerMessage,
      isBannerDisplayed,
   } = useContext(BannerContext);

   function handleShowBanner(): void {
      setHandleBannerClick(() => console.log('Banner clicked'));
      setBannerHeightEm(5);
      setBannerMessage('Banner message');
      toggleBanner(true);
   }
   return (
      <button onClick={() => handleShowBanner()} disabled={isBannerDisplayed}>
         Show Banner
      </button>
   );
}
