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

export async function createUserDocument(
  user: FirebaseUser, 
  customDisplayName?: string,
  isAdmin: boolean = false
) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const { setDoc, serverTimestamp } = await import('firebase/firestore');
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: customDisplayName || user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
  }
}

export async function getUserDisplayName(userId: string): Promise<string> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data()?.displayName || 'Anonymous';
    }
    return 'Anonymous';
  } catch (error) {
    console.error('Error getting user display name:', error);
    return 'Anonymous';
  }
}

export async function ensureUserDocument(user: FirebaseUser): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const { setDoc, serverTimestamp } = await import('firebase/firestore');
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || null,
        isAdmin: false,
        createdAt: serverTimestamp(),
      });
    } else if (!userDoc.data()?.displayName) {
      // Update if displayName is missing
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(userRef, {
        displayName: user.displayName || 'User',
      });
    }
  } catch (error) {
    console.error('Error ensuring user document:', error);
  }
}

