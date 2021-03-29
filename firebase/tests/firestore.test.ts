import * as firebase from '@firebase/rules-unit-testing';

const PROJECT_ID = 'not-reddit-5a7e3';

it('should have read access to users collection', async () => {
  const db = firebase.initializeTestApp({ projectId: PROJECT_ID }).firestore();
  await firebase.assertSucceeds(db.collection('users').get());
});
