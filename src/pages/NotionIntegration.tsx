import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import NotionConnector from '../components/NotionConnector';
import NotionPagesList from '../components/NotionPagesList';
import NotionPageContent from '../components/NotionPageContent';
import Loader from '../components/Loader';
import { getProject } from '../services/api';
import { ArrowLeft } from 'lucide-react';

const NotionIntegration = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPageTitle, setSelectedPageTitle] = useState('');

  useEffect(() => {
    if (!projectId) return;
    
    const checkIntegration = async () => {
      try {
        setLoading(true);
        const data = await getProject(projectId);
        setIsConnected(!!data.notion_integration);
      } catch (error) {
        console.error('Error checking integration:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkIntegration();
  }, [projectId]);

  const handleConnected = () => {
    setIsConnected(true);
  };

  const handleSelectPage = (pageId: string, pageTitle: string) => {
    setSelectedPageId(pageId);
    setSelectedPageTitle(pageTitle);
  };

  const handleBackToPages = () => {
    setSelectedPageId(null);
    setSelectedPageTitle('');
  };

  const handleUserStoryAdded = () => {
    // Optionally navigate to the user stories page after adding
    // navigate(`/project/${projectId}/user-stories`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {loading && <Loader message="Loading Notion integration..." />}
      
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notion Integration</h1>
          <p className="text-gray-500">
            Connect to Notion and import user stories from your workspace
          </p>
        </div>
        
        {!isConnected ? (
          <NotionConnector projectId={projectId!} onConnected={handleConnected} />
        ) : selectedPageId ? (
          <NotionPageContent 
            projectId={projectId!} 
            pageId={selectedPageId}
            pageTitle={selectedPageTitle}
            onBack={handleBackToPages}
            onUserStoryAdded={handleUserStoryAdded}
          />
        ) : (
          <NotionPagesList 
            projectId={projectId!} 
            onSelectPage={handleSelectPage} 
          />
        )}
      </div>
    </div>
  );
};

export default NotionIntegration;