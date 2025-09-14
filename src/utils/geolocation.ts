
import { Coordinates } from '@/types';

/**
 * Request user's geolocation
 * @returns Promise with coordinates
 */
export const requestGeolocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let message = 'Unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permission denied for geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            message = 'Request for user location timed out';
            break;
        }
        
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 First latitude
 * @param lon1 First longitude
 * @param lat2 Second latitude
 * @param lon2 Second longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

/**
 * Convert degrees to radians
 * @param value Degrees
 * @returns Radians
 */
const toRad = (value: number): number => (value * Math.PI) / 180;

/**
 * Check if coordinates are within a specified radius
 * @param center Center coordinates
 * @param point Point to check
 * @param radius Radius in kilometers
 * @returns Boolean indicating if point is within radius
 */
export const isWithinRadius = (
  center: Coordinates,
  point: Coordinates,
  radius: number
): boolean => {
  const distance = calculateDistance(
    center.latitude,
    center.longitude,
    point.latitude,
    point.longitude
  );
  return distance <= radius;
};

/**
 * Get a readable address from coordinates using reverse geocoding
 * @param coordinates The coordinates to geocode
 * @returns Promise with address string
 */
export const getAddressFromCoordinates = async (
  coordinates: Coordinates
): Promise<string> => {
  try {
    // In a real app, this would call a geocoding API like Google Maps Geocoding API
    console.log(`Getting address for coordinates: ${coordinates.latitude}, ${coordinates.longitude}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return "123 Example St, Los Angeles, CA 90012";
  } catch (error) {
    console.error('Geocoding error:', error);
    return "Unknown location";
  }
};
