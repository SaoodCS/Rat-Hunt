import { useContext } from 'react';
import { PopupMenuContext } from '../../../context/widget/popupMenu/PopupMenuContext';

export default function PopupMenuExample(): JSX.Element {
   const {
      setPMContent,
      setPMHeightPx,
      togglePM,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   function handleOpen(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
      togglePM(true);
      setClickEvent(e);
      setPMWidthPx(100);
      setPMHeightPx(100);
      setPMContent(
         <div>
            <button onClick={() => togglePM(false)}>Close</button>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
         </div>,
      );
      setCloseOnInnerClick(true);
   }
   return (
      <>
         <button
            onClick={(e) => handleOpen(e)}
            style={{ position: 'fixed', right: 100, bottom: 0 }}
         >
            Open
         </button>
      </>
   );
}
