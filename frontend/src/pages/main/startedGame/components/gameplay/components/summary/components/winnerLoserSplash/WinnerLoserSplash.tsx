import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { LogoText } from '../../../../../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../../../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../../../global/css/colors';
import MiscHelper from '../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../../../global/utils/GameHelper/GameHelper';

export default function WinnerLoserSplash(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [thisUserIsRat, setThisUserIsRat] = useState(false);
   const [ratGotCaught, setRatGotCaught] = useState(false);
   const [ratGuessedCorrectly, setRatGuessedCorrectly] = useState(false);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentRat } = gameState;
      const ratGotCaught = GameHelper.Check.ratGotCaught(gameState);
      const ratGuessedCorrectly = GameHelper.Check.isRatGuessCorrect(gameState);
      const thisUserIsRat = currentRat === localDbUser;
      setRatGuessedCorrectly(ratGuessedCorrectly);
      setThisUserIsRat(thisUserIsRat);
      setRatGotCaught(ratGotCaught);
   }, []);

   const errorSuccessMsg = [
      {
         condition: thisUserIsRat,
         guessMsg: {
            msg: ratGuessedCorrectly
               ? 'You guessed the word correctly'
               : 'You did not guess the word correctly',
            success: ratGuessedCorrectly ? true : false,
         },

         caughtMsg: {
            msg: ratGotCaught
               ? 'Most players did not suspect you as the rat'
               : 'Most players suspected you as the rat',
            success: ratGotCaught ? false : true,
         },
      },
      {
         condition: !thisUserIsRat,
         guessMsg: {
            msg: ratGuessedCorrectly
               ? 'The rat guessed the word correctly'
               : 'The rat did not guess the word correctly',
            success: ratGuessedCorrectly ? false : true,
         },
         caughtMsg: {
            msg: ratGotCaught
               ? 'The rat got voted for the most'
               : 'The rat did not get voted for the most',
            success: ratGotCaught ? true : false,
         },
      },
   ];

   return (
      <FlexColumnWrapper
         height="100%"
         zIndex={1}
         justifyContent="center"
         alignItems="center"
         textAlign="center"
      >
         {errorSuccessMsg.map((item) => (
            <ConditionalRender key={item.caughtMsg.msg} condition={item.condition}>
               <FlexColumnWrapper padding="1em" localStyles={screenStyles()}>
                  <LogoText
                     size="1.25em"
                     color={item.caughtMsg.success ? Color.darkThm.success : Color.darkThm.error}
                  >
                     {item.caughtMsg.msg}
                  </LogoText>
                  <LogoText
                     size="1.25em"
                     color={item.guessMsg.success ? Color.darkThm.success : Color.darkThm.error}
                  >
                     {item.guessMsg.msg}
                  </LogoText>
               </FlexColumnWrapper>
            </ConditionalRender>
         ))}
      </FlexColumnWrapper>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forAll = css`
      & > * {
         margin-bottom: 0.5em;
      }
   `;

   return MyCSS.Helper.concatStyles(forAll);
};