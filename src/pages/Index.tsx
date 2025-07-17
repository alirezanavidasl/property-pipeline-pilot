
import { useState, useEffect } from "react";
import { ScrapingToolHeader } from "@/components/ScrapingToolHeader";
import { PipelineCard, PipelineData } from "@/components/PipelineCard";
import { ScrapingStepsVisualization, ScrapingStep } from "@/components/ScrapingStepsVisualization";
import { PropertyResultsPanel, PropertyResult } from "@/components/PropertyResultsPanel";

const Index = () => {
  const [equipmentName, setEquipmentName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [pipelines, setPipelines] = useState<PipelineData[]>([]);
  const [scrapingSteps, setScrapingSteps] = useState<ScrapingStep[]>([]);
  const [properties, setProperties] = useState<PropertyResult[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Mock data for demonstration
  const initializeMockData = () => {
    const mockPipelines: PipelineData[] = [
      {
        id: "1",
        url: "https://www.manufacturer-specs.com/equipment/xg-2000",
        domain: "manufacturer-specs.com",
        status: "processing",
        confidence: 85,
        propertiesFound: 12,
        estimatedTime: "2m 30s",
        lastStep: "Extracting technical specifications..."
      },
      {
        id: "2",
        url: "https://equipmentdb.industrial.com/models/xg2000",
        domain: "equipmentdb.industrial.com",
        status: "pending",
        confidence: 72,
        propertiesFound: 8,
        estimatedTime: "3m 15s",
        lastStep: "Queued for processing"
      },
      {
        id: "3",
        url: "https://parts-catalog.machinery.net/xg-2000-specs",
        domain: "parts-catalog.machinery.net",
        status: "pending",
        confidence: 68,
        propertiesFound: 6,
        estimatedTime: "4m 0s",
        lastStep: "Waiting in queue"
      }
    ];

    const mockSteps: ScrapingStep[] = [
      {
        id: "1",
        title: "Page Analysis",
        description: "Analyzing page structure and identifying data sections",
        status: "completed",
        duration: "0.8s",
        details: [
          "Detected manufacturer specification format",
          "Found technical data tables",
          "Identified 3 potential property sections"
        ]
      },
      {
        id: "2",
        title: "Content Extraction",
        description: "Extracting raw content from identified sections",
        status: "processing",
        details: [
          "Processing specification tables...",
          "Extracting product descriptions",
          "Parsing technical drawings metadata"
        ]
      },
      {
        id: "3",
        title: "Data Processing",
        description: "Processing and validating extracted properties",
        status: "pending",
        details: []
      },
      {
        id: "4",
        title: "Quality Verification",
        description: "Cross-referencing and verifying property accuracy",
        status: "pending",
        details: []
      }
    ];

    const mockProperties: PropertyResult[] = [
      {
        name: "Power Output",
        value: "2000 kW",
        confidence: 95,
        source: "manufacturer-specs.com",
        verified: true
      },
      {
        name: "Fuel Type",
        value: "Diesel",
        confidence: 90,
        source: "manufacturer-specs.com",
        verified: true
      },
      {
        name: "Dimensions (L×W×H)",
        value: "3.2m × 1.8m × 2.1m",
        confidence: 88,
        source: "manufacturer-specs.com",
        verified: false
      },
      {
        name: "Weight",
        value: "4,250 kg",
        confidence: 85,
        source: "manufacturer-specs.com",
        verified: false
      },
      {
        name: "Frequency",
        value: "50/60 Hz",
        confidence: 92,
        source: "manufacturer-specs.com",
        verified: true
      }
    ];

    setPipelines(mockPipelines);
    setScrapingSteps(mockSteps);
    setProperties(mockProperties);
  };

  const handleScrape = () => {
    setIsLoading(true);
    setShowDetails(false);
    
    // Initialize with mock data
    initializeMockData();
    
    // Simulate scraping progression
    setTimeout(() => {
      setIsLoading(false);
      
      // Update pipeline statuses progressively
      const updateInterval = setInterval(() => {
        setPipelines(prev => {
          const updated = [...prev];
          const processing = updated.find(p => p.status === 'processing');
          if (processing) {
            processing.confidence = Math.min(processing.confidence + 5, 100);
            processing.propertiesFound = Math.min(processing.propertiesFound + 1, 15);
            
            if (processing.confidence >= 100) {
              processing.status = 'completed';
              processing.lastStep = 'Extraction completed';
              
              // Start next pipeline
              const pending = updated.find(p => p.status === 'pending');
              if (pending) {
                pending.status = 'processing';
                pending.lastStep = 'Analyzing page structure...';
              }
            }
          }
          return updated;
        });

        // Update steps
        setScrapingSteps(prev => {
          const updated = [...prev];
          const processing = updated.find(s => s.status === 'processing');
          if (processing) {
            // Simulate step completion
            setTimeout(() => {
              processing.status = 'completed';
              processing.duration = '1.2s';
              
              const nextIndex = updated.findIndex(s => s.status === 'pending');
              if (nextIndex !== -1) {
                updated[nextIndex].status = 'processing';
                setCurrentStep(nextIndex);
              }
            }, 3000);
          }
          return updated;
        });
      }, 2000);

      // Clear interval after demo
      setTimeout(() => clearInterval(updateInterval), 20000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <ScrapingToolHeader
        equipmentName={equipmentName}
        modelNumber={modelNumber}
        isLoading={isLoading}
        onEquipmentChange={setEquipmentName}
        onModelChange={setModelNumber}
        onScrape={handleScrape}
      />

      {pipelines.length > 0 && (
        <>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Scraping Pipelines</h2>
            <div className="grid gap-4">
              {pipelines.map((pipeline, index) => (
                <PipelineCard
                  key={pipeline.id}
                  pipeline={pipeline}
                  isTopResult={index === 0}
                  onViewDetails={() => setShowDetails(!showDetails)}
                />
              ))}
            </div>
          </div>

          {showDetails && (
            <div className="grid lg:grid-cols-2 gap-6">
              <ScrapingStepsVisualization
                steps={scrapingSteps}
                currentStep={currentStep}
              />
              <PropertyResultsPanel
                properties={properties}
                equipmentName={equipmentName}
                modelNumber={modelNumber}
              />
            </div>
          )}
        </>
      )}

      {pipelines.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            Enter equipment details above to start scraping for properties
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
