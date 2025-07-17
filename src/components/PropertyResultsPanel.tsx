
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink } from "lucide-react";

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
}

export const PropertyResultsPanel = ({ properties, equipmentName, modelNumber }: PropertyResultsPanelProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
        {properties.map((property, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">{property.name}</span>
                {property.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">{property.value}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">Source: {property.source}</span>
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </div>
            </div>
            
            <Badge className={getConfidenceColor(property.confidence)}>
              {property.confidence}%
            </Badge>
          </div>
        ))}
      </div>
      
      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No properties found yet. Scraping in progress...</p>
        </div>
      )}
    </Card>
  );
};
