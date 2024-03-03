import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import FirestoreDB from '../../../class/FirestoreDb';
import { GameContext } from '../../../context/GameContext';
import SummaryData from './SummaryData';
import ScoresTable from './ScoresTable';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import { BtnContainer } from '../../header/Style';
import { TextBtn } from '../../../../../global/components/lib/button/textBtn/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import HTMLEntities from '../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';

export default function RoundSummary(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [isLastRound, setIsLastRound] = useState(false);
   const { data: topicsData } = FirestoreDB.Topics.getTopicsQuery();
   const setRoomData = FirestoreDB.Room.setRoomMutation({});

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentRound, numberOfRoundsSet } = gameState;
      setIsLastRound(currentRound === numberOfRoundsSet);
   }, []);

   async function handleUpdateGameState(): Promise<void> {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
      const { gameState } = roomData;
      const { activeTopic } = gameState;
      const newTopic = FirestoreDB.Room.randNewTopicKey(activeTopic, topicsData);
      const updatedGameState = FirestoreDB.Room.updateGameStateForNextRound(
         gameState,
         topicsData,
         newTopic,
         isLastRound ? true : undefined,
         isLastRound ? true : undefined,
      );
      await setRoomData.mutateAsync({
         ...roomData,
         gameState: updatedGameState,
      });
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
                  <TextColourizer fontSize="0.8em">
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
