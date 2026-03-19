export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  matric_number?: string;
  password?: string;
  role: 'student' | 'power_admin' | 'super_admin';
  campus_zone_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CampusZone {
  id: number;
  name: string;
  description: string;
  fuel_level?: number; // 0-100 percentage
  is_active: boolean;
  created_at: Date;
}

export interface PowerStatus {
  id: number;
  campus_zone_id: number;
  power_source: 'grid' | 'generator' | 'off';
  status: string;
  changed_by: number;
  notes?: string;
  timestamp: Date;
}

export interface PowerStatusWithZone extends PowerStatus {
  campus_zone_name?: string;
  changed_by_name?: string;
}

export interface GeneratorSchedule {
  id: number;
  campus_zone_id: number;
  start_time: string;
  end_time: string;
  days_of_week: number[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  old_value?: any;
  new_value?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface PredictionResult {
  id: number;
  campus_zone_id: number;
  predicted_source: 'grid' | 'generator' | 'off';
  confidence_score?: number;
  prediction_for: Date;
  model_version?: string;
  created_at: Date;
}

export interface PushToken {
  id: number;
  user_id: number;
  token: string;
  platform: 'android' | 'ios' | 'web';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
