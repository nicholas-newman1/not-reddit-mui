const cors = require('cors');
const express = require('express');
const firebase = require('firebase-admin');
const admin = firebase.initializeApp();
const functions = require('firebase-functions');
const app = express();
const db = admin.firestore();
const categories = db.collection('categories');

app.use(
  cors({
    origin: true, // allows all cross origin xhr requests
  })
);

// verify firebase id token to secure the function
app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'MISSING_AUTHORIZATION_HEADER' });
  }

  let jwt = req.headers.authorization.trim();
  return admin
    .auth()
    .verifyIdToken(jwt)
    .then((claims) => {
      if (!claims.email_verified) {
        return Promise.reject({ code: 400, message: 'EMAIL_NOT_VERIFIED' });
      }

      req.user = claims; // gives us a user object to use below
      next();
    })
    .catch((err) => {
      return res.status(err.code || 400).json({
        message: err.message || 'INVALID_JWT',
      });
    });
});

// enforce uniqueness
app.post('/:categoryName', (req, res) => {
  // ensure user supplied a username to attempt on
  if (req.params.categoryName.length <= 2) {
    return res.status(400).json({
      status: 400,
      message: 'CATEGORY_TOO_SHORT',
    });
  }

  let categoryName = req.params.categoryName.trim().toLowerCase();
  let cnameRef = categories.doc(categoryName);

  db.runTransaction((tx) => {
    return (
      tx
        .get(cnameRef)
        .then((cnameDoc) => {
          // check for uniqueness
          if (cnameDoc.exists) {
            return Promise.reject({ code: 400, message: 'CATEGORY_EXISTS' });
          }

          return Promise.resolve();
        })

        // create the category and assign the ownerId
        .then(() => tx.set(cnameRef, { ownerId: req.user.uid }))
    );
  })
    .then(() => {
      res.json({
        categoryName, // return the formatted category
        message: 'SUCCESS',
      });
    })
    .catch((err) => {
      return res.status(err.code || 500).json(err);
    });
});

exports.username = functions.https.onRequest(app);
