import { Happy2 } from '@styled-icons/icomoon/Happy2';
import { Sad2 } from '@styled-icons/icomoon/Sad2';
import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../../../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Color from '../../../../../../../../../global/css/colors';
import ArrayHelper from '../../../../../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../../../global/utils/DBConnect/DBConnect';

export default function WinnerLoserSplash(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [thisUserIsRat, setThisUserIsRat] = useState(false);
   const [ratGotCaught, setRatGotCaught] = useState(false);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const userVotes: string[] = ArrOfObj.getArrOfValuesFromKey(userStates, 'votedFor');
      const mostRepeatedItems = ArrayHelper.findMostRepeatedItems(userVotes);
      const ratGotCaught = mostRepeatedItems.length === 1 && mostRepeatedItems.includes(currentRat);
      const thisUserIsRat = currentRat === localDbUser;
      setThisUserIsRat(thisUserIsRat);
      setRatGotCaught(ratGotCaught);
   }, []);

   const errorSuccessMsg = [
      {
         msg: 'You got away!',
         condition: thisUserIsRat && !ratGotCaught,
         success: true,
      },
      {
         msg: 'You got caught!',
         condition: thisUserIsRat && ratGotCaught,
         success: false,
      },
      {
         msg: 'You caught the rat!',
         condition: !thisUserIsRat && ratGotCaught,
         success: true,
      },
      {
         msg: 'The rat got away!',
         condition: !thisUserIsRat && !ratGotCaught,
         success: false,
      },
   ];

   return (
      <FlexColumnWrapper
         position="fixed"
         top="0.5em"
         bottom="0.5em"
         left="0.5em"
         right="0.5em"
         background={Color.setRgbOpacity(Color.darkThm.bg, 0.95)}
         zIndex={1}
         borderRadius="1em"
         justifyContent="center"
         alignItems="center"
         backdropFilter="blur(50px)"
      >
         {errorSuccessMsg.map((item) => (
            <ConditionalRender key={item.msg} condition={item.condition}>
               {item.success && <Happy2 size="5em" color={Color.darkThm.success} />}
               {!item.success && <Sad2 size="5em" color={Color.darkThm.error} />}
               <FlexColumnWrapper padding="1em">
                  <LogoText
                     size="2em"
                     color={item.success ? Color.darkThm.success : Color.darkThm.error}
                  >
                     {item.msg}
                  </LogoText>
               </FlexColumnWrapper>
            </ConditionalRender>
         ))}
      </FlexColumnWrapper>
   );
}
