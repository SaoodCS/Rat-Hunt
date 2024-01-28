export class DummyData {
   static endpoints = {
      GET: {
         large: 'https://www.reddit.com/r/Wallstreetbets/top.json?limit=50&t=year',
         small: 'https://jsonplaceholder.typicode.com/todos/1',
         dynamicRes: 'https://api.parser.name/?api_key=YOUR_KEY&endpoint=generate&country_code=DE',
      },
      POST: {
         url: 'https://jsonplaceholder.typicode.com/posts',
         body: {
            title: 'foo',
            body: 'bar',
            userId: 1,
         },
      },
   };
   static loremIpsum = 'lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(100);
}
