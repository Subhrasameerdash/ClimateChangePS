
import React from 'react';
import { DisasterEvent, SeverityLevel } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Droplets, Tornado, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertsListProps {
  alerts: DisasterEvent[];
  loading: boolean;
  onViewDetails?: (alert: DisasterEvent) => void;
}

const AlertIcon: React.FC<{ type: DisasterEvent['type']; size?: number }> = ({ type, size = 20 }) => {
  switch (type) {
    case 'earthquake':
      return <AlertTriangle size={size} />;
    case 'flood':
      return <Droplets size={size} />;
    case 'hurricane':
    case 'tornado':
      return <Wind size={size} />;
    default:
      return <AlertTriangle size={size} />;
  }
};

const SeverityBadge: React.FC<{ severity: SeverityLevel }> = ({ severity }) => {
  const variants = {
    critical: 'bg-alert-critical hover:bg-alert-critical text-white',
    high: 'bg-alert-high hover:bg-alert-high text-white',
    moderate: 'bg-alert-moderate hover:bg-alert-moderate text-black',
    low: 'bg-alert-low hover:bg-alert-low text-white',
  };

  return (
    <Badge className={cn(variants[severity])}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

const AlertsList: React.FC<AlertsListProps> = ({ alerts, loading, onViewDetails }) => {
  if (loading) {
    return (
      <div className="flex flex-col space-y-4 w-full">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse bg-secondary/30">
            <CardHeader>
              <div className="h-6 bg-secondary rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-secondary rounded w-full mb-2"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto mb-4 text-muted-foreground" size={48} />
        <h3 className="text-lg font-medium">No Alerts</h3>
        <p className="text-muted-foreground">There are no active alerts in your area.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full pr-4">
      <div className="flex flex-col space-y-4 w-full">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} onViewDetails={onViewDetails} />
        ))}
      </div>
    </ScrollArea>
  );
};

interface AlertCardProps {
  alert: DisasterEvent;
  onViewDetails?: (alert: DisasterEvent) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewDetails }) => {
  const timeAgo = formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true });
  
  return (
    <Card className={cn(
      "transition-all border-l-4",
      alert.severity === 'critical' && "border-l-alert-critical",
      alert.severity === 'high' && "border-l-alert-high", 
      alert.severity === 'moderate' && "border-l-alert-moderate",
      alert.severity === 'low' && "border-l-alert-low"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertIcon type={alert.type} />
            <CardTitle className="text-lg">{alert.title}</CardTitle>
          </div>
          <SeverityBadge severity={alert.severity} />
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>{alert.source}</span>
          <span>{timeAgo}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{alert.description}</p>
        
        <div className="mt-4 text-xs text-muted-foreground grid grid-cols-2 gap-2">
          <div>
            <strong>Type:</strong> {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
          </div>
          
          {alert.magnitude && (
            <div>
              <strong>Magnitude:</strong> {alert.magnitude}
            </div>
          )}
          
          {alert.waterLevel && (
            <div>
              <strong>Water Level:</strong> {alert.waterLevel}m
            </div>
          )}
          
          {alert.windSpeed && (
            <div>
              <strong>Wind Speed:</strong> {alert.windSpeed}mph
            </div>
          )}
          
          <div>
            <strong>Location:</strong> {alert.coordinates.latitude.toFixed(2)}, {alert.coordinates.longitude.toFixed(2)}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          {alert.url ? (
            <Button asChild variant="link" size="sm" className="px-0">
              <a href={alert.url} target="_blank" rel="noopener noreferrer">
                View Source
              </a>
            </Button>
          ) : <div />}
          
          {onViewDetails && (
            <Button size="sm" onClick={() => onViewDetails(alert)}>
              View Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AlertsList;
