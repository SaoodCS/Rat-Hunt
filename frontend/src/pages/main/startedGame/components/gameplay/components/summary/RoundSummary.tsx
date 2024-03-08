import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { LogoText } from '../../../../../../../global/components/app/logo/LogoText';
import { TextBtn } from '../../../../../../../global/components/lib/button/textBtn/Style';
import { TextColourizer } from '../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import { ModalContext } from '../../../../../../../global/context/widget/modal/ModalContext';
import MyCSS from '../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../global/css/colors';
import HTMLEntities from '../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import { BtnContainer } from '../../../header/style/Style';
import RoundEndForm from './components/form/RoundEndForm';
import ScoresTable from './components/scoresTable/ScoresTable';
import SummaryData from './components/summaryData/SummaryData';
import WinnerLoserSplash from './components/winnerLoserSplash/WinnerLoserSplash';

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
            localStyles={screenStyles()}
         >
            <ConditionalRender condition={displayWinnerLoserSplash}>
               <WinnerLoserSplash />
            </ConditionalRender>
            <ConditionalRender condition={!displayWinnerLoserSplash}>
               <FlexRowWrapper position="absolute" height="1.5em" margin="1em">
                  <LogoText size="1.4em">Round Summary {HTMLEntities.space} </LogoText>
                  <BtnContainer>
                     <TextBtn isDarkTheme onClick={handleUpdateGameState}>
                        <TextColourizer fontSize="0.7em">
                           {!isLastRound ? 'Next Round' : 'Play Again'}
                        </TextColourizer>
                     </TextBtn>
                  </BtnContainer>
               </FlexRowWrapper>
               <FlexRowWrapper
                  position="absolute"
                  top="2em"
                  margin="1em"
                  left="0"
                  right="0"
                  bottom="0"
                  justifyContent="start"
                  alignItems="start"
               >
                  <SummaryData />
                  <ScoresTable />
               </FlexRowWrapper>
            </ConditionalRender>
         </FlexColumnWrapper>
      </>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forAll = css`
      & > :nth-child(2) {
         text-align: center;
         align-items: center;
         border: 2px solid ${Color.setRgbOpacity(Color.darkThm.accent, 1)};
         border-radius: 1em;
         & > :first-child {
            border-right: 2px solid ${Color.setRgbOpacity(Color.darkThm.accent, 1)};
            overflow-y: scroll;
            ${MyCSS.Scrollbar.hide};
            border-bottom-right-radius: 0.25em;
            border-top-right-radius: 0.25em;
            mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent 100%);
         }
         & > :nth-child(2) {
            mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent 100%);
         }
      }
   `;
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1.2em;
      align-items: center;
      & > :nth-child(2) {
         width: 31em;
         justify-self: center;
      }
   `);
   const forTablet = MyCSS.Media.tablet(css``);
   return MyCSS.Helper.concatStyles(forAll, forDesktop, forTablet);
};
