import GamePageLayout from '../../../temp/GamePageLayout';
import FirestoreDB from '../class/FirestoreDb';

export default function StartedGame(): JSX.Element {
   const { data: allTopics } = FirestoreDB.Topics.getTopicsQuery();
   return <GamePageLayout />;
}
