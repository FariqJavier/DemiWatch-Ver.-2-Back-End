const fcmJson = process.env.SECRET_JSON;
if (!fcmJson) {
  throw new Error("SECRET_JSON is not defined in the environment variables");
}
const serviceAccount = JSON.parse(fcmJson);

// const serviceAccount = require('../file/my-project-1-27717-1034408269f9.json')

export default serviceAccount;