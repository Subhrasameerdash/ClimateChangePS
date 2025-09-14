import React, { useState } from 'react';
import { SafetyTip, DisasterType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Droplets, Wind, Flame, Waves } from 'lucide-react';

// Mock safety tips
const mockSafetyTips: SafetyTip[] = [
  {
    id: 'tip-eq-1',
    disasterType: 'earthquake',
    title: 'Drop, Cover, and Hold On',
    content: "DROP to the ground; take COVER by getting under a sturdy table or other piece of furniture; HOLD ON until the shaking stops. If there isn't a table or desk near you, cover your face and head with your arms and crouch in an inside corner of the building.",
    language: 'en'
  },
  {
    id: 'tip-eq-2',
    disasterType: 'earthquake',
    title: 'Stay Away from Glass, Windows, Outside Doors and Walls',
    content: "These items may shatter and cause injury. DO NOT run outside while the ground is still shaking. Most earthquake-related casualties result from collapsing walls, flying glass, and falling objects.",
    language: 'en'
  },
  {
    id: 'tip-fl-1',
    disasterType: 'flood',
    title: 'Move to Higher Ground',
    content: "If you are in a flood-prone area or are camping in a low-lying area, get to higher ground immediately. Do not drive through flooded areas or attempt to cross flowing streams.",
    language: 'en'
  },
  {
    id: 'tip-fl-2',
    disasterType: 'flood',
    title: 'Avoid Contact with Floodwater',
    content: "Floodwater may be contaminated with oil, gasoline, or raw sewage. It may also be electrically charged from underground or downed power lines.",
    language: 'en'
  },
  {
    id: 'tip-hu-1',
    disasterType: 'hurricane',
    title: 'Prepare a Disaster Supply Kit',
    content: "Include items like water, food, battery-powered or hand crank radio, flashlight, first aid kit, extra batteries, cell phone with chargers and a backup battery.",
    language: 'en'
  },
  {
    id: 'tip-hu-2',
    disasterType: 'hurricane',
    title: 'Secure Your Home',
    content: 'Cover all windows with hurricane shutters or 5/8" marine plywood. Tape does NOT prevent windows from breaking. Trim trees and shrubs around your home to minimize risk of broken branches and debris.',
    language: 'en'
  },
  {
    id: 'tip-to-1',
    disasterType: 'tornado',
    title: 'Find Safe Shelter Immediately',
    content: "Go to a pre-designated shelter area such as a safe room, basement, storm cellar, or the lowest building level. If there is no basement, go to the center of an interior room on the lowest level away from corners, windows, doors, and outside walls.",
    language: 'en'
  },
  {
    id: 'tip-ot-1',
    disasterType: 'wildfire',
    title: 'Create Defensible Space',
    content: "Clear debris, vegetation, and other flammable materials within 30 feet of your house. Keep your gutters clean and roof clear of leaves and branches.",
    language: 'en'
  },
  {
    id: 'tip-ot-2',
    disasterType: 'tsunami',
    title: 'Evacuate to Higher Ground',
    content: 'If you feel a strong earthquake near the coast, or receive an official tsunami warning, immediately move to higher ground or inland away from water. Wait for official "all clear" before returning.',
    language: 'en'
  }
];

// Spanish translated tips
const spanishTips: SafetyTip[] = [
  {
    id: 'tip-eq-1-es',
    disasterType: 'earthquake',
    title: 'Agacharse, Cubrirse y Sujetarse',
    content: "AGÁCHESE al suelo; CÚBRASE debajo de una mesa resistente u otro mueble; SUJÉTESE hasta que el temblor se detenga. Si no hay una mesa cerca, cúbrase la cara y la cabeza con los brazos y agáchese en una esquina interior del edificio.",
    language: 'es'
  },
  {
    id: 'tip-fl-1-es',
    disasterType: 'flood',
    title: 'Diríjase a un Lugar Más Alto',
    content: "Si está en una zona propensa a inundaciones, vaya inmediatamente a un lugar más alto. No conduzca a través de áreas inundadas ni intente cruzar arroyos con corriente.",
    language: 'es'
  },
  {
    id: 'tip-hu-1-es',
    disasterType: 'hurricane',
    title: 'Prepare un Kit de Suministros para Desastres',
    content: "Incluya artículos como agua, alimentos, radio a pilas o de manivela, linterna, botiquín de primeros auxilios, pilas adicionales, teléfono móvil con cargadores y batería de respaldo.",
    language: 'es'
  },
];

interface SafetyTipsProps {
  defaultDisasterType?: DisasterType;
}

const DisasterIcon: React.FC<{ type: DisasterType }> = ({ type }) => {
  switch (type) {
    case 'earthquake':
      return <AlertTriangle className="h-4 w-4" />;
    case 'flood':
      return <Droplets className="h-4 w-4" />;
    case 'hurricane':
    case 'tornado':
      return <Wind className="h-4 w-4" />;
    case 'wildfire':
      return <Flame className="h-4 w-4" />;
    case 'tsunami':
      return <Waves className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const SafetyTips: React.FC<SafetyTipsProps> = ({ defaultDisasterType = 'earthquake' }) => {
  const [language, setLanguage] = useState<string>('en');
  
  // Combine all tips and filter by language
  const allTips = [...mockSafetyTips, ...spanishTips].filter(tip => tip.language === language);
  
  // Get unique disaster types from the tips
  const disasterTypes = Array.from(new Set(allTips.map(tip => tip.disasterType)));
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Safety Tips</CardTitle>
        <Select 
          value={language} 
          onValueChange={setLanguage}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultDisasterType}>
          <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
            {disasterTypes.map(type => (
              <TabsTrigger key={type} value={type} className="flex items-center gap-1">
                <DisasterIcon type={type} />
                <span className="capitalize">{type}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {disasterTypes.map(type => (
            <TabsContent key={type} value={type} className="mt-0">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {allTips
                    .filter(tip => tip.disasterType === type)
                    .map(tip => (
                      <div key={tip.id} className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-2">{tip.title}</h3>
                        <p className="text-muted-foreground">{tip.content}</p>
                      </div>
                    ))
                  }
                  
                  {allTips.filter(tip => tip.disasterType === type).length === 0 && (
                    <div className="text-center py-8">
                      <p>No safety tips available for this disaster type in {language === 'en' ? 'English' : 'Spanish'}.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <a href="https://www.ready.gov/" target="_blank" rel="noopener noreferrer">
                    More Safety Information
                  </a>
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SafetyTips;
