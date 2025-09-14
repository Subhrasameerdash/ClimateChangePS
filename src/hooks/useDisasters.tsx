
import { useState, useEffect } from 'react';
import { DisasterEvent, Coordinates, SeverityLevel } from '@/types';
import { toast } from 'sonner';

// Enhanced mock data for worldwide disasters
const mockEarthquakes: DisasterEvent[] = [
  // North America
  {
    id: 'eq-1',
    title: 'M 6.2 - 20km SW of Los Angeles, CA',
    type: 'earthquake',
    severity: 'critical',
    coordinates: { latitude: 34.052235, longitude: -118.243683 },
    timestamp: Date.now() - 3600000,
    description: 'Strong earthquake reported near Los Angeles. Multiple buildings affected.',
    source: 'USGS',
    url: 'https://earthquake.usgs.gov',
    magnitude: 6.2
  },
  {
    id: 'eq-2',
    title: 'M 4.7 - 15km E of San Francisco, CA',
    type: 'earthquake',
    severity: 'high',
    coordinates: { latitude: 37.773972, longitude: -122.431297 },
    timestamp: Date.now() - 7200000,
    description: 'Moderate earthquake reported in San Francisco Bay Area.',
    source: 'USGS',
    url: 'https://earthquake.usgs.gov',
    magnitude: 4.7
  },
  // South America
  {
    id: 'eq-4',
    title: 'M 5.8 - 30km SE of Santiago, Chile',
    type: 'earthquake',
    severity: 'high',
    coordinates: { latitude: -33.559987, longitude: -70.638504 },
    timestamp: Date.now() - 43200000,
    description: 'Strong earthquake felt throughout central Chile.',
    source: 'USGS',
    url: 'https://earthquake.usgs.gov',
    magnitude: 5.8
  },
  // Europe
  {
    id: 'eq-5',
    title: 'M 4.2 - 25km S of Rome, Italy',
    type: 'earthquake',
    severity: 'moderate',
    coordinates: { latitude: 41.872389, longitude: 12.567380 },
    timestamp: Date.now() - 172800000,
    description: 'Moderate earthquake reported south of Rome. No major damage reported.',
    source: 'EMSC',
    url: 'https://www.emsc-csem.org',
    magnitude: 4.2
  },
  // Asia
  {
    id: 'eq-6',
    title: 'M 7.1 - 80km E of Tokyo, Japan',
    type: 'earthquake',
    severity: 'critical',
    coordinates: { latitude: 35.689487, longitude: 139.691711 },
    timestamp: Date.now() - 86400000,
    description: 'Major earthquake off the coast of Japan. Tsunami warnings issued.',
    source: 'JMA',
    url: 'https://www.jma.go.jp/en/',
    magnitude: 7.1
  },
  {
    id: 'eq-7',
    title: 'M 6.5 - 120km N of Jakarta, Indonesia',
    type: 'earthquake',
    severity: 'critical',
    coordinates: { latitude: -6.121435, longitude: 106.774124 },
    timestamp: Date.now() - 129600000,
    description: 'Strong earthquake felt across Java island. Several buildings damaged.',
    source: 'USGS',
    url: 'https://earthquake.usgs.gov',
    magnitude: 6.5
  }
];

const mockFloods: DisasterEvent[] = [
  // North America
  {
    id: 'fl-1',
    title: 'Major Flooding - Miami, FL',
    type: 'flood',
    severity: 'critical',
    coordinates: { latitude: 25.761681, longitude: -80.191788 },
    timestamp: Date.now() - 86400000,
    description: 'Severe flooding reported across Miami-Dade County. Evacuations in progress.',
    source: 'NOAA',
    url: 'https://water.weather.gov',
    waterLevel: 4.2
  },
  {
    id: 'fl-2',
    title: 'Flash Floods - Phoenix, AZ',
    type: 'flood',
    severity: 'high',
    coordinates: { latitude: 33.448376, longitude: -112.074036 },
    timestamp: Date.now() - 172800000,
    description: 'Flash flood warnings in effect for Phoenix metropolitan area.',
    source: 'NWS',
    url: 'https://weather.gov',
    waterLevel: 2.8
  },
  // Europe
  {
    id: 'fl-3',
    title: 'River Flooding - Amsterdam, Netherlands',
    type: 'flood',
    severity: 'high',
    coordinates: { latitude: 52.377956, longitude: 4.897070 },
    timestamp: Date.now() - 129600000,
    description: 'Rising water levels in Amsterdam canals. Some areas evacuated.',
    source: 'KNMI',
    url: 'https://www.knmi.nl',
    waterLevel: 3.2
  },
  // Asia
  {
    id: 'fl-4',
    title: 'Monsoon Flooding - Mumbai, India',
    type: 'flood',
    severity: 'critical',
    coordinates: { latitude: 19.076090, longitude: 72.877426 },
    timestamp: Date.now() - 43200000,
    description: 'Heavy monsoon rains causing widespread flooding across Mumbai.',
    source: 'IMD',
    url: 'https://mausam.imd.gov.in',
    waterLevel: 4.7
  }
];

