/// <reference types="react-scripts" />

interface User {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  creationTime: string | undefined;
  lastSignInTime: string | undefined;
  phoneNumber: string | null;
  photoUrl: string | null;
  uid: string;
}
