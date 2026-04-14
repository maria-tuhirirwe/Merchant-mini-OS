import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { clsx } from '../../utils/clsx';

export default function Layout({ children, title, subtitle, action }) {
  return (
    <div className="min-h-screen bg-navy-50 flex">
      {/* Sidebar: desktop only */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Page header */}
        {(title || action) && (
          <header className="sticky top-0 z-30 bg-navy-50/80 backdrop-blur-sm border-b border-navy-100 px-4 lg:px-6 py-4">
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
        <main className={clsx(
          'flex-1 px-4 lg:px-6 py-4 pb-24 lg:pb-6',
        )}>
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-navy-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold text-2xl shadow-card-md mb-3">
            M
          </div>
          <h1 className="text-xl font-bold text-navy-900">Merchant Mini-OS</h1>
          <p className="text-navy-400 text-sm mt-1">Your pocket financial tracker</p>
        </div>
        {children}
      </div>
    </div>
  );
}
