
import { DisasterEvent, SeverityLevel } from '@/types';

// Mock API endpoints and utility functions
// In a real app, these would be actual API calls

/**
 * Fetch earthquake data from USGS API
 * @param params Query parameters
 * @returns Promise with earthquake data
 */
export const fetchUSGSEarthquakes = async (params: {
  minMagnitude?: number;
  startTime?: string;
  endTime?: string;
  limit?: number;
}): Promise<DisasterEvent[]> => {
  // In a real app, this would fetch from the USGS API
  // https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&...
  
  console.log('Fetching earthquake data with params:', params);
  
  // Return mock data for now
  return [
    {
      id: 'eq-101',
      title: 'M 5.8 - 15km NE of Los Angeles, CA',
      type: 'earthquake',
      severity: 'high',
      coordinates: { latitude: 34.052235, longitude: -118.243683 },
      timestamp: Date.now() - 3600000,
      description: 'Moderate earthquake reported near Los Angeles. Some structural damage reported.',
      source: 'USGS',
      url: 'https://earthquake.usgs.gov',
      magnitude: 5.8
    }
  ];
};

/**
 * Fetch flood data from OpenWeatherMap API
 * @param params Query parameters
 * @returns Promise with flood data
 */
export const fetchFloodData = async (params: {
  lat: number;
  lon: number;
  radius?: number;
}): Promise<DisasterEvent[]> => {
  // In a real app, this would fetch from OpenWeatherMap or similar API
  
  console.log('Fetching flood data with params:', params);
  
  // Return mock data for now
  return [
    {
      id: 'fl-101',
      title: 'Flood Warning - Los Angeles River',
      type: 'flood',
      severity: 'moderate',
      coordinates: { latitude: params.lat + 0.05, longitude: params.lon - 0.05 },
      timestamp: Date.now() - 7200000,
      description: 'Moderate flooding reported along the Los Angeles River. Some low-lying areas affected.',
      source: 'NWS',
      url: 'https://water.weather.gov',
      waterLevel: 2.5
    }
  ];
};

/**
 * Classify a disaster based on its type and data
 * @param type The disaster type
 * @param data Disaster-specific data
 * @returns Severity level
 */
export const classifyDisaster = (type: string, data: any): SeverityLevel => {
  if (type === 'earthquake') {
    const mag = data.magnitude;
    return mag >= 6 ? 'critical' : mag >= 4.5 ? 'high' : 'moderate';
  }
  
  if (type === 'flood') {
    const waterLevel = data.waterLevel;
    return waterLevel > 3 ? 'critical' : waterLevel > 2 ? 'high' : 'moderate';
  }
  
  if (type === 'hurricane' || type === 'tornado') {
    const windSpeed = data.windSpeed;
    return windSpeed > 110 ? 'critical' : windSpeed > 74 ? 'high' : 'moderate';
  }
  
  return 'moderate';
};

/**
 * Report a new user-generated disaster incident
 * @param data The incident data
 * @returns Promise with the created incident
 */
export const reportIncident = async (data: {
  type: string;
  description: string;
  coordinates: { latitude: number; longitude: number };
  userId: string;
  images?: File[];
}) => {
  // In a real app, this would send data to your backend API
  console.log('Reporting incident:', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `report-${Date.now()}`,
    ...data,
    verified: false,
    timestamp: Date.now()
  };
};

/**
 * Get safety tips for a specific disaster type and language
 * @param disasterType The type of disaster
 * @param language Language code (en, es, etc)
 * @returns Promise with safety tips
 */
export const getSafetyTips = async (disasterType: string, language: string = 'en') => {
  // In a real app, this would fetch from your backend API
  console.log(`Fetching ${disasterType} safety tips in ${language}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data based on type
  return [
    {
      id: `${disasterType}-tip-1`,
      disasterType,
      title: `${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} Safety Tip 1`,
      content: `This is a safety tip for ${disasterType} disasters.`,
      language
    },
    {
      id: `${disasterType}-tip-2`,
      disasterType,
      title: `${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} Safety Tip 2`,
      content: `Another important safety measure for ${disasterType} disasters.`,
      language
    }
  ];
};

/**
 * Utility function to simulate API rate limiting
 * Max 5 requests per minute
 */
let requestCount = 0;
let resetTime = Date.now() + 60000;

export const checkRateLimit = (): { allowed: boolean; resetIn: number } => {
  const now = Date.now();
  
  // Reset counter if a minute has passed
  if (now > resetTime) {
    requestCount = 0;
    resetTime = now + 60000;
  }
  
  // Check if under rate limit
  if (requestCount < 5) {
    requestCount++;
    return { allowed: true, resetIn: resetTime - now };
  } else {
    return { allowed: false, resetIn: resetTime - now };
  }
};
