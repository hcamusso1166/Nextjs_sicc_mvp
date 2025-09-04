'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
const FLAG = 'refresh-on-mount';
export default function RefreshOnMount() {
  const router = useRouter();
  const called = useRef(false);
  useEffect(() => {
    if (called.current || sessionStorage.getItem(FLAG)) return;

    called.current = true;
    sessionStorage.setItem(FLAG, '1');
    router.refresh();

    setTimeout(() => sessionStorage.removeItem(FLAG), 100);
  }, [router]);
  console.log('RefreshOnMount rendered');

  return null;
}