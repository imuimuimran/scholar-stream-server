import admin from "firebase-admin";

/* DECODE BASE64 FIREBASE KEY */
const decoded = Buffer.from(
  process.env.FB_SERVICE_KEY,
  "base64"
).toString("utf8");

/* PARSE JSON */
const serviceAccount = JSON.parse(decoded);

/* PREVENT RE-INITIALIZATION */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;