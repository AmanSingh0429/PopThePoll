'use client';

import PollList from '@/components/PollList';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const session = sessionStorage.getItem("auth")
    if (!session) {
      router.push("/login")
    }
  }, [])


  return <div><PollList /></div>;
};

export default Page;
