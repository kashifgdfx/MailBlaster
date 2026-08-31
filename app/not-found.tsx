import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-full bg-slate-900 border border-slate-800">
            <AlertTriangle className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <h1 className="text-8xl font-bold text-white mb-4">
          404
        </h1>

        <h2 className="text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-slate-400 text-lg mb-8">
          The page you're looking for doesn't exist or
          may have been moved.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Go Home
          </Link>

          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-900 text-white font-medium transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}