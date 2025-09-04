'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function RefreshOnMount() {
  const router = useRouter();
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    router.refresh();
  }, [router]);
  console.log('RefreshOnMount rendered');
  return null;
}