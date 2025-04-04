import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, addGithubRepo } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'sonner';
import { Github, ArrowLeft, Trash } from 'lucide-react';

const Repository = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [githubUrl, setGithubUrl] = useState('');
  const [repositories, setRepositories] = useState<string[]>([]);
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const data = await getProject(projectId);
        setRepositories(data.github_links || []);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project repositories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  const validateGithubUrl = (url: string) => {
    const pattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return pattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubUrl.trim()) {
      toast.error('Please enter a GitHub repository URL');
      return;
    }
    
    if (!validateGithubUrl(githubUrl)) {
      setIsValidUrl(false);
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }
    
    try {
      setLoading(true);
      await addGithubRepo(projectId!, githubUrl);
      
      // Update the repositories list
      setRepositories(prev => [...prev, githubUrl]);
      
      // Clear the input
      setGithubUrl('');
      setIsValidUrl(true);
      
      toast.success('Repository added successfully');
    } catch (error) {
      console.error('Error adding repository:', error);
      toast.error('Failed to add repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {loading && <Loader message="Processing repository..." />}
      
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GitHub Repositories</h1>
          <p className="text-gray-500">
            Add GitHub repositories to analyze the codebase and generate test plans
          </p>
        </div>
        
        <Card className="p-6 mb-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                GitHub Repository URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Github className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="githubUrl"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    setIsValidUrl(true);
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200 ${
                    isValidUrl ? 'border-gray-200' : 'border-red-300 bg-red-50'
                  }`}
                  placeholder="https://github.com/username/repository"
                />
              </div>
              {!isValidUrl && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-500/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2"
              disabled={loading}
            >
              Add Repository
            </button>
          </form>
        </Card>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Added Repositories</h2>
          
          {repositories.length === 0 ? (
            <EmptyState
              title="No repositories added"
              description="Add a GitHub repository above to get started with code analysis."
              icon={<Github className="h-12 w-12" />}
            />
          ) : (
            <div className="space-y-3">
              {repositories.map((repo, index) => (
                <Card key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Github className="h-5 w-5 text-gray-500 mr-3" />
                    <a 
                      href={repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:underline truncate max-w-md"
                    >
                      {repo.replace('https://github.com/', '')}
                    </a>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Remove repository"
                    onClick={() => toast.info('Repository removal will be available in a future update')}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repository;
