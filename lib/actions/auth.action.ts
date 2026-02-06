'use server';

import { db, auth } from '@/firebase/admin';
import { cookies } from 'next/headers';

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// sign-up the user
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in.',
      };
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Account created successfully. Please sign in.',
    };
  } catch (error: unknown) {
    console.error('Error while creating the user:', error);

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;

      if (code === 'auth/invalid-id-token') {
        return {
          success: false,
          message: 'Invalid session token. Please sign up again.',
        };
      }
    }

    return {
      success: false,
      message: 'Failed to create account. Please try again.',
    };
  }
}

// sign-in the user
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const decoded = await auth.verifyIdToken(idToken);
    const userRecord = await auth.getUser(decoded.uid);

    if (!userRecord || userRecord.email !== email) {
      return {
        success: false,
        message: 'User not found. Please create an account.',
      };
    }

    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return {
        success: false,
        message: 'User not found in database. Please sign up.',
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: 'Signed in successfully.',
    };
  } catch (error: unknown) {
    console.error('Error signing the user:', error);

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;

      if (code === 'auth/invalid-id-token') {
        return {
          success: false,
          message: 'Invalid session token. Please sign in again.',
        };
      }
    }

    return {
      success: false,
      message: 'Failed to sign in to account. Please try again.',
    };
  }
}

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  cookieStore.set('session', sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection('users')
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
