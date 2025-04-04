import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { processPRD } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import DocumentUpload from '../components/DocumentUpload';

const UploadPRD = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [processing, setProcessing] = useState(false);

  const handleProcessPRD = async (prdText: string) => {
    if (!projectId || !prdText.trim()) return;
    
    try {
      setProcessing(true);
      setLoading(true);
      const result = await processPRD(projectId, prdText);
      
      toast.success(`Processed PRD successfully. Extracted ${result.story_ids?.length || 0} user stories.`);
      
      // Redirect to user stories page
      navigate(`/project/${projectId}/user-stories`);
    } catch (error) {
      console.error('Error processing PRD:', error);
      toast.error('Failed to process PRD document');
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {(loading || processing) && <Loader message={processing ? "Processing PRD document..." : "Loading..."} />}
      
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Product Requirements Document</h1>
          <p className="text-gray-500">
            Extract user stories from your product requirements document
          </p>
        </div>
        
        <DocumentUpload
          title="Upload PRD Document"
          description="Upload your Product Requirements Document to automatically extract user stories for testing."
          onUpload={handleProcessPRD}
          isProcessing={processing}
        />
      </div>
    </div>
  );
};

export default UploadPRD;
