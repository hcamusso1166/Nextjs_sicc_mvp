'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useCallback } from 'react';

export default function RefreshLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push(href);
      startTransition(() => {
        router.refresh();
      });
    },
    [router, href],
  );

  return (
    <Link prefetch={false} href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
