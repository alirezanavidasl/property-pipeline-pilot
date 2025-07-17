
import { Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ScrapingToolHeaderProps {
  equipmentName: string;
  modelNumber: string;
  isLoading: boolean;
  onEquipmentChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onScrape: () => void;
}

export const ScrapingToolHeader = ({
  equipmentName,
  modelNumber,
  isLoading,
  onEquipmentChange,
  onModelChange,
  onScrape
}: ScrapingToolHeaderProps) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Equipment Scraper</h1>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="flex-1">
            <Input
              placeholder="Equipment Name (e.g., Generator, Pump, Motor)"
              value={equipmentName}
              onChange={(e) => onEquipmentChange(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Model Number (e.g., XG-2000, P-450, M-750)"
              value={modelNumber}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={onScrape}
            disabled={isLoading || !equipmentName || !modelNumber}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? "Scraping..." : "Scrape Data"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
