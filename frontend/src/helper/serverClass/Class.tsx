export default class ServerClass {
   public static Endpoints = {
      local: {
         base: 'http://localhost:3000',
         topics: 'http://localhost:3000/api/topics',
      },
      prod: {
         // TODO: Update these once server is deployed
         base: '',
         topics: '',
      },
   };
}
