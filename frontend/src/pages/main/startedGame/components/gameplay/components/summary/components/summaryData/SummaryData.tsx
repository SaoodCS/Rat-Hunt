import { Fragment, useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import MiscHelper from '../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../../../global/utils/DBConnect/DBConnect';
import useScrollFader from '../../../../../../../../../global/hooks/useScrollFader';

export default function SummaryData(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [ratGuess, setRatGuess] = useState('');
   const { handleScroll, faderElRef } = useScrollFader([roomData], 1.5);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const ratUserState = ArrOfObj.findObj(userStates, 'userId', currentRat);
      setRatGuess(ratUserState?.guess || '');
   }, [roomData?.gameState?.userStates]);

   const roundSummaryMap = [
      {
         key: 'rat',
         value: roomData?.gameState?.currentRat,
      },
      {
         key: 'word',
         value: roomData?.gameState?.activeWord,
      },
      {
         key: 'rat guessed',
         value: ratGuess,
      },
   ];

   return (
      <>
         <FlexColumnWrapper
            width="50%"
            height="100%"
            padding="0.5em 0.5em 0em 0em"
            boxSizing="border-box"
            onScroll={handleScroll}
            ref={faderElRef}
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
                  </LogoText>
                  <LogoText
                     key={item.key}
                     size={'1em'}
                     style={{
                        paddingBottom: '0.5em',
                     }}
                     color={Color.darkThm.accentAlt}
                     wrapAndHyphenate
                  >
                     {item.value}
                  </LogoText>
               </Fragment>
            ))}
         </FlexColumnWrapper>
      </>
   );
}
