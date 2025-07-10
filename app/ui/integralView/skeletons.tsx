const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function SiteSkeleton() {
  return <div className={`${shimmer} relative mb-2 h-6 w-32 rounded bg-gray-100 overflow-hidden`} />;
}

export function RequerimientoSkeleton() {
  return <div className={`${shimmer} relative ml-4 mb-2 h-5 w-48 rounded bg-gray-100 overflow-hidden`} />;
}

export function ProveedorSkeleton() {
  return <div className={`${shimmer} relative ml-8 mb-2 h-5 w-48 rounded bg-gray-100 overflow-hidden`} />;
}

export function PersonaSkeleton() {
  return <div className={`${shimmer} relative ml-12 mb-1 h-4 w-40 rounded bg-gray-100 overflow-hidden`} />;
}

export function VehiculoSkeleton() {
  return <div className={`${shimmer} relative ml-12 mb-1 h-4 w-40 rounded bg-gray-100 overflow-hidden`} />;
}