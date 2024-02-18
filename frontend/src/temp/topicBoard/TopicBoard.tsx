import { LogoText } from '../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../global/css/colors';
import { BoardCell, BoardContainer, BoardRow, CellUID, CellValue } from './Style';

export default function TopicBoard(): JSX.Element {
   const currentWord = 'New York';
   const isUserRat = false;
   const topicWords = [
      {
         cellId: 'A1',
         word: 'London',
      },
      {
         cellId: 'A2',
         word: 'New York',
      },
      {
         cellId: 'A3',
         word: 'Paris',
      },
      {
         cellId: 'A4',
         word: 'Tokyo',
      },
      {
         cellId: 'B1',
         word: 'Rome',
      },
      {
         cellId: 'B2',
         word: 'Berlin',
      },
      {
         cellId: 'B3',
         word: 'Sydney',
      },
      {
         cellId: 'B4',
         word: 'Moscow',
      },
      {
         cellId: 'C1',
         word: 'Cairo',
      },
      {
         cellId: 'C2',
         word: 'Beijing',
      },
      {
         cellId: 'C3',
         word: 'Athens',
      },
      {
         cellId: 'C4',
         word: 'Rio',
      },
      {
         cellId: 'D1',
         word: 'Delhi',
      },
      {
         cellId: 'D2',
         word: 'Bangkok',
      },
      {
         cellId: 'D3',
         word: 'Havana',
      },
      {
         cellId: 'D4',
         word: 'Lima',
      },
   ];

   const rowA = topicWords.filter((word) => word.cellId.charAt(0) === 'A');
   const rowB = topicWords.filter((word) => word.cellId.charAt(0) === 'B');
   const rowC = topicWords.filter((word) => word.cellId.charAt(0) === 'C');
   const rowD = topicWords.filter((word) => word.cellId.charAt(0) === 'D');
   const rows = [rowA, rowB, rowC, rowD];

   function setColor(word: string): string {
      if (word === currentWord && !isUserRat) {
         return Color.darkThm.error;
      } else {
         return Color.setRgbOpacity(Color.darkThm.txt, 0.7);
      }
   }

   return (
      <FlexColumnWrapper style={{ height: '90%', margin: '1em' }}>
         <BoardContainer>
            {rows.map((row, index) => (
               <BoardRow key={index}>
                  {row.map((item, index) => (
                     <BoardCell key={index}>
                        <CellUID>
                           <LogoText size="0.8em" color={setColor(item.word)}>
                              {item.cellId}
                           </LogoText>
                        </CellUID>
                        <CellValue>
                           <LogoText size="0.8em" color={setColor(item.word)}>
                              {item.word}
                           </LogoText>
                        </CellValue>
                     </BoardCell>
                  ))}
               </BoardRow>
            ))}
         </BoardContainer>
      </FlexColumnWrapper>
   );
}
