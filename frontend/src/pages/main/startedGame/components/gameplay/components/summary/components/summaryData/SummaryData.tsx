import { Fragment, useContext, useEffect, useState } from 'react';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../../../global/utils/DBConnect/DBConnect';
import { BannerContext } from '../../../../../../../../../global/context/widget/banner/BannerContext';
import MiscHelper from '../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ArrayOfObjects from '../../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import ArrayHelper from '../../../../../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import { FlexColumnWrapper } from '../../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { LogoText } from '../../../../../../../../../global/components/app/logo/LogoText';
import Color from '../../../../../../../../../global/css/colors';
import HTMLEntities from '../../../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';

export default function SummaryData(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   //const [mostVotedFor, setMostVotedFor] = useState('');
   const [ratGuess, setRatGuess] = useState('');
   const { toggleBanner, setBannerMessage, setBannerZIndex, setBannerType } =
      useContext(BannerContext);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const userVotes: string[] = ArrayOfObjects.getArrOfValuesFromKey(userStates, 'votedFor');
      const ratUserState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', currentRat);
      const mostRepeatedItems = ArrayHelper.findMostRepeatedItems(userVotes);
      const ratGotCaught = mostRepeatedItems.length === 1 && mostRepeatedItems.includes(currentRat);
      setRatGuess(ratUserState?.guess || '');
      // const ratGotCaught = mostVotedUser === currentRat;
      const thisUserIsRat = currentRat === localDbUser;
      if (thisUserIsRat) {
         setBannerMessage(!ratGotCaught ? 'You got away!' : 'You got caught!');
         setBannerType(!ratGotCaught ? 'success' : 'error');
      }
      if (!thisUserIsRat) {
         setBannerMessage(ratGotCaught ? 'You caught the rat!' : 'The rat got away!');
         setBannerType(ratGotCaught ? 'success' : 'error');
      }
      setBannerZIndex(100);
      toggleBanner(true);

      return () => toggleBanner(false);
   }, [roomData?.gameState.userStates]);

   const roundSummaryMap = [
      {
         key: 'rat',
         value: roomData?.gameState.currentRat,
      },
      // {
      //    key: 'mostVotes',
      //    value: mostVotedFor,
      // },
      {
         key: 'word',
         value: roomData?.gameState.activeWord,
      },
      {
         key: 'rat guessed',
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
