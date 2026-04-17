import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { clsx } from '../../utils/clsx';

export default function Layout({ children, title, subtitle, action }) {
  return (
    <div className="min-h-screen flex relative overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 40%, #eff6ff 70%, #f0fdf4 100%)',
    }}>
      {/* Ambient blobs — give the glass something to refract */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-teal-200/20 blur-3xl" />
      </div>

      {/* Sidebar: desktop only */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        {/* Page header */}
        {(title || action) && (
          <header className="sticky top-0 z-30 bg-white/50 backdrop-blur-md border-b border-white/60 px-4 lg:px-6 py-4">
            <div className="max-w-2xl mx-auto lg:mx-0 flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-lg font-bold text-navy-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-xs text-navy-400 mt-0.5">{subtitle}</p>
                )}
              </div>
              {action && <div>{action}</div>}
            </div>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-6 py-4 pb-24 lg:pb-6">
          <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-3xl">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav: mobile only */}
      <BottomNav />
    </div>
  );
}

// Lightweight auth layout — no nav
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 40%, #eff6ff 100%)',
    }}>
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-teal-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-300/25 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600/90 backdrop-blur-sm text-white font-bold text-2xl shadow-card-md border border-teal-500/40 mb-3">
            S
          </div>
          <h1 className="text-xl font-bold text-navy-900">SenteFlow</h1>
          <p className="text-navy-400 text-sm mt-1">Your smart money tracker</p>
        </div>
        {children}
      </div>
    </div>
  );
}