const mockHurricanes: DisasterEvent[] = [
  {
    id: 'hu-1',
    title: 'Hurricane Delta - Category 3',
    type: 'hurricane',
    severity: 'critical',
    coordinates: { latitude: 29.951065, longitude: -90.071533 },
    timestamp: Date.now() - 259200000,
    description: 'Hurricane Delta approaching Gulf Coast with winds of 115mph.',
    source: 'NHC',
    url: 'https://nhc.noaa.gov',
    windSpeed: 115
  },
  {
    id: 'hu-2',
    title: 'Typhoon Megi - Taiwan Strait',
    type: 'hurricane',
    severity: 'high',
    coordinates: { latitude: 23.697809, longitude: 120.960515 },
    timestamp: Date.now() - 345600000,
    description: 'Typhoon Megi approaching Taiwan with sustained winds of 100mph.',
    source: 'JMA',
    url: 'https://www.jma.go.jp',
    windSpeed: 100
  },
  {
    id: 'hu-3',
    title: 'Cyclone Yasi - Queensland, Australia',
    type: 'hurricane',
    severity: 'critical',
    coordinates: { latitude: -16.920334, longitude: 145.770859 },
    timestamp: Date.now() - 172800000,
    description: 'Severe tropical cyclone approaching the Queensland coast.',
    source: 'BOM',
    url: 'http://www.bom.gov.au',
    windSpeed: 130
  }
];

const mockTornadoes: DisasterEvent[] = [
  {
    id: 'to-1',
    title: 'Tornado Warning - Oklahoma City',
    type: 'tornado',
    severity: 'high',
    coordinates: { latitude: 35.4675, longitude: -97.5161 },
    timestamp: Date.now() - 43200000,
    description: 'Multiple tornadoes reported in Oklahoma City area. Take shelter immediately.',
    source: 'NWS',
    url: 'https://weather.gov',
    windSpeed: 85
  },
  {
    id: 'to-2',
    title: 'Tornado Outbreak - Kansas',
    type: 'tornado',
    severity: 'critical',
    coordinates: { latitude: 39.011902, longitude: -98.4842465 },
    timestamp: Date.now() - 21600000,
    description: 'Large tornado outbreak across central Kansas. Multiple tornadoes confirmed.',
    source: 'NWS',
    url: 'https://weather.gov',
    windSpeed: 120
  }
];

const mockWildfires: DisasterEvent[] = [
  {
    id: 'wf-1',
    title: 'Wildfire - Northern California',
    type: 'wildfire',
    severity: 'critical',
    coordinates: { latitude: 40.798947, longitude: -122.004301 },
    timestamp: Date.now() - 129600000,
    description: 'Large wildfire spreading rapidly. Evacuations ordered for several communities.',
    source: 'CalFire',
    url: 'https://www.fire.ca.gov',
    area: 25000
  },
  {
    id: 'wf-2',
    title: 'Bushfire - New South Wales, Australia',
    type: 'wildfire',
    severity: 'high',
    coordinates: { latitude: -33.865143, longitude: 151.209900 },
    timestamp: Date.now() - 345600000,
    description: 'Bushfire approaching suburban areas west of Sydney.',
    source: 'NSW RFS',
    url: 'https://www.rfs.nsw.gov.au',
    area: 12000
  },
  {
    id: 'wf-3',
    title: 'Forest Fire - Southern France',
    type: 'wildfire',
    severity: 'moderate',
    coordinates: { latitude: 43.296482, longitude: 5.369779 },
    timestamp: Date.now() - 172800000,
    description: 'Forest fire in the hills north of Marseille. Fire crews responding.',
    source: 'Météo-France',
    url: 'http://www.meteofrance.com',
    area: 5000
  }
];

export const useDisasters = (userLocation?: Coordinates | null) => {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisasterData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would fetch from actual APIs
      // For now, we use our enhanced mock data from around the world
      const mockData = [...mockEarthquakes, ...mockFloods, ...mockHurricanes, ...mockTornadoes, ...mockWildfires];
      
      // Sort by timestamp (newest first)
      const sortedData = mockData.sort((a, b) => b.timestamp - a.timestamp);
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDisasters(sortedData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch disaster data');
      setLoading(false);
      toast.error('Failed to fetch disaster data. Please try again later.');
      console.error('Error fetching disaster data:', err);
    }
  };

  // Classification function for disasters
  const classifyDisaster = (type: string, data: any): SeverityLevel => {
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
    if (type === 'wildfire') {
      const area = data.area;
      return area > 10000 ? 'critical' : area > 5000 ? 'high' : 'moderate';
    }
    return 'moderate';
  };

  // Fetch data on mount and set up polling
  useEffect(() => {
    fetchDisasterData();
    
    // In a real app, we would set up a polling mechanism or WebSocket
    const interval = setInterval(() => {
      fetchDisasterData();
    }, 300000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return {
    disasters,
    loading,
    error,
    fetchDisasterData,
    classifyDisaster
  };
};
