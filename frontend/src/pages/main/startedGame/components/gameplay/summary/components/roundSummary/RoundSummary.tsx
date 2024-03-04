import { useContext, useEffect, useState } from 'react';
import { BtnContainer } from '../../../../header/Style';
import ScoresTable from '../scoresTable/ScoresTable';
import SummaryData from '../summaryData/SummaryData';
import { LogoText } from '../../../../../../../../global/components/app/logo/LogoText';
import { TextBtn } from '../../../../../../../../global/components/lib/button/textBtn/Style';
import { TextColourizer } from '../../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import HTMLEntities from '../../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import MiscHelper from '../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../../../../../../class/FirestoreDb';
import { GameContext } from '../../../../../../context/GameContext';
import { ModalContext } from '../../../../../../../../global/context/widget/modal/ModalContext';
import RoundEndForm from './components/form/RoundEndForm';

export default function RoundSummary(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const [isLastRound, setIsLastRound] = useState(false);
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
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
      <FlexColumnWrapper
         height="100%"
         position="relative"
         filter="brightness(1.5)"
         boxSizing="border-box"
      >
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
      </FlexColumnWrapper>
   );
}
