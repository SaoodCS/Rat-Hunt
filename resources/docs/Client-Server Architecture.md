## Client / Server Architecture

1. **The Client Side**

   - Deletes and adds users and rooms to RTDB
   - Changes the userStatus to 'connected' or 'disconnected' in RTDB

2. This then triggers the onDataChange cloud function on the server-side which is triggered every time the RTDB is updated.

3. **The Server Side**
   - Checks what changes were made in the RTDB. Was it of type:
     - Room created and user added?
     - User added?
     - User deleted?
     - Room deleted? (when the last user is deleted from RTDB, this also deletes the room from RTDB as it's the only reference to the room left)
     - Status change?

---

### Server-Side onDataChange cloud function Cases

1. If a new room is created in RTDB, it does nothing as the client-side will add the room to Firestore (with the host user, topic, and noOfRounds)
2. If a user is added to RTDB, it adds the user to the room in Firestore
3. If a user is deleted from a room in RTDB, it deletes the user from the room in Firestore
4. If a room is deleted from RTDB, it deletes the room from Firestore
5. If a user's status is changed to 'connected' in RTDB, it changes the user's status to 'connected' in Firestore
6. If a user's status is changed to 'disconnected' in RTDB, it changes the user's status to 'disconnected' in Firestore and then waits 5 minutes to see if the user reconnects:
   1. If the user does not reconnect within 5 minutes, it deletes the user from RTDB (should delete the room too if it's the last user in the room).
      - This then triggers a new instance of onDataChange cloud function which will check if the user / room is deleted in RTDB and then delete them from Firestore if so

#### Changes Requires:

[x] TODO: Double check whether a room is deleted from RTDB automatically when the last user is deleted from the room
[x] TODO: Get rid of any functions / calls on the client side that involve adding / deleting users to and from RTDB
[x] TODO: Get rid of any functions / calls on the client side that involve deleting rooms from firestore (need to keep the adding rooms on client-side in order for the topic and noOfRounds to be set - could set this to be done when pressing the play button in the waiting room instead...)
[x] TODO: Update the 'compare' function on the server-side to check if a room is deleted in RTDB (and make it return type 'roomDeleted')
[x] TODO: Update the 'compare' function on the server-side to check if a new room is created in RTDB (and make it return type 'roomAdded')
[x] TODO: Update the onDataChange cloud function to be aligned with the above cases

[ ] TODO: Potential further improvement - set the number of rounds and topics on the waiting room page so that when a new room is created by the host, the server-side can add the room and the host to Firestore instead of the client-side doing it (making the code more consistent since the client side is only responsible for mutating RTDB and updating firestore rather than creating and deleting data from firestore)
- [ ] Then update this documentation to reflect those changes...
