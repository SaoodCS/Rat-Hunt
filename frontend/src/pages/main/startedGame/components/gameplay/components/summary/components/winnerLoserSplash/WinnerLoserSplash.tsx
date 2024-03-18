import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { FlexColumnWrapper } from '../../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../../../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../../../global/css/colors';
import MiscHelper from '../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../../../global/utils/GameHelper/GameHelper';
import { ThumbsUp } from '@styled-icons/fa-regular/ThumbsUp';
import { ThumbsDown } from '@styled-icons/fa-regular/ThumbsDown';
import type { StyledIcon } from 'styled-icons/types';
import { UserSecret } from '@styled-icons/fa-solid/UserSecret';
import { TextColourizer } from '../../../../../../../../../global/components/lib/font/textColorizer/TextColourizer';

export default function WinnerLoserSplash(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   type TErrorSuccessMsg = {
      condition: boolean;
      guessMsg: { msg: string; success: boolean; icon: StyledIcon };
      caughtMsg: { msg: string; success: boolean; icon: StyledIcon };
   };
   const [errorSuccessMsg, setErrorSuccessMsg] = useState<TErrorSuccessMsg[]>([]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentRat } = gameState;
      const ratGotCaught = GameHelper.Check.ratGotCaught(gameState);
      const ratGuessedCorrectly = GameHelper.Check.isRatGuessCorrect(gameState);
      const thisUserIsRat = currentRat === localDbUser;
      setErrorSuccessMsg([
         {
            condition: thisUserIsRat,
            guessMsg: {
               msg: ratGuessedCorrectly
                  ? 'You guessed the word correctly'
                  : 'You did not guess the word correctly',
               success: ratGuessedCorrectly ? true : false,
               icon: ratGuessedCorrectly ? ThumbsUp : ThumbsDown,
            },
            caughtMsg: {
               msg: ratGotCaught
                  ? 'Most players suspected you as the rat'
                  : 'Most players did not suspect you as the rat',
               success: ratGotCaught ? false : true,
               icon: UserSecret,
            },
         },
         {
            condition: !thisUserIsRat,
            guessMsg: {
               msg: ratGuessedCorrectly
                  ? 'The rat guessed the word correctly'
                  : 'The rat did not guess the word correctly',
               success: ratGuessedCorrectly ? false : true,
               icon: ratGuessedCorrectly ? ThumbsDown : ThumbsUp,
            },
            caughtMsg: {
               msg: ratGotCaught
                  ? 'Most players suspected the rat'
                  : 'Most players did not suspect the rat',
               success: ratGotCaught ? true : false,
               icon: UserSecret,
            },
         },
      ]);
   }, []);

   return (
      <FlexColumnWrapper
         height="100%"
         zIndex={1}
         justifyContent="center"
         alignItems="center"
         textAlign="center"
      >
         {errorSuccessMsg.map(({ condition, caughtMsg, guessMsg }) => (
            <ConditionalRender key={caughtMsg.msg} condition={condition}>
               <FlexColumnWrapper padding="1em" localStyles={screenStyles()}>
                  <FlexColumnWrapper
                     justifyContent="center"
                     alignItems="center"
                     color={caughtMsg.success ? Color.darkThm.success : Color.darkThm.error}
                  >
                     <caughtMsg.icon size="2.5em" />
                     <TextColourizer fontSize="1.25em" padding="1em 0em 1.2em 0em">
                        {caughtMsg.msg}
                     </TextColourizer>
                  </FlexColumnWrapper>

                  <FlexColumnWrapper
                     justifyContent="center"
                     alignItems="center"
                     color={guessMsg.success ? Color.darkThm.success : Color.darkThm.error}
                  >
                     <guessMsg.icon size="2.25em" />
                     <TextColourizer fontSize="1.25em" padding="1em 0em 1.2em 0em">
                        {guessMsg.msg}
                     </TextColourizer>
                  </FlexColumnWrapper>
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
