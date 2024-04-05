import { useContext, useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import { MarqueeItem } from './style/Style';
import { TextColourizer } from '../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import Color from '../../../../../../../global/css/colors';

export default function SummaryMarquee(): JSX.Element {
   type IRoundSummaryMap = {
      key: string;
      value: string | undefined;
   }[];
   const { localDbRoom } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [roundSummaryMap, setRoundSummaryMap] = useState<IRoundSummaryMap>([]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentRat, activeWord } = gameState;
      const ratGuess = GameHelper.Get.ratGuess(gameState);
      setRoundSummaryMap([
         {
            key: 'the rat',
            value: currentRat,
         },
         {
            key: 'secret word',
            value: activeWord,
         },
         {
            key: 'rat guessed',
            value: ratGuess,
         },
      ]);
   }, [
      roomData?.gameState?.currentRat,
      roomData?.gameState?.activeWord,
      roomData?.gameState?.userStates,
   ]);
   return (
      <Marquee speed={30}>
         {roundSummaryMap.map((item) => (
            <MarqueeItem key={item.key}>
               <TextColourizer color={Color.darkThm.error}>{item.key}</TextColourizer>
               <TextColourizer color={Color.darkThm.success}>{item.value}</TextColourizer>
            </MarqueeItem>
         ))}
      </Marquee>
   );
}
