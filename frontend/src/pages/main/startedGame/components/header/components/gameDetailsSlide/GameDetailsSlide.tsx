import { Copy } from '@styled-icons/fluentui-system-regular/Copy';
import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import { ToastContext } from '../../../../../../../global/context/widget/toast/ToastContext';
import MyCSS from '../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import useScrollFader from '../../../../../../../global/hooks/useScrollFader';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import {
   GameDetailsContainer,
   GameDetailsItemWrapper,
   ItemLabel,
   ItemValue,
   RoomIDScoreboardItem,
   RoomIDScoreboardWrapper,
} from '../../style/Style';

interface IGameHeaderDetails {
   label: string;
   value: string;
}

interface IGameDetailsSlide {
   scrollToSlide: (slideNumber: number) => void;
}

export default function GameDetailsSlide(props: IGameDetailsSlide): JSX.Element {
   const { scrollToSlide } = props;
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
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
         {
            label: 'Word',
            value:
               roomData?.gameState?.currentRat === localDbUser
                  ? 'YOU ARE THE RAT'
                  : ArrOfObj.findObj(
                       activeTopicWords,
                       'word',
                       roomData?.gameState?.activeWord || '',
                    )?.cellId,
         },
      ];
      setGameHeaderDetails(newGameHeaderDetails);
   }, [
      roomData?.gameState?.currentRound,
      roomData?.gameState?.numberOfRoundsSet,
      roomData?.gameState?.activeTopic,
      roomData?.gameState?.currentRat,
      roomData?.gameState?.activeWord,
      activeTopicWords,
      localDbUser,
   ]);

   async function copyToClipboard(): Promise<void> {
      await navigator.clipboard.writeText(localDbRoom);
      setToastMessage('Room ID Copied!');
      setWidth('200px');
      setVerticalPos('bottom');
      setHorizontalPos('center');
      setToastZIndex(100);
      toggleToast(true);
   }

   return (
      <>
         <GameDetailsContainer
            ref={faderElRef}
            onScroll={handleScroll}
            localStyles={screenStyles()}
         >
            <RoomIDScoreboardWrapper>
               <RoomIDScoreboardItem onClick={copyToClipboard}>
                  Room ID:{HTMLEntities.space}
                  {HTMLEntities.space}
                  {localDbRoom}
                  {HTMLEntities.space}
                  <Copy size="0.85em" />
               </RoomIDScoreboardItem>
               <RoomIDScoreboardItem onClick={() => scrollToSlide(2)}>
                  Scoreboard
               </RoomIDScoreboardItem>
            </RoomIDScoreboardWrapper>
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
