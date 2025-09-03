import { clsx } from 'clsx';
import RefreshLink from '@/app/ui/refresh-link';
import { lusitana } from '@/app/ui/fonts';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, 'flex text-xl md:text-2xl')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(breadcrumb.active ? 'text-gray-900' : 'text-gray-500')}
          >
            <RefreshLink href={breadcrumb.href}>{breadcrumb.label}</RefreshLink>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}