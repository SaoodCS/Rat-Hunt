import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { GameContext } from '../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../global/css/MyCSS';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import { BoardCell, BoardContainer, BoardRow, CellValue } from './style/Style';
import GameHelper from '../../../../../../../shared/app/GameHelper/GameHelper';
import MiscHelper from '../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';

export default function TopicBoard(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords, setActiveTopicWords } =
      useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { data: topicsData } = DBConnect.FSDB.Get.topics();
   const [rows, setRows] = useState<GameHelper.I.WordCell[][]>([[]]);

   useEffect(() => {
      // this useEffect is responsible for updating the activeTopicWords when the activeTopic changes
      const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
      const topicsDataExists = MiscHelper.isNotFalsyOrEmpty(topicsData);
      if (roomDataExists && topicsDataExists) {
         const activeTopicWords = GameHelper.Get.topicWordsAndCells(
            topicsData,
            roomData.gameState.activeTopic,
         );
         setActiveTopicWords(activeTopicWords);
      }
   }, [roomData?.gameState?.activeWord, topicsData]);

   useEffect(() => {
      const rowA = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'A');
      const rowB = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'B');
      const rowC = activeTopicWords.filter((word) => word.cellId.charAt(0) === 'C');
      setRows([rowA, rowB, rowC]);
   }, [activeTopicWords]);

   function isItemActiveWord(word: string): boolean {
      return roomData?.gameState?.activeWord === word;
   }

   return (
      <FlexColumnWrapper localStyles={screenStyles()}>
         <BoardContainer>
            {rows.map((row, index) => (
               <BoardRow key={index}>
                  {row.map((item, index) => (
                     <BoardCell
                        key={index}
                        isActiveWord={isItemActiveWord(item.word)}
                        isUserRat={localDbUser === roomData?.gameState?.currentRat}
                     >
                        <CellValue>{item.word}</CellValue>
                     </BoardCell>
                  ))}
               </BoardRow>
            ))}
         </BoardContainer>
      </FlexColumnWrapper>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const allStyles = css`
      height: 100%;
      margin: 0 auto;
   `;
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1.15em;
   `);
   const forTablet = MyCSS.Media.tablet(css``);
   return MyCSS.Helper.concatStyles(forDesktop, forTablet, allStyles);
};
