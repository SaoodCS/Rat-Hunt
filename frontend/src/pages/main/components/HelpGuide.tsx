import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { ListItem, OrderedList } from '../../../global/components/lib/newList/Style';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../../global/css/utils/colors';

const helpContent = [
   {
      listItem: 'Aim of the Game',
      subItems: [
         'To catch the RAT without giving away the secret word.',
         'If you are the RAT then your mission is to avoid detection and work out the secret word',
      ],
   },
   {
      listItem: 'Word Selection',
      subItems: [
         'All players receive the same secret word from the grid, except for the RAT.',
         'The RAT does not receive the word.',
      ],
   },
   {
      listItem: 'Clues',
      content: [
         'All players take it in turn to provide a clue related to the secret word.',
         'Clues should convince others that the player knows the secret word without revealing it to the RAT.',
         'The RAT also gives a clue based on their guess of the secret word.',
      ],
   },
   {
      listItem: 'Voting',
      content: [
         'After all players give their clues, everyone (including the RAT) take turns voting for who they think the RAT is.',
         'The RAT also guesses what was the secret word all other players received.',
         'If the RAT recieves the most votes, they get caught. If there is a tie, the RAT escapes.',
      ],
   },
   {
      listItem: 'Scoring',
      content: [
         'If the RAT correctly guesses the secret word, they earn 1 point.',
         'If the RAT escapes, the RAT recieves 1 point.',
         'if no one suspects the RAT, the RAT earns 1 point.',
         'If the RAT is caught, all players (except the RAT) earn 1 point.',
         "If a player that isn't the RAT correctly votes for the RAT, they earn 1 point.",
         'if the RAT does not guess the secret word, all players (except the RAT) earn 1 point.',
      ],
   },
];

export default function HelpGuide(): JSX.Element {
   return (
      <>
         <FlexColumnWrapper padding="1em 1em 1em 2em">
            <OrderedList
               bulletType="decimal"
               padding="0"
               margin="0"
               bulletColor={Color.darkThm.accent}
               bulletBold
            >
               {helpContent.map((content, index) => (
                  <ListItem key={index}>
                     <TextColourizer color={Color.darkThm.accent} bold>
                        {content.listItem}:
                     </TextColourizer>
                     <OrderedList bulletType="disc" padding="0.5em 0em 0.5em 1em">
                        {content.subItems?.map((subItem, index) => (
                           <ListItem key={index}>{subItem}</ListItem>
                        ))}
                        {content.content?.map((subItem, index) => (
                           <ListItem key={index}>{subItem}</ListItem>
                        ))}
                     </OrderedList>
                  </ListItem>
               ))}
            </OrderedList>
         </FlexColumnWrapper>
      </>
   );
}
