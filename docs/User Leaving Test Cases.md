# USER LEAVING ROOM TEST CASES

1. There is 1 user in the room and then they unintentionally disconnect:

   - [ ] User's userStatus should be set to "disconnected" in firestore straight away
   - [ ] User's userStatus should be set to "disconnected" in realtime database straight away
   - [ ] Room in realtime database should be deleted after 5 minutes
   - [ ] Room in firestore should be deleted after 5 minutes
   - [ ] Cloud function should have 2 requests
   <!-- WORKING (15/02/24) -->

2. There is 1 user in the room and they deliberately leave:

   - [ ] User should be navigated to play page
   - [ ] Room in reatime database should be deleted straight away
   - [ ] Room in firestore should be deleted straight away
   - [ ] Cloud function should have 1 request that doesn't change firestore or realtime db
   <!-- WORKING (15/02/24)  -->

3. There are 2 users in the room and one unintentionally disconnects:

   - [ ] User's userStatus should be set to "disconnected" in firestore straight away
   - [ ] User's userStatus should be set to "disconnected" in realtime database straight away
   - [ ] User in realtime database should be deleted after 5 minutes (but not room)
   - [ ] User in firestore should be deleted afer 5 minutes (but not room)
   - [ ] Cloud function should have 2 requests
   <!-- WORKING (15/02/24) -->

4. There are 2 users in a room and one deliberately leaves:
   - [ ] User should be navigated to play page
   - [ ] User in realtime database shoudl be deleted straight away (but not room)
   - [ ] User in firestore should be deleted straight away (but not room)
   - [ ] Cloud function should have 1 request that doesn't change firestore or realtime db
   <!-- WORKING (15/02/24) -->
