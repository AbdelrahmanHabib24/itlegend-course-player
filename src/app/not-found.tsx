import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-accent flex items-center justify-center text-2xl font-black mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The requested course could not be located. Please check the catalog to find another course.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-accent hover:bg-[#1A9B73] text-white shadow-xs transition-colors"
      >
        Back to Courses Catalog
      </Link>
    </div>
  );
}
