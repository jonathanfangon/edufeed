import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to the App</h1>

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl='/' />
        <p>
          Go to your <Link href='/profile'>Profile</Link>
        </p>
        <Link href='/feed' className='text-blue-600 underline'>
          Go to Video Feed
        </Link>
      </SignedIn>
    </main>
  );
}
