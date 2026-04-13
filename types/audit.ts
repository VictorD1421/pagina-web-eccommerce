// src/types/audit.ts

export interface AuditLog {
  id: string;
  table_name: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  record_id: string;
  old_data: any; // O Record<string, any> si prefieres más tipado
  new_data: any;
  changed_by: string;
  created_at: string;
  // Este campo viene del JOIN con la tabla de perfiles
  profiles?: {
    email: string;
  };
}