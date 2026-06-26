import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🫤</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-800">Page not found</h1>
        <p className="text-sm text-neutral-500 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-[10px] hover:bg-primary-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
