import TopicClass from '../../../helper/topicsClass/TopicClass';

export default function StartedGame(): JSX.Element {
   const { data: allTopics } = TopicClass.getTopicsQuery();
   return (
      <div>
         <h1>Actual Gameplay Begins Here</h1>
      </div>
   );
}
