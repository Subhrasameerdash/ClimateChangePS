
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { useDisasters } from '@/hooks/useDisasters';
import { useLocation } from '@/hooks/useLocation';
import { useAuth } from '@/context/AuthContext';
import AlertsList from '@/components/alerts/AlertsList';
import DisasterMap from '@/components/map/DisasterMap';
import SafetyTips from '@/components/safety/SafetyTips';
import SheltersList from '@/components/shelters/SheltersList';
import ReportIncident from '@/components/reporting/ReportIncident';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DisasterEvent } from '@/types';
import { Bell, AlertTriangle, MapPin, Home, ShieldAlert, ClipboardEdit, ChevronRight, AlertCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const { location, loading: locationLoading } = useLocation();
  const { disasters, loading: disastersLoading, filterByDistance } = useDisasters(location);
  
  const [radius, setRadius] = useState<number>(100); // Default 100km radius
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [activeTab, setActiveTab] = useState('alerts');
  
  // Filter disasters based on user location and radius
  const nearbyDisasters = useMemo(() => {
    return location ? filterByDistance(radius) : disasters;
  }, [location, disasters, radius, filterByDistance]);
  
  // Critical alerts (highest severity)
  const criticalAlerts = useMemo(() => {
    return nearbyDisasters.filter(alert => alert.severity === 'critical');
  }, [nearbyDisasters]);
  
  // Recently reported alerts (last 24 hours)
  const recentAlerts = useMemo(() => {
    const oneDayAgo = Date.now() - 86400000; // 24 hours ago
    return nearbyDisasters.filter(alert => alert.timestamp > oneDayAgo);
  }, [nearbyDisasters]);
  
  // Handle selecting a disaster from the map or list
  const handleSelectDisaster = (disaster: DisasterEvent) => {
    setSelectedDisaster(disaster);
    if (activeTab !== 'map') {
      setActiveTab('map');
    }
  };
  
  // Handle emergency call button
  const handleEmergencyCall = () => {
    // In a real app, this would use the device's calling capability
    window.location.href = 'tel:911';
  };
  
  // Format a number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <div className="animate-pulse-critical mb-6 p-4 rounded-lg flex items-center justify-between bg-alert-critical text-white">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <div>
                <h2 className="font-bold">Critical Alert{criticalAlerts.length > 1 ? 's' : ''}</h2>
                <p>{criticalAlerts.length} critical disaster{criticalAlerts.length > 1 ? 's' : ''} in your area</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white text-white hover:bg-white/20" 
              onClick={() => setActiveTab('alerts')}
            >
              View All
            </Button>
          </div>
        )}
        
        {/* User Location Status */}
        {!location && !locationLoading && (
          <Card className="mb-6 border-alert-moderate border">
            <CardHeader className="py-3">
              <CardTitle className="text-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-alert-moderate" />
                Location Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <CardDescription>
                Enable location access to receive accurate disaster alerts for your area.
              </CardDescription>
              <Button 
                className="mt-2" 
                size="sm" 
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    () => toast.success("Location access enabled!"),
                    (err) => toast.error(`Location error: ${err.message}`)
                  );
                }}
              >
                Enable Location
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Alerts</span>
              {criticalAlerts.length > 0 && (
                <span className="ml-1 text-xs bg-alert-critical text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {criticalAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Map</span>
            </TabsTrigger>
            <TabsTrigger value="shelters" className="flex items-center gap-1">
              <ShieldAlert className="h-4 w-4" />
              <span>Shelters</span>
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Safety Tips</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-1">
              <ClipboardEdit className="h-4 w-4" />
              <span>Report</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Visible on all tabs */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emergency Call Card */}
              <Card className="bg-alert-critical text-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Phone className="h-6 w-6 mr-3" />
                      <div>
                        <h3 className="font-bold text-lg">Emergency</h3>
                        <p className="text-sm opacity-90">Call 911 for immediate assistance</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-white text-white hover:bg-white/20"
                      onClick={handleEmergencyCall}
                    >
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardDescription>Active Alerts</CardDescription>
                    <CardTitle className="text-2xl">{formatNumber(nearbyDisasters.length)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardDescription>Recent Reports</CardDescription>
                    <CardTitle className="text-2xl">{formatNumber(recentAlerts.length)}</CardTitle>
                  </CardHeader>
                </Card>
              </div>
              
              {/* Recent Alerts Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {recentAlerts.length > 0 ? (
                    <ul className="space-y-3">
                      {recentAlerts.slice(0, 3).map(alert => (
                        <li key={alert.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            {alert.type === 'earthquake' && <AlertTriangle className="h-4 w-4 mr-2 text-alert-critical" />}
                            {alert.type === 'flood' && <AlertTriangle className="h-4 w-4 mr-2 text-alert-high" />}
                            {alert.type === 'hurricane' && <AlertTriangle className="h-4 w-4 mr-2 text-alert-moderate" />}
                            <span className="truncate">{alert.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-muted-foreground py-2">No recent alerts</p>
                  )}
                </CardContent>
              </Card>
              
              {/* User Auth Card */}
              {!user && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Account Access</CardTitle>
                    <CardDescription>
                      Login to save your settings and receive personalized alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex space-x-2">
                      <Button asChild className="w-full">
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/register">Register</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <TabsContent value="alerts" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Disaster Alerts
                    </CardTitle>
                    <CardDescription>
                      Real-time alerts for earthquakes, floods, and other disasters in your area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertsList 
                      alerts={nearbyDisasters} 
                      loading={disastersLoading} 
                      onViewDetails={handleSelectDisaster}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="map" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Disaster Map
                    </CardTitle>
                    <CardDescription>
                      Interactive map showing active disasters and your location
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DisasterMap 
                      disasters={nearbyDisasters} 
                      userLocation={location}
                      onSelectDisaster={setSelectedDisaster}
                      loading={disastersLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="shelters" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" />
                      Emergency Shelters
                    </CardTitle>
                    <CardDescription>
                      Find nearby emergency shelters and evacuation centers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SheltersList userLocation={location} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="safety" className="m-0">
                <SafetyTips defaultDisasterType={selectedDisaster?.type || 'earthquake'} />
              </TabsContent>
              
              <TabsContent value="report" className="m-0">
                <ReportIncident
                  onSuccess={() => {
                    setActiveTab('alerts');
                    toast.success('Thank you for your report. Authorities have been notified.');
                  }}
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
