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

1. If a user is added and a new room is created in RTDB, it adds the room and user to Firestore
2. If a user is added to an existing room in RTDB, it adds the user to the room in Firestore
3. If a user is deleted from a room in RTDB, it deletes the user from the room in Firestore
4. If a room is deleted from RTDB, it deletes the room from Firestore
5. If a user's status is changed to 'connected' in RTDB, it changes the user's status to 'connected' in Firestore
6. If a user's status is changed to 'disconnected' in RTDB, it changes the user's status to 'disconnected' in Firestore and then waits 5 minutes to see if the user reconnects:
   1. If the user does not reconnect within 5 minutes, it deletes the user from RTDB (should delete the room too if it's the last user in the room).
      - This then triggers a new instance of onDataChange cloud function which will check if the user / room is deleted in RTDB and then delete them from Firestore if so

#### Changes Requires:

[ ] TODO: Double check whether a room is deleted from RTDB automatically when the last user is deleted from the room
[ ] TODO: Get rid of any functions / calls on the client side that involve adding / deleting users and rooms to and from firestore
[ ] TODO: Update the 'compare' function on the server-side to check if a room is created / deleted in RTDB (and make it return types roomAdded and roomDeleted)
[ ] TODO: Update the onDataChange cloud function to be aligned with the above cases
