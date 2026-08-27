import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '📊' },
  { to: '/admin/productos', label: 'Productos', end: false, icon: '🛍️' },
  { to: '/admin/ordenes', label: 'Órdenes', end: false, icon: '📦' },
  { to: '/admin/usuarios', label: 'Usuarios', end: false, icon: '👥' },
  { to: '/admin/cupones', label: 'Cupones', end: false, icon: '🎟️' },
];

export function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />

      <div className="container relative z-10 py-8">
        <div className="flex gap-8">
          <aside className="hidden w-60 md:block shrink-0">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-cream-300/50 shadow-card p-4 sticky top-28">
              <div className="flex items-center gap-3 px-2 py-3 border-b border-cream-300/50 mb-3">
                <div className="w-9 h-9 bg-gradient-neon rounded-lg flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <p className="font-bold text-dark-900 text-sm leading-tight">Panel Admin</p>
                  <p className="text-dark-900/50 text-xs">{user.name}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                        isActive
                          ? 'bg-gradient-neon text-white shadow-neon-cyan'
                          : 'text-dark-900/70 hover:bg-cream-200'
                      )
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <nav className="flex md:hidden gap-2 overflow-x-auto pb-3 -mx-1 px-1 mb-6">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300',
                      isActive ? 'bg-gradient-neon text-white shadow-neon-cyan' : 'bg-white/70 text-dark-900/70'
                    )
                  }
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
