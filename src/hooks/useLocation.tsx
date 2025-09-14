
import { useState, useEffect } from 'react';
import { Coordinates } from '@/types';
import { toast } from 'sonner';

export const useLocation = (options?: PositionOptions) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to get current position
  const getCurrentPosition = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        toast.error('Could not get your location. Please enable location services.');
      },
      options || { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  };

  // Function to set a manual location
  const setManualLocation = (coordinates: Coordinates) => {
    setLocation(coordinates);
    setError(null);
  };

  // Get location on mount
  useEffect(() => {
    getCurrentPosition();
  }, []);

  return { location, error, loading, getCurrentPosition, setManualLocation };
};
