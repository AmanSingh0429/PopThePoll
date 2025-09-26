// app/admin/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, []);

  return <div className='flex justify-center items-center h-screen'>
    <Loader2Icon className='animate-spin' />
  </div>;
};

export default Page;
