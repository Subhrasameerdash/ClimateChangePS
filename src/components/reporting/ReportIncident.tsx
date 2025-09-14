
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { DisasterType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, MapPin, Upload } from 'lucide-react';

interface ReportIncidentProps {
  onSuccess?: () => void;
}

const ReportIncident: React.FC<ReportIncidentProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { location } = useLocation();
  
  const [type, setType] = useState<DisasterType>('earthquake');
  const [description, setDescription] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [manualLocation, setManualLocation] = useState({ latitude: '', longitude: '' });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description) {
      toast.error('Please provide a description of the incident.');
      return;
    }
    
    // Check if we have a valid location
    if (useCurrentLocation && !location) {
      toast.error('Could not determine your current location. Please enable location services or enter coordinates manually.');
      return;
    }
    
    if (!useCurrentLocation && (!manualLocation.latitude || !manualLocation.longitude)) {
      toast.error('Please provide both latitude and longitude for the incident location.');
      return;
    }
    
    const finalLocation = useCurrentLocation 
      ? location 
      : { latitude: parseFloat(manualLocation.latitude), longitude: parseFloat(manualLocation.longitude) };
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to an API
      console.log('Submitting report:', {
        type,
        description,
        location: finalLocation,
        userId: user?.id || 'anonymous',
        images: images.map(img => img.name)
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Incident report submitted successfully!');
      
      // Reset form
      setDescription('');
      setImages([]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to submit incident report. Please try again later.');
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };
  
  // Remove an uploaded image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-alert-critical" />
          Report an Incident
        </CardTitle>
        <CardDescription>
          Submit information about a disaster or emergency situation in your area.
          Your report will help authorities respond to the situation.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="incident-type">Incident Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as DisasterType)}
            >
              <SelectTrigger id="incident-type">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="hurricane">Hurricane</SelectItem>
                <SelectItem value="tornado">Tornado</SelectItem>
                <SelectItem value="wildfire">Wildfire</SelectItem>
                <SelectItem value="tsunami">Tsunami</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what's happening, the severity, and any other important details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>
          
          <div className="space-y-4">
            <Label>Location</Label>
            <RadioGroup 
              defaultValue="current" 
              value={useCurrentLocation ? "current" : "manual"}
              onValueChange={(value) => setUseCurrentLocation(value === "current")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current" className="cursor-pointer">Use my current location</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual" className="cursor-pointer">Enter coordinates manually</Label>
              </div>
            </RadioGroup>
            
            {!useCurrentLocation ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="e.g. 34.0522"
                    value={manualLocation.latitude}
                    onChange={(e) => setManualLocation(prev => ({ ...prev, latitude: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="e.g. -118.2437"
                    value={manualLocation.longitude}
                    onChange={(e) => setManualLocation(prev => ({ ...prev, longitude: e.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {location ? (
                  <span>
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Determining your location...
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="images">Upload Images (Optional)</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-medium">Click to upload images</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP (max 5MB each)
                    </p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="h-24 rounded-md overflow-hidden bg-secondary flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Uploaded ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || (useCurrentLocation && !location)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReportIncident;
