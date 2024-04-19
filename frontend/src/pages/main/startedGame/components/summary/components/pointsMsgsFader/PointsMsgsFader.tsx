import { useContext, useEffect, useRef, useState } from 'react';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import ArrOfObj from '../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import NumberHelper from '../../../../../../../../../shared/lib/helpers/number/NumberHelper';
import { TextColourizer } from '../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../global/css/utils/colors';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import { PointsItem } from './style/Style';

interface IPointsMsgs {
   msg: string;
   type: 'success' | 'error';
}

const TIME_TO_SHOW = NumberHelper.secsToMs(5);

export default function PointsMsgsFader(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [currentIndex, setCurrentIndex] = useState(0);
   const pointsItemRef = useRef<HTMLDivElement>(null);
   const [pointsMsgs, setPointsMsgs] = useState<IPointsMsgs[]>([]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentRat } = gameState;
      const ratGotCaught = GameHelper.Check.ratGotCaught(gameState);
      const ratGuessedCorrectly = GameHelper.Check.isRatGuessCorrect(gameState);
      const thisUserIsRat = currentRat === localDbUser;
      const userVotedForRat = GameHelper.Check.userVotedForRat(gameState, localDbUser);
      const ratVoters = GameHelper.Get.ratVoters(gameState);
      const noUserVotedForRat = ratVoters.length === 0;
      let msgs: IPointsMsgs[] = [];
      if (thisUserIsRat) {
         msgs = [
            {
               msg: ratGotCaught
                  ? 'Most players suspected you as the rat (+0)'
                  : 'Most players did not suspect you as the rat (+1)',
               type: ratGotCaught ? 'error' : 'success',
            },
            {
               msg: ratGuessedCorrectly
                  ? 'You guessed the word correctly (+1)'
                  : 'You guessed the word incorrectly (+0)',
               type: ratGuessedCorrectly ? 'success' : 'error',
            },
            {
               msg: noUserVotedForRat
                  ? 'No one suspected you as the rat (+1)'
                  : `At least one player suspected you as the rat (+0)`,
               type: noUserVotedForRat ? 'success' : 'error',
            },
         ];
      } else {
         msgs = [
            {
               msg: ratGotCaught
                  ? 'Your team suspected the rat correctly (+1)'
                  : 'Your team did not suspect the rat (+0)',
               type: ratGotCaught ? 'success' : 'error',
            },
            {
               msg: ratGuessedCorrectly
                  ? 'Your team gave the word away to the rat (+0)'
                  : 'Your team did not give the word away to the rat (+1)',
               type: ratGuessedCorrectly ? 'error' : 'success',
            },
            {
               msg: userVotedForRat
                  ? 'You voted for the rat correctly (+1)'
                  : 'You did not vote for the rat (+0)',
               type: userVotedForRat ? 'success' : 'error',
            },
         ];
      }
      setPointsMsgs(ArrOfObj.sort(msgs, 'type', true));
   }, [roomData?.gameState?.userStates]);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentIndex((prevIndex) => (prevIndex + 1) % pointsMsgs.length);
         setTimeout(() => {
            if (pointsItemRef.current) {
               pointsItemRef.current.style.opacity = '0';
               pointsItemRef.current.style.transition = 'opacity 1s';
            }
         }, TIME_TO_SHOW - 1000);
      }, TIME_TO_SHOW);

      return () => {
         clearInterval(interval);
      };
   }, [pointsMsgs]);

   return (
      <>
         {pointsMsgs.map((point, index) => (
            <ConditionalRender condition={index === currentIndex} key={index}>
               <PointsItem ref={pointsItemRef}>
                  <TextColourizer
                     color={point.type === 'error' ? Color.darkThm.error : Color.darkThm.success}
                  >
                     {point.msg}
                  </TextColourizer>
               </PointsItem>
            </ConditionalRender>
         ))}
      </>
   );
}
