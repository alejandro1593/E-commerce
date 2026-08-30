import { useAuthStore } from '../store/authStore';

export async function downloadCsv(type: 'orders' | 'products' | 'users') {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`/api/v1/admin/export/${type}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error al exportar ${type}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
