
import { ExternalLink, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PipelineData {
  id: string;
  url: string;
  domain: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence: number;
  propertiesFound: number;
  estimatedTime: string;
  lastStep: string;
}

interface PipelineCardProps {
  pipeline: PipelineData;
  isTopResult?: boolean;
  onViewDetails?: () => void;
}

export const PipelineCard = ({ pipeline, isTopResult = false, onViewDetails }: PipelineCardProps) => {
  const getStatusIcon = () => {
    switch (pipeline.status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'processing':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (pipeline.status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 hover:shadow-md ${isTopResult ? 'border-blue-500 border-2' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {isTopResult && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Top Result</Badge>}
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-1 capitalize">{pipeline.status}</span>
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{pipeline.domain}</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </div>
            
            <p className="text-sm text-gray-600 truncate max-w-md">{pipeline.url}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Confidence: {pipeline.confidence}%</span>
              <span>Properties: {pipeline.propertiesFound}</span>
              <span>ETA: {pipeline.estimatedTime}</span>
            </div>
            
            {pipeline.status === 'processing' && (
              <p className="text-sm text-blue-600 font-medium">{pipeline.lastStep}</p>
            )}
          </div>
        </div>
        
        {isTopResult && onViewDetails && (
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Steps
          </Button>
        )}
      </div>
      
      {/* Progress bar for processing status */}
      {pipeline.status === 'processing' && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(pipeline.confidence, 100)}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
