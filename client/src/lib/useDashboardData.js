import { useCallback, useEffect, useState } from 'react';
import { apiGet } from './apiClient';

// Carga leads (y, para la dueña, el catálogo) distinguiendo "falló" de "no hay nada".
export default function useDashboardData({ conCatalogo }) {
  const [estado, setEstado] = useState({ cargando: true, error: false, leads: [], paquetes: [], sinLeer: 0 });

  const cargar = useCallback(async () => {
    setEstado((e) => ({ ...e, cargando: true, error: false }));
    try {
      const [leads, paquetes, sinLeer] = await Promise.all([
        apiGet('/admin/solicitudes'),
        conCatalogo ? apiGet('/admin/packages') : Promise.resolve({ data: [] }),
        apiGet('/admin/solicitudes/unread-count').catch(() => ({ count: 0 })),
      ]);
      setEstado({
        cargando: false,
        error: false,
        leads: leads.data || [],
        paquetes: paquetes.data || [],
        sinLeer: sinLeer.count ?? 0,
      });
    } catch {
      setEstado((e) => ({ ...e, cargando: false, error: true }));
    }
  }, [conCatalogo]);

  useEffect(() => { cargar(); }, [cargar]);

  return { ...estado, recargar: cargar };
}
