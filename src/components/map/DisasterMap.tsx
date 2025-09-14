
import React, { useState } from 'react';
import { DisasterEvent, Coordinates } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin, Target, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Create a custom default icon
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface DisasterMapProps {
  disasters: DisasterEvent[];
  userLocation: Coordinates | null;
  onSelectDisaster?: (disaster: DisasterEvent) => void;
  loading?: boolean;
}

// Component to recenter map when user location changes
const RecenterMap = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
};

const DisasterMap: React.FC<DisasterMapProps> = ({
  disasters,
  userLocation,
  onSelectDisaster,
  loading = false
}) => {
  const [focusedDisaster, setFocusedDisaster] = useState<DisasterEvent | null>(null);
  
  // Default map center (world view)
  const defaultCenter: [number, number] = [20, 0];
  const defaultZoom = 2;
  
  // Handle marker click
  const handleMarkerClick = (disaster: DisasterEvent) => {
    setFocusedDisaster(disaster);
    if (onSelectDisaster) {
      onSelectDisaster(disaster);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="w-full rounded-lg border overflow-hidden bg-card min-h-[400px] flex items-center justify-center">
        <div className="text-center p-6">
          <AlertTriangle className="animate-pulse w-12 h-12 mx-auto mb-4" />
          <p className="text-xl">Loading map data...</p>
        </div>
      </div>
    );
  }

  // Get marker color based on severity
  const getMarkerColorBySeverity = (severity: string): string => {
    switch (severity) {
      case 'critical': return "#FF0000"; // Red
      case 'high': return "#FF9900"; // Orange
      case 'moderate': return "#FFCC00"; // Yellow
      case 'low': return "#00CC00"; // Green
      default: return "#9E9E9E"; // Gray
    }
  };

  // Create a custom icon based on severity
  const createSeverityIcon = (severity: string) => {
    const color = getMarkerColorBySeverity(severity);
    return new Icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      className: `disaster-marker-${severity}`
    });
  };

  return (
    <div className="relative w-full rounded-lg border overflow-hidden">
      <style jsx global>{`
        .disaster-marker-critical .leaflet-marker-icon {
          filter: hue-rotate(-60deg); /* Red */
        }
        .disaster-marker-high .leaflet-marker-icon {
          filter: hue-rotate(30deg); /* Orange */
        }
        .disaster-marker-moderate .leaflet-marker-icon {
          filter: hue-rotate(60deg); /* Yellow */
        }
      `}</style>
      
      <MapContainer 
        center={userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter}
        zoom={userLocation ? 8 : defaultZoom}
        style={{ height: "400px", width: "100%" }}
        className="min-h-[400px] md:min-h-[600px] z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Recenter map when user location changes */}
        {userLocation && (
          <RecenterMap coords={[userLocation.latitude, userLocation.longitude]} />
        )}
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.latitude, userLocation.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-center">
                <h4 className="font-medium">Your Location</h4>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Disaster markers */}
        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={[disaster.coordinates.latitude, disaster.coordinates.longitude]}
            icon={createSeverityIcon(disaster.severity)}
            eventHandlers={{
              click: () => handleMarkerClick(disaster)
            }}
          >
            <Popup>
              <div>
                <h4 className="font-medium">{disaster.title}</h4>
                <p className="text-sm text-gray-600">{disaster.description}</p>
                {disaster.url && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(disaster.url, '_blank')}
                  >
                    Details
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Focused Disaster Info */}
      {focusedDisaster && (
        <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2 bg-card p-3 rounded-lg shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{focusedDisaster.title}</h4>
              <p className="text-sm text-muted-foreground">{focusedDisaster.description}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => focusedDisaster.url && window.open(focusedDisaster.url, '_blank')}
            >
              Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterMap;
