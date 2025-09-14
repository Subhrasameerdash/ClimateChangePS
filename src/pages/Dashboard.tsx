import React, { useState, useMemo } from 'react';
import { useDisasters } from '@/hooks/useDisasters';
import { useLocation } from '@/hooks/useLocation';
import { DisasterEvent } from '@/types';
import Layout from '@/components/layout/Layout';
import AlertsList from '@/components/alerts/AlertsList';
import DisasterMap from '@/components/map/DisasterMap';
import SafetyTips from '@/components/safety/SafetyTips';
import SheltersList from '@/components/shelters/SheltersList';
import ReportIncident from '@/components/reporting/ReportIncident';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, MapPin, Home, ShieldAlert, 
  ClipboardEdit, ChevronRight, AlertCircle, 
  Phone, Bell, Info, Zap, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

const Dashboard = () => {
  const { location, loading: locationLoading } = useLocation();
  const { disasters, loading: disastersLoading } = useDisasters(location);
  const { theme, setTheme } = useTheme();
  
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [activeTab, setActiveTab] = useState('map'); // Default to map tab
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Critical alerts (highest severity)
  const criticalAlerts = useMemo(() => {
    return disasters.filter(alert => alert.severity === 'critical');
  }, [disasters]);
  
  // Recently reported alerts (last 24 hours)
  const recentAlerts = useMemo(() => {
    const oneDayAgo = Date.now() - 86400000; // 24 hours ago
    return disasters.filter(alert => alert.timestamp > oneDayAgo);
  }, [disasters]);
  
  // Handle selecting a disaster from the map or list
  const handleSelectDisaster = (disaster: DisasterEvent) => {
    setSelectedDisaster(disaster);
    if (activeTab !== 'map') {
      setActiveTab('map');
    }
  };
  
  // Handle emergency call button - directly initiate call
  const handleEmergencyCall = () => {
    window.location.href = 'tel:911';
  };
  
  // Format a number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        toast.error("This browser does not support desktop notifications");
        return;
      }
      
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast.success("Notifications enabled!");
        
        // Show a test notification
        const notification = new Notification("DisasterAlert", {
          body: "You will now receive alerts for critical disasters in your area.",
          icon: "/favicon.ico"
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } else {
        toast.error("Permission denied for notifications");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 transition-theme">
        {/* Header with summary stats */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold font-heading mb-1">Disaster Alerts Dashboard</h1>
            <p className="text-muted-foreground">
              Monitoring {formatNumber(disasters.length)} active alerts worldwide
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleEmergencyCall}
            >
              <Phone size={16} />
              <span>911</span>
            </Button>
          </div>
        </div>
        
        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <div className="animate-pulse-critical mb-6 p-4 rounded-lg flex items-center justify-between bg-alert-critical text-white">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <div>
                <h2 className="font-bold">Critical Alert{criticalAlerts.length > 1 ? 's' : ''}</h2>
                <p>{criticalAlerts.length} critical disaster{criticalAlerts.length > 1 ? 's' : ''} detected</p>
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
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-alert-moderate" />
                <div>
                  <h3 className="font-medium">Location Access Required</h3>
                  <p className="text-sm text-muted-foreground">Enable location access to receive accurate disaster alerts for your area</p>
                </div>
              </div>
              <Button 
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
        
        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-5">
            {/* Emergency Call Card */}
            <Card className="bg-alert-critical text-white overflow-hidden border-0">
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Emergency</h3>
                      <p className="text-sm opacity-90">Call 911 for immediate help</p>
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
              <Card className="dashboard-card">
                <CardHeader className="p-4 pb-2">
                  <CardDescription>Active Alerts</CardDescription>
                  <CardTitle className="text-2xl font-bold">{formatNumber(disasters.length)}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="dashboard-card">
                <CardHeader className="p-4 pb-2">
                  <CardDescription>Recent Reports</CardDescription>
                  <CardTitle className="text-2xl font-bold">{formatNumber(recentAlerts.length)}</CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            {/* Recent Alerts Summary */}
            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-4 w-4 text-alert-high" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {recentAlerts.length > 0 ? (
                  <ul className="space-y-3">
                    {recentAlerts.slice(0, 5).map(alert => (
                      <li 
                        key={alert.id} 
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleSelectDisaster(alert)}
                      >
                        <div className="flex items-center">
                          {alert.severity === 'critical' && <AlertTriangle className="h-4 w-4 mr-2 text-alert-critical" />}
                          {alert.severity === 'high' && <AlertTriangle className="h-4 w-4 mr-2 text-alert-high" />}
                          {alert.severity === 'moderate' && <AlertTriangle className="h-4 w-4 mr-2 text-alert-moderate" />}
                          <span className="truncate text-sm">{alert.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground py-2">No recent alerts</p>
                )}
                
                {recentAlerts.length > 5 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3 text-primary"
                    onClick={() => setActiveTab('alerts')}
                  >
                    Show All ({recentAlerts.length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Filters Card */}
            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {notificationsEnabled 
                      ? "Push notifications are enabled for critical alerts." 
                      : "Enable push notifications to receive real-time alerts."}
                  </p>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={requestNotificationPermission}
                    disabled={notificationsEnabled}
                  >
                    {notificationsEnabled ? "Notifications Enabled" : "Enable Push Notifications"}
                  </Button>

                  <div className="pt-2 border-t border-border mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={toggleTheme}
                    >
                      {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            <Card className="overflow-hidden dashboard-card">
              {/* Main Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="p-0 h-12 w-full rounded-none bg-transparent border-b justify-start overflow-x-auto">
                    <TabsTrigger value="map" className="flex items-center gap-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                      <MapPin className="h-4 w-4" />
                      <span>Map</span>
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="flex items-center gap-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                      <Bell className="h-4 w-4" />
                      <span>Alerts</span>
                      {criticalAlerts.length > 0 && (
                        <span className="ml-1 text-xs bg-alert-critical text-white rounded-full w-5 h-5 flex items-center justify-center">
                          {criticalAlerts.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="shelters" className="flex items-center gap-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Shelters</span>
                    </TabsTrigger>
                    <TabsTrigger value="safety" className="flex items-center gap-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                      <Home className="h-4 w-4" />
                      <span>Safety Tips</span>
                    </TabsTrigger>
                    <TabsTrigger value="report" className="flex items-center gap-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                      <ClipboardEdit className="h-4 w-4" />
                      <span>Report</span>
                    </TabsTrigger>
                    <TabsTrigger value="info" className="flex items-center gap-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                      <Info className="h-4 w-4" />
                      <span>About</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="map" className="m-0 p-0">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 font-heading">Global Disaster Map</h2>
                    <DisasterMap 
                      disasters={disasters} 
                      userLocation={location}
                      onSelectDisaster={setSelectedDisaster}
                      loading={disastersLoading}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="alerts" className="m-0 p-0">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 font-heading">Active Disaster Alerts</h2>
                    <AlertsList 
                      alerts={disasters} 
                      loading={disastersLoading} 
                      onViewDetails={handleSelectDisaster}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="shelters" className="m-0 p-0">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 font-heading">Emergency Shelters</h2>
                    <SheltersList userLocation={location} />
                  </div>
                </TabsContent>
                
                <TabsContent value="safety" className="m-0 p-0">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 font-heading">Safety Guidelines</h2>
                    <SafetyTips defaultDisasterType={selectedDisaster?.type || 'earthquake'} />
                  </div>
                </TabsContent>
                
                <TabsContent value="report" className="m-0 p-0">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 font-heading">Report Incident</h2>
                    <ReportIncident
                      onSuccess={() => {
                        setActiveTab('alerts');
                        toast.success('Thank you for your report. Authorities have been notified.');
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="info" className="m-0 p-0">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 font-heading">About DisasterAlert</h2>
                    <div className="space-y-4">
                      <p>
                        DisasterAlert provides real-time information about natural disasters and emergencies worldwide.
                        Our system monitors multiple data sources to deliver timely and accurate alerts.
                      </p>
                      <h3 className="text-xl font-medium mt-4">Alert Severity Levels</h3>
                      <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full bg-alert-critical"></span>
                          <strong>Critical:</strong> 
                          <span className="text-muted-foreground">Immediate action required. Life-threatening situation.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full bg-alert-high"></span>
                          <strong>High:</strong> 
                          <span className="text-muted-foreground">Urgent attention needed. Potential for significant impact.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full bg-alert-moderate"></span>
                          <strong>Moderate:</strong> 
                          <span className="text-muted-foreground">Be aware and prepared. Monitor for updates.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
