import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../../global/css/colors';
import { ListItem, OrderedList } from '../../../global/components/lib/newList/Style';

export default function HelpGuide(): JSX.Element {
   const helpContent = [
      {
         listItem: 'Word Selection',
         subItems: [
            'All players receive the same word from the grid (e.g., A2), except for the rat.',
            'The rat does not receive the word.',
         ],
      },
      {
         listItem: 'Clues',
         content: [
            'Each player provides a clue related to the word.',
            'Clues should convince others that the player knows the word without revealing it to the rat.',
            'The rat also gives a clue based on their guess of the word.',
         ],
      },
      {
         listItem: 'Voting',
         content: [
            'After all players give their clues, everyone (including the rat) votes for who they think the rat is.',
            'The rat also guesses which word all other players received.',
         ],
      },
      {
         listItem: 'Scoring',
         content: [
            'If the player with the highest votes is the rat, all players (except the rat) earn 1 point.',
            'If the player with the highest votes is not the rat, the rat earns 1 point.',
            'If the rat correctly guesses the word, they earn 1 point.',
         ],
      },
   ];

   return (
      <>
         <FlexColumnWrapper padding="0em 0em 0em 1em">
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
