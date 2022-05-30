const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://sprint-1bda4.firebaseio.com/",
});

exports.join = functions.https.onRequest((request, response) => {
  // Enable CORS using the `cors` express middleware.
  cors(request, response, () => {
    const query = request.query;
    const link = query.link;
    const database = admin.database();
    let ref = database.ref(`links/${link}`);
    ref
      .once("value")
      .then((snapshot) => {
        const joinEntity = snapshot.val();
        if (joinEntity === null) {
          response.send({ error: "link not exist" });
          return;
        }
        const sprintId = joinEntity.sprintId;
        const userUid = query.userUid;
        ref = database.ref(`sprints/${sprintId}`);
        ref.once("value").then((snapshot) => {
          const sprintEntity = snapshot.val();
          if (sprintEntity === null) {
            response.send({ error: "sprint not exist" });
            return;
          }
          ref = database.ref(`users/${userUid}`);
          ref
            .once("value")
            .then((snapshot) => {
              const userEntity = snapshot.val();
              if (userEntity === null) {
                response.send({ error: "user not exist" });
                return;
              }
              ref = database.ref(`sprints/${sprintId}/users/${userUid}`);
              ref
                .set({
                  moderator: false,
                  email: userEntity.email,
                  uid: userUid,
                  username: userEntity.username,
                })
                .then(() => {
                  ref = database.ref(`users/${userUid}/sprints/${sprintId}`);
                  ref
                    .set({
                      moderator: false,
                      id: sprintId,
                      createAt: sprintEntity.createDateString,
                    })
                    .then(() => response.send({ sprintId }))
                    .catch(() => response.send({ error: "something wrong" }));
                })
                .catch(() => response.send({ error: "something wrong" }));
            })
            .catch(() => response.send({ error: "something wrong" }));
        });
      })
      .catch(() => response.send({ error: "something wrong" }));
  });
});

exports.sendMail = functions.https.onRequest((request, response) => {
  // Enable CORS using the `cors` express middleware.
  cors(request, response, () => {
    const query = request.query;
    const email = query.email;
    const subject = query.subject;
    const information = query.information;

    admin
      .firestore()
      .collection("mail")
      .add({
        to: "jazoulay@joazco.com",
        message: {
          subject: "From joazco.com",
          text: `
email: ${email}
raison: ${subject}
information: ${information}
          `,
        },
      })
      .then(() => response.send({ finish: "ok" }))
      .catch(() => response.send({ finish: "ko" }));
  });
});
