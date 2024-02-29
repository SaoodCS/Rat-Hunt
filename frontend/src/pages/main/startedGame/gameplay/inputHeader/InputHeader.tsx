import { useContext, useEffect, useState } from 'react';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { GameContext } from '../../../context/GameContext';
import FirestoreDB from '../../../class/FirestoreDb';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ClueForm from './clueForm/ClueForm';
import RatVoteForm from './ratVoteForm/RatVoteForm';
import WordGuessForm from './wordGuessForm/WordGuessForm';

export default function InputHeader(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [displayedForm, setDisplayedForm] = useState<JSX.Element | undefined>();

   useEffect(() => {
      


      // if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      // const haveAllPlayersSubmittedClues = roomData.gameState.userStates.every((userState) =>
      //    MiscHelper.isNotFalsyOrEmpty(userState.clue),
      // );
      // const isYourTurn = roomData.gameState.currentTurn === localDbUser;
      // const isPlayerRat = roomData.gameState.currentRat === localDbUser;
      // if (!isYourTurn) {
      //    setDisplayedForm(undefined);
      //    return;
      // }
      // if (!haveAllPlayersSubmittedClues && isYourTurn) {
      //    setDisplayedForm(<ClueForm />);
      //    return;
      // }
      // if (haveAllPlayersSubmittedClues && isYourTurn) {
      //    if (!isPlayerRat) {
      //       setDisplayedForm(<RatVoteForm />);
      //       return;
      //    }
      //    if (isPlayerRat)
      //       setDisplayedForm(
      //          <>
      //             <RatVoteForm />
      //             <WordGuessForm />
      //          </>,
      //       );
      // }
   }, [roomData?.gameState.currentTurn, localDbUser]);

   return (
      <FlexRowWrapper position="absolute" height="1em">
         {displayedForm}
      </FlexRowWrapper>
   );
}
