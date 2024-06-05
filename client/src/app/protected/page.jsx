// pages/protected.js
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/auth/signin')
      } else {
        setUser(session.user)
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>This is a protected page.</h1>
      {user && (
        <div>
          <p>Welcome, {user.name}!</p>
          <img src={user.image} alt="Profile Picture" />
        </div>
      )}
    </div>
  );
}
