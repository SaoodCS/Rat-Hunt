import FirestoreDB from '../class/FirestoreDb';

export default function StartedGame(): JSX.Element {
   const { data: allTopics } = FirestoreDB.Topics.getTopicsQuery();
   return (
      <div>
         <h1>Actual Gameplay Begins Here</h1>
      </div>
   );
}
