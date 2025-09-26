'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PollList from '@/components/PollList';

const Page = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   router.push('/admin/dashboard');
  // }, []);

  return <div><PollList /></div>;
};

export default Page;
