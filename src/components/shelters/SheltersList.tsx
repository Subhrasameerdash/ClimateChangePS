
import React, { useState, useEffect } from 'react';
import { Shelter, Coordinates } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Phone, MapPin, Users, Clock, Coffee } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock shelter data
const mockShelters: Shelter[] = [
  {
    id: 'shelter-1',
    name: 'City Community Center',
    coordinates: { latitude: 34.052235, longitude: -118.243683 },
    address: '123 Main St, Los Angeles, CA 90012',
    capacity: 200,
    occupancy: 45,
    contact: '213-555-1234',
    amenities: ['Food', 'Water', 'Medical', 'Wifi', 'Beds'],
    openingTime: '24/7',
    closingTime: '24/7',
    active: true
  },
  {
    id: 'shelter-2',
    name: 'Lincoln High School',
    coordinates: { latitude: 34.082235, longitude: -118.253683 },
    address: '456 Oak Ave, Los Angeles, CA 90042',
    capacity: 350,
    occupancy: 120,
    contact: '213-555-5678',
    amenities: ['Food', 'Water', 'Medical', 'Showers'],
    openingTime: '7:00 AM',
    closingTime: '10:00 PM',
    active: true
  },
  {
    id: 'shelter-3',
    name: 'Westside Church',
    coordinates: { latitude: 34.062235, longitude: -118.263683 },
    address: '789 Elm St, Los Angeles, CA 90025',
    capacity: 150,
    occupancy: 30,
    contact: '213-555-9101',
    amenities: ['Food', 'Water', 'Beds', 'Pet Friendly'],
    openingTime: '8:00 AM',
    closingTime: '9:00 PM',
    active: true
  },
  {
    id: 'shelter-4',
    name: 'East Valley Rec Center',
    coordinates: { latitude: 34.042235, longitude: -118.223683 },
    address: '321 Pine Rd, Los Angeles, CA 90032',
    capacity: 180,
    occupancy: 95,
    contact: '213-555-2345',
    amenities: ['Food', 'Water', 'Medical', 'Charging Stations'],
    openingTime: '24/7',
    closingTime: '24/7',
    active: true
  },
  {
    id: 'shelter-5',
    name: 'South Bay College',
    coordinates: { latitude: 34.032235, longitude: -118.233683 },
    address: '555 College Blvd, Los Angeles, CA 90003',
    capacity: 400,
    occupancy: 210,
    contact: '213-555-6789',
    amenities: ['Food', 'Water', 'Medical', 'Wifi', 'Showers', 'Beds'],
    openingTime: '7:00 AM',
    closingTime: '11:00 PM',
    active: true
  }
];

interface SheltersListProps {
  userLocation?: Coordinates | null;
}

const SheltersList: React.FC<SheltersListProps> = ({ userLocation }) => {
  const [shelters, setShelters] = useState<Shelter[]>(mockShelters);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'nearby'>('all');
  
  // Filter shelters based on search term
  const filteredShelters = shelters.filter(shelter => 
    shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter nearby shelters (within 10km of user location)
  const nearbyShelters = userLocation 
    ? filteredShelters.filter(shelter => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          shelter.coordinates.latitude,
          shelter.coordinates.longitude
        );
        return distance <= 10; // Within 10km
      })
    : [];
  
  // Display shelters based on active filter
  const displayedShelters = activeFilter === 'nearby' ? nearbyShelters : filteredShelters;
  
  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
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
  }

  function toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
  
  // Get formatted distance from user location
  const getDistanceString = (shelter: Shelter) => {
    if (!userLocation) return 'Distance unknown';
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      shelter.coordinates.latitude,
      shelter.coordinates.longitude
    );
    
    return distance < 1 
      ? `${(distance * 1000).toFixed(0)} m` 
      : `${distance.toFixed(1)} km`;
  };
  
  // Get occupancy status badge
  const getOccupancyBadge = (shelter: Shelter) => {
    const occupancyPercentage = (shelter.occupancy / shelter.capacity) * 100;
    
    if (occupancyPercentage >= 90) {
      return <Badge variant="destructive">Near Capacity</Badge>;
    } else if (occupancyPercentage >= 75) {
      return <Badge variant="default">High Capacity</Badge>;
    } else if (occupancyPercentage >= 50) {
      return <Badge variant="secondary">Moderate</Badge>;
    } else {
      return <Badge variant="outline">Available</Badge>;
    }
  };
  
  return (
    <div className="w-full">
      <div className="mb-4">
        <Input
          placeholder="Search shelters by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        
        <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as 'all' | 'nearby')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Shelters</TabsTrigger>
            <TabsTrigger value="nearby" disabled={!userLocation}>
              {userLocation ? 'Nearby Shelters' : 'Location Required'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {displayedShelters.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-1">No Shelters Found</h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'No shelters match your search criteria.' 
              : activeFilter === 'nearby' && userLocation
                ? 'No shelters found near your location.'
                : 'No active shelters available at this time.'
            }
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="flex flex-col space-y-4">
            {displayedShelters.map(shelter => (
              <Card key={shelter.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{shelter.name}</CardTitle>
                    {getOccupancyBadge(shelter)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      <span className="text-sm">{shelter.address}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      <span className="text-sm">{shelter.contact}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      <span className="text-sm">Hours: {shelter.openingTime} - {shelter.closingTime}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      <span className="text-sm">
                        Occupancy: {shelter.occupancy} / {shelter.capacity}
                      </span>
                    </div>
                    
                    {userLocation && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                        <span className="text-sm">Distance: {getDistanceString(shelter)}</span>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-1">Amenities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {shelter.amenities.map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between w-full">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="default" size="sm" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default SheltersList;
