import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
const admin = firebase.initializeApp();
const db = admin.firestore();

exports.createCategory = functions.https.onCall(
  async (category: string, context) => {
    if (typeof category !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'INVALID_DATA_TYPE'
      );
    }
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'NO_USER');
    }
    if (!context.auth.token.email_verified) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'EMAIL_NOT_VERIFIED'
      );
    }
    if (category.length < 3) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'CATEGORY_TOO_SHORT'
      );
    }
    if (!category.match(/^[a-z0-9]+$/i)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'CATEGORY_NOT_ALPHANUMERIC'
      );
    }

    const categoryRef = db.collection('categories').doc(category);
    const categorySnap = await categoryRef.get();

    if (categorySnap.exists) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'CATEGORY_EXISTS'
      );
    }

    categoryRef.set({
      ownerId: context.auth.uid,
      moderatorIds: [],
      subscriberIds: [],
    });
  }
);
