// Type definitions for fire API responses
export interface FireData {
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: number | string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
