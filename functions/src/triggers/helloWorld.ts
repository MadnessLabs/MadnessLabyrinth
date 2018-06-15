import * as functions from "firebase-functions";
import * as cors from "cors";

export const listener = functions.https.onRequest((request, response) => {
  return cors({ origin: true })(request, response, async () => {
    response.json({ data: "wee" });
  });
});
