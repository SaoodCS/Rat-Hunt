import { useContext, useEffect, useState } from 'react';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import { GameContext } from '../../../../../global/context/game/GameContext';
import useScrollFader from '../../../../../global/hooks/useScrollFader';
import { ToastContext } from '../../../../../global/context/widget/toast/ToastContext';
import Device from '../../../../../global/helpers/pwa/deviceHelper';
import {
   GameDetailsContainer,
   GameDetailsItemWrapper,
   ItemLabel,
   ItemValue,
   RoomIDBtn,
   RoomIDBtnWrapper,
} from './style/Style';
import HTMLEntities from '../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import Color from '../../../../../global/css/colors';
import { SquareShareNodes } from '@styled-icons/fa-solid/SquareShareNodes';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import MyCSS from '../../../../../global/css/MyCSS';

interface IGameHeaderDetails {
   label: string;
   value: string;
}

export default function GameDetails(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [gameHeaderDetails, setGameHeaderDetails] = useState<IGameHeaderDetails[]>([]);
   const { handleScroll, faderElRef } = useScrollFader([roomData], 3);
   const {
      toggleToast,
      setToastMessage,
      setWidth,
      setVerticalPos,
      setHorizontalPos,
      setToastZIndex,
   } = useContext(ToastContext);

   useEffect(() => {
      const newGameHeaderDetails: IGameHeaderDetails[] = [
         {
            label: 'Round',
            value: `${roomData?.gameState?.currentRound} / ${roomData?.gameState?.numberOfRoundsSet}`,
         },
         {
            label: 'Topic',
            value: roomData?.gameState?.activeTopic || 'No Topic',
         },
      ];
      setGameHeaderDetails(newGameHeaderDetails);
   }, [
      roomData?.gameState?.currentRound,
      roomData?.gameState?.numberOfRoundsSet,
      roomData?.gameState?.activeTopic,
   ]);

   async function shareRoomCode(): Promise<void> {
      if (!navigator.share) {
         await navigator.clipboard.writeText(localDbRoom);
         toggleToast(true);
         setToastMessage('Room Code Copied');
         setWidth('15em');
         setVerticalPos('bottom');
         setHorizontalPos('center');
         setToastZIndex(100);
         return;
      }
      await Device.shareContent({
         title: 'Play Rat Hunt With Me!',
         text: `Play Rat Hunt with me! Room code: ${localDbRoom}`,
      });
   }

   return (
      <>
         <GameDetailsContainer
            ref={faderElRef}
            onScroll={handleScroll}
            localStyles={screenStyles()}
         >
            <RoomIDBtnWrapper>
               <RoomIDBtn onClick={shareRoomCode}>
                  Room ID:{HTMLEntities.space}
                  {HTMLEntities.space}
                  {localDbRoom}
                  {HTMLEntities.space}
                  {HTMLEntities.space}
                  <SquareShareNodes size="1em" color={Color.darkThm.warning} />
               </RoomIDBtn>
            </RoomIDBtnWrapper>
            {gameHeaderDetails.map(({ label, value }, index) => (
               <GameDetailsItemWrapper key={index}>
                  <ConditionalRender condition={!!value && !value.includes('THE RAT')}>
                     <ItemLabel color={Color.darkThm.error}>{label}</ItemLabel>
                  </ConditionalRender>
                  <ItemValue
                     color={Color.darkThm.success}
                     ratUser={!!value && value.includes('THE RAT')}
                  >
                     {value}
                  </ItemValue>
               </GameDetailsItemWrapper>
            ))}
         </GameDetailsContainer>
      </>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forMobile = MyCSS.Media.mobile(css``);
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1em;
   `);
   const medium = css`
      @media (min-width: 544px) {
         margin: 0 auto;
         & > *:not(:first-child) {
            & > * {
               width: 50%;
               &:first-child {
                  text-align: end;
               }
            }
         }
      }
   `;
   return MyCSS.Helper.concatStyles(forDesktop, forMobile, medium);
};
