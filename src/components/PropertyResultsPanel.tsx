
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";

export interface PropertyResult {
  name: string;
  value: string;
  confidence: number;
  source: string;
  verified: boolean;
}

interface PropertyResultsPanelProps {
  properties: PropertyResult[];
  equipmentName: string;
  modelNumber: string;
  onRerunProperties?: (propertyNames: string[]) => void;
}

export const PropertyResultsPanel = ({ properties, equipmentName, modelNumber, onRerunProperties }: PropertyResultsPanelProps) => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Properties with low confidence (<80%) or missing common properties
  const lowConfidenceProperties = properties.filter(p => p.confidence < 80);
  const commonMissingProperties = [
    "Operating Temperature",
    "IP Rating", 
    "Noise Level",
    "Efficiency Rating",
    "Maintenance Schedule"
  ].filter(name => !properties.some(p => p.name === name));

  const feedbackProperties = [
    ...lowConfidenceProperties.map(p => ({ name: p.name, type: 'low-confidence' as const })),
    ...commonMissingProperties.map(name => ({ name, type: 'missing' as const }))
  ];

  const handlePropertyToggle = (propertyName: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties(prev => [...prev, propertyName]);
    } else {
      setSelectedProperties(prev => prev.filter(name => name !== propertyName));
    }
  };

  const handleRerun = () => {
    if (selectedProperties.length > 0 && onRerunProperties) {
      onRerunProperties(selectedProperties);
      setSelectedProperties([]);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Properties Found for {equipmentName} {modelNumber}
        </h3>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {properties.length} Properties
        </Badge>
      </div>
      
      <div className="space-y-3">
        {properties.map((property, index) => {
          const showCheckbox = property.confidence < 80;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                {showCheckbox && (
                  <Checkbox
                    checked={selectedProperties.includes(property.name)}
                    onCheckedChange={(checked) => handlePropertyToggle(property.name, checked as boolean)}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{property.name}</span>
                    {property.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {showCheckbox && (
                      <Badge variant="outline" className="border-red-300 text-red-600 text-xs">
                        Low Confidence
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{property.value}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">Source: {property.source}</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <Badge className={getConfidenceColor(property.confidence)}>
                {property.confidence}%
              </Badge>
            </div>
          );
        })}
        
        {commonMissingProperties.map((propertyName) => (
          <div key={propertyName} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3 flex-1">
              <Checkbox
                checked={selectedProperties.includes(propertyName)}
                onCheckedChange={(checked) => handlePropertyToggle(propertyName, checked as boolean)}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{propertyName}</span>
                  <Badge variant="outline" className="border-orange-300 text-orange-600 text-xs">
                    Missing
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 italic">Property not found - select to search again</p>
              </div>
            </div>
            
            <Badge className="bg-orange-100 text-orange-800">
              N/A
            </Badge>
          </div>
        ))}
      </div>
      
      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No properties found yet. Scraping in progress...</p>
        </div>
      )}

      {selectedProperties.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            onClick={handleRerun}
            className="w-full"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-run Pipeline for Selected Properties ({selectedProperties.length})
          </Button>
        </div>
      )}
    </Card>
  );
};
