import { Fragment, useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../../../../global/css/colors';
import HTMLEntities from '../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import { GameContext } from '../../../context/GameContext';
import FirestoreDB from '../../../class/FirestoreDb';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import ArrayHelper from '../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';

export default function SummaryData(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [mostVotedFor, setMostVotedFor] = useState('');
   const [ratGuess, setRatGuess] = useState('');
   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const userVotes: string[] = ArrayOfObjects.getArrOfValuesFromKey(userStates, 'votedFor');
      const ratUserState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', currentRat);
      const mostVotedUser = ArrayHelper.findMostRepeatedItem(userVotes);
      setMostVotedFor(mostVotedUser);
      setRatGuess(ratUserState?.guess || '');
   }, [roomData?.gameState.userStates]);
   const roundSummaryMap = [
      {
         key: 'rat',
         value: roomData?.gameState.currentRat,
      },
      {
         key: 'mostVotes',
         value: mostVotedFor,
      },
      {
         key: 'word',
         value: roomData?.gameState.activeWord,
      },
      {
         key: 'guess',
         value: ratGuess,
      },
   ];
   return (
      <FlexColumnWrapper
         width="50%"
         height="100%"
         padding="0.5em 0.5em 0em 0em"
         boxSizing="border-box"
      >
         {roundSummaryMap.map((item) => (
            <Fragment key={item.key}>
               <LogoText
                  color={Color.darkThm.accent}
                  size={'1em'}
                  style={{
                     textDecoration: 'underline',
                     paddingBottom: '0.25em',
                  }}
               >
                  {item.key}
                  {HTMLEntities.space}
               </LogoText>{' '}
               <LogoText
                  key={item.key}
                  size={'1em'}
                  style={{ paddingBottom: '0.5em' }}
                  color={Color.darkThm.accentAlt}
               >
                  {item.value}
               </LogoText>
            </Fragment>
         ))}
      </FlexColumnWrapper>
   );
}
