// app/profile/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in'); // Or wherever your sign-in route is
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Profile</h1>
      <p>Hello, {user.firstName || 'User'}!</p>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
    </main>
  );
}
