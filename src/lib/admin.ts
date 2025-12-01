import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User as FirebaseUser } from 'firebase/auth';

export async function isUserAdmin(user: FirebaseUser | null): Promise<boolean> {
  if (!user) return false;

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data()?.isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function createUserDocument(user: FirebaseUser, isAdmin: boolean = false) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const { setDoc, serverTimestamp } = await import('firebase/firestore');
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
  }
}

