// components/SignIn.js
"use client"
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
}
