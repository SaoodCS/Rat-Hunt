import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import RoundEndForm from './components/form/RoundEndForm';
import ScoreboardSlide from './components/scoreboardSlide/ScoreboardSlide';
import SummaryMarquee from './components/summaryMarquee/SummaryMarquee';
import {
   MarqueeContainer,
   NextPlayAgainBtnContainer,
   NextRoundPlayAgainBtn,
   RoundSummaryTitle,
   ScoreboardContainer,
} from './style/Style';
import { GameContext } from '../../../../../global/context/game/GameContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import MiscHelper from '../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import MyCSS from '../../../../../global/css/MyCSS';
import Color from '../../../../../global/css/colors';

export default function RoundSummary(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const [isLastRound, setIsLastRound] = useState(false);
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentRound, numberOfRoundsSet } = gameState;
      setIsLastRound(currentRound === numberOfRoundsSet);
      return () => {
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
