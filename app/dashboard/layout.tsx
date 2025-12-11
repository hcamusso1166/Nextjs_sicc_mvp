import SideNav from '@/app/ui/dashboard/sidenav';

// Opt out of Partial Prerendering for the dashboard to avoid serving
// any cached HTML or data after CRUD operations.
export const experimental_ppr = false;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}