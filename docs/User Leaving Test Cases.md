# USER LEAVING ROOM TEST CASES

1. There is 1 user in the room and then they unintentionally disconnect:

   - [ ] Room in realtime database should be deleted after 5 minutes
   - [ ] Room in firestore should be deleted after 5 minutes
   - [ ] Cloud function should have 2 requests
   <!--  -->

2. There is 1 user in the room and they deliberately leave:

   - [ ] User should be navigated to play page
   - [ ] Room in reatime database should be deleted straight away
   - [ ] Room in firestore should be deleted straight away
   - [ ] Cloud function should have 1 request that doesn't change firestore or realtime db
   <!--  -->

3. There are 2 users in the room and one unintentionally disconnects:

   - [ ] User in realtime database should be deleted after 5 minutes
   - [ ] User in firestore should be deleted afer 5 minutes (but not room)
   - [ ] Cloud function should have 2 requests
   <!--  -->

4. There are 3 users in a room and one deliberately leaves:
   - [ ] User should be navigated to play page
   - [ ] User in realtime database shoudl be deleted straight away
   - [ ] User in firestore should be deleted straight away
   - [ ] Cloud function should have 1 request that doesn't change firestore or realtime db
   <!--  -->
