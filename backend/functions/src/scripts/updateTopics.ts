import * as admin from "firebase-admin";
import * as serviceAccount from "../../env/service-account-key.json";
import ITopic from "../topics/interface";
import { animals } from "../topics/animals/animals";
import { countries } from "../topics/countries/countries";
import { movies } from "../topics/movies/movies";
import { sports } from "../topics/sports/sports";
import { food } from "../topics/food/food";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const topics: ITopic[] = [animals, countries, movies, sports, food];

async function updateTopics() {
  const topicsRef = admin.firestore().collection("topics").doc("topics");
    await topicsRef.set({ topics });
}

updateTopics();
