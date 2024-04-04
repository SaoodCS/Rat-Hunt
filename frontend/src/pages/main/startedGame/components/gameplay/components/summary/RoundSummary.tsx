import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { FlexColumnWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import { ModalContext } from '../../../../../../../global/context/widget/modal/ModalContext';
import MyCSS from '../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../global/css/colors';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import RoundEndForm from './components/form/RoundEndForm';
import ScoreboardSlide from './components/scoreboardSlide/ScoreboardSlide';
import SummaryMarquee from './components/summaryMarquee/SummaryMarquee';
import WinnerLoserSplash from './components/winnerLoserSplash/WinnerLoserSplash';
import {
   MarqueeContainer,
   NextPlayAgainBtnContainer,
   NextRoundPlayAgainBtn,
   RoundSummaryTitle,
   ScoreboardContainer,
} from './style/Style';

export default function RoundSummary(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const [isLastRound, setIsLastRound] = useState(false);
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [displayWinnerLoserSplash, setDisplayWinnerLoserSplash] = useState(true);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentRound, numberOfRoundsSet } = gameState;
      setIsLastRound(currentRound === numberOfRoundsSet);
      const timer = setTimeout(() => {
         setDisplayWinnerLoserSplash(false);
      }, 4000);
      return () => {
         clearTimeout(timer);
         toggleModal(false);
      };
   }, []);

   function handleUpdateGameState(): void {
      setModalHeader(!isLastRound ? 'Next Round' : 'Play Again');
      setModalContent(<RoundEndForm isLastRound={isLastRound} toggleModal={toggleModal} />);
      setModalZIndex(100);
      toggleModal(true);
   }

   return (
      <>
         <FlexColumnWrapper
            height="100%"
            position="relative"
            boxSizing="border-box"
            width="100%"
            localStyles={screenStyles()}
         >
            <ConditionalRender condition={displayWinnerLoserSplash}>
               <WinnerLoserSplash />
            </ConditionalRender>
            <ConditionalRender condition={!displayWinnerLoserSplash}>
               <RoundSummaryTitle>Round Summary</RoundSummaryTitle>
               <NextPlayAgainBtnContainer onClick={handleUpdateGameState}>
                  <NextRoundPlayAgainBtn>
                     {!isLastRound ? 'Next Round' : 'Play Again'}
                  </NextRoundPlayAgainBtn>
               </NextPlayAgainBtnContainer>
               <MarqueeContainer>
                  <SummaryMarquee />
               </MarqueeContainer>
               <ScoreboardContainer>
                  <ScoreboardSlide />
               </ScoreboardContainer>
            </ConditionalRender>
         </FlexColumnWrapper>
      </>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forAll = css`
      font-size: 0.8em;
   `;
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1em;
   `);
   const forTablet = MyCSS.Media.tablet(css``);

   const medium = css`
      @media (min-width: 544px) {
         ${NextPlayAgainBtnContainer} {
            left: 50%;
            right: 0;
            justify-content: center;
            max-width: 28em;
         }
         ${MarqueeContainer} {
            max-width: 45em;
            margin: 0 auto;
            border-left: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.5)};
            border-right: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.5)};
         }
      }
   `;
   return MyCSS.Helper.concatStyles(forAll, forDesktop, forTablet, medium);
};
