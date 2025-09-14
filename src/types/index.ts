
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type DisasterType = 
  | 'earthquake' 
  | 'flood' 
  | 'hurricane' 
  | 'tornado' 
  | 'wildfire' 
  | 'tsunami' 
  | 'other';

export type SeverityLevel = 
  | 'critical' 
  | 'high' 
  | 'moderate' 
  | 'low';

export interface DisasterEvent {
  id: string;
  title: string;
  type: DisasterType;
  severity: SeverityLevel;
  coordinates: Coordinates;
  timestamp: number; // Unix timestamp
  description: string;
  source: string;
  url?: string; // External link
  magnitude?: number; // For earthquakes
  waterLevel?: number; // For floods
  windSpeed?: number; // For hurricanes
}

export interface UserReport {
  id: string;
  userId: string;
  type: DisasterType;
  coordinates: Coordinates;
  timestamp: number;
  description: string;
  images?: string[];
  verified: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  coordinates: Coordinates;
  address: string;
  capacity: number;
  occupancy: number;
  contact: string;
  amenities: string[];
  openingTime: string;
  closingTime: string;
  active: boolean;
}

export interface SafetyTip {
  id: string;
  disasterType: DisasterType;
  title: string;
  content: string;
  language: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  region?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  preferences: {
    notificationMethod: ('push' | 'sms' | 'email')[];
    notificationRadius: number; // in km
    language: string;
  };
}
