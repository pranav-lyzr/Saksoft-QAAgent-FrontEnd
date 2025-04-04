import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { processArchitectureDoc } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import DocumentUpload from '../components/DocumentUpload';

const UploadTechDoc = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [processing, setProcessing] = useState(false);

  const handleProcessTechDoc = async (docText: string) => {
    if (!projectId || !docText.trim()) return;
    
    try {
      setProcessing(true);
      setLoading(true);
      const result = await processArchitectureDoc(projectId, docText);
      console.log(result)
      toast.success(`Processed technical document successfully. Extracted architecture profiles.`);
      
      // Redirect to technical insights page
      navigate(`/project/${projectId}/technical-insights`);
    } catch (error) {
      console.error('Error processing technical document:', error);
      toast.error('Failed to process technical document');
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {(loading || processing) && <Loader message={processing ? "Processing technical document..." : "Loading..."} />}
      
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Technical Document</h1>
          <p className="text-gray-500">
            Extract architecture patterns and technical insights from your TDD or technical documents
          </p>
        </div>
        
        <DocumentUpload
          title="Upload Technical Document"
          description="Upload your Technical Design Document (TDD) or other technical documentation to extract architecture patterns and components."
          onUpload={handleProcessTechDoc}
          isProcessing={processing}
        />
      </div>
    </div>
  );
};

export default UploadTechDoc;
