import { DocumentIcon, ClockIcon, XCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function DocumentoStatus({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-orange-500 text-white': status === 'presented',
          'bg-yellow-500 text-white': status === 'toPresent',
          'bg-red-500 text-white': status === 'finalized',
          'bg-green-500 text-white': status === 'approved',
        },
      )}
    >
      {status === 'approved' && (
        <>
          Published
          <DocumentIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'toPresent' && (
        <>
          Draft
          <ClockIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'finalized' && (
        <>
          Archived
          <XCircleIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'presented' && (
        <>
          Approved
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      )}
    </span>
  );
}