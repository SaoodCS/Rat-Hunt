import * as express from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const onDataChange = functions.database
  .ref("rooms")
  .onWrite(async (change, context) => {
    console.log("Data changed");

    return null;
  });
