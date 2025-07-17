
import { CheckCircle, Loader, Search, Filter, Download, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ScrapingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration?: string;
  details?: string[];
  propertiesFound?: string[];
}

interface ScrapingStepsVisualizationProps {
  steps: ScrapingStep[];
  currentStep: number;
}

export const ScrapingStepsVisualization = ({ steps, currentStep }: ScrapingStepsVisualizationProps) => {
  const getStepIcon = (step: ScrapingStep, index: number) => {
    const iconClass = "h-5 w-5";
    
    if (step.status === 'processing') {
      return <Loader className={`${iconClass} text-blue-500 animate-spin`} />;
    }
    
    if (step.status === 'completed') {
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    }
    
    // Default icons based on step type
    switch (index) {
      case 0: return <Search className={`${iconClass} text-gray-400`} />;
      case 1: return <Download className={`${iconClass} text-gray-400`} />;
      case 2: return <Filter className={`${iconClass} text-gray-400`} />;
      case 3: return <Database className={`${iconClass} text-gray-400`} />;
      default: return <div className={`${iconClass} bg-gray-300 rounded-full`} />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Scraping Pipeline - Top Result</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full border-2 ${
                step.status === 'completed' ? 'border-green-500 bg-green-50' :
                step.status === 'processing' ? 'border-blue-500 bg-blue-50' :
                step.status === 'failed' ? 'border-red-500 bg-red-50' :
                'border-gray-300 bg-gray-50'
              }`}>
                {getStepIcon(step, index)}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${
                  step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                }`} />
              )}
            </div>
            
            {/* Step content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-900">{step.title}</h4>
                <Badge variant={
                  step.status === 'completed' ? 'default' :
                  step.status === 'processing' ? 'secondary' :
                  step.status === 'failed' ? 'destructive' :
                  'outline'
                }>
                  {step.status}
                </Badge>
                {step.duration && (
                  <span className="text-xs text-gray-500">{step.duration}</span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>
              
              {step.details && step.details.length > 0 && (
                <div className="space-y-1">
                  {step.details.map((detail, idx) => (
                    <p key={idx} className="text-xs text-gray-500 pl-2 border-l-2 border-gray-200">
                      {detail}
                    </p>
                  ))}
                </div>
              )}
              
              {step.propertiesFound && step.propertiesFound.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">Properties Found:</p>
                  <div className="flex flex-wrap gap-1">
                    {step.propertiesFound.map((prop, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {prop}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
