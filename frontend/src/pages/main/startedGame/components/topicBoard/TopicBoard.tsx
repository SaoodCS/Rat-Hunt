import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import GameHelper from '../../../../../../../shared/app/GameHelper/GameHelper';
import { topics } from '../../../../../../../shared/app/utils/topics/topics';
import MiscHelper from '../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { GameContext } from '../../../../../global/context/game/GameContext';
import { CSS_Helper } from '../../../../../global/css/utils/helper';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import { BoardCell, BoardContainer, BoardRow, CellValue } from './style/Style';
import { CSS_Media } from '../../../../../global/css/utils/media';

export default function TopicBoard(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords, setActiveTopicWords } =
      useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [rows, setRows] = useState<GameHelper.I.WordCell[][]>([[]]);

   useEffect(() => {
      // this useEffect is responsible for updating the activeTopicWords when the activeTopic changes
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { activeTopic } = roomData.gameState;
      const activeTopicWords = GameHelper.Get.topicWordsAndCells(activeTopic);
      setActiveTopicWords(activeTopicWords);
   }, [roomData?.gameState?.activeWord, topics]);

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
   const forDesktop = CSS_Media.Query.desktop(css`
      font-size: 1.15em;
   `);
   const forTablet = CSS_Media.Query.tablet(css``);
   return CSS_Helper.concatStyles(forDesktop, forTablet, allStyles);
};
