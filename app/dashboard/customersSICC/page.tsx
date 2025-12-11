import CustomersSICCReactPage from '@/app/dashboard/customersSICC/react-page';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function Page() {
  return <CustomersSICCReactPage />;
}