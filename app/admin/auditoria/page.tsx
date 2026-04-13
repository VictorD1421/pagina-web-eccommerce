import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AuditLog } from '@/types/audit';
import { format } from 'date-fns';
import AuditDetails from '@/src/components/audit/AuditDetails';

export const revalidate = 0;

export default async function AuditoriaPage() {
  // 1. Esperamos a que las cookies se resuelvan (Requerido en Next.js 15)
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Ahora cookieStore es el objeto resuelto y tiene el método .get
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 2. Consulta con JOIN
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      profiles:changed_by (
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl shadow-sm">
          <h2 className="font-black mb-2 uppercase text-xs tracking-widest">Error de Sincronización</h2>
          <p className="text-sm opacity-90">{error.message}</p>
        </div>
      </div>
    );
  }

  const auditData = logs as AuditLog[];

  return (
    <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-[#3D1A14] tracking-tight uppercase">
          Auditoría de Sistema
        </h1>
        <p className="text-orange-600 font-bold flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
          Inversiones Durí C.A. • Registro de Trazabilidad
        </p>
      </header>

      <div className="bg-white border border-orange-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-orange-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/30 border-b border-orange-50">
                <th className="p-6 font-black text-[#3D1A14] text-xs uppercase tracking-widest">Fecha y Hora</th>
                <th className="p-6 font-black text-[#3D1A14] text-xs uppercase tracking-widest">Usuario</th>
                <th className="p-6 font-black text-[#3D1A14] text-xs uppercase tracking-widest">Acción</th>
                <th className="p-6 font-black text-[#3D1A14] text-xs uppercase tracking-widest">Módulo</th>
                <th className="p-6 font-black text-[#3D1A14] text-xs uppercase tracking-widest text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/50">
              {auditData && auditData.length > 0 ? (
                auditData.map((log) => (
                  <tr key={log.id} className="hover:bg-orange-50/20 transition-all duration-200">
                    <td className="p-6 text-sm text-gray-500 font-medium">
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#3D1A14]">
                          {log.profiles?.email || 'Sistema / Admin'}
                        </span>
                        {log.changed_by && (
                          <span className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]">
                            ID: {log.changed_by}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        log.action === 'INSERT' ? 'bg-green-50 text-green-700 border-green-100' :
                        log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {log.action === 'INSERT' ? 'Registro' : log.action === 'UPDATE' ? 'Edición' : 'Eliminación'}
                      </span>
                    </td>
                    <td className="p-6">
                      <code className="bg-gray-100 px-3 py-1 rounded-lg text-[11px] text-gray-700 font-mono font-bold border border-gray-200 uppercase">
                        {log.table_name}
                      </code>
                    </td>
                    <td className="p-6 text-right">
                      <AuditDetails 
                        oldData={log.old_data} 
                        newData={log.new_data} 
                        action={log.action} 
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 font-black">!</div>
                      <p className="text-gray-400 font-bold italic text-sm">No se encontraron registros de auditoría.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}