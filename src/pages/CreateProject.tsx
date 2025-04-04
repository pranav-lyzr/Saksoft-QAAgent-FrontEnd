import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, getProjects } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { toast } from 'sonner';

interface Project {
  project_id: string;
  name: string;
}

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExisting, setShowExisting] = useState(false);
  const { setCurrentProject, loading, setLoading } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProjects();
        setExistingProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load existing projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    
    try {
      setLoading(true);
      const response = await createProject(projectName);
      
      setCurrentProject({
        id: response.project_id,
        name: projectName
      });
      
      localStorage.setItem('currentProject', JSON.stringify({
        id: response.project_id,
        name: projectName
      }));
      
      toast.success('Project created successfully');
      navigate(`/project/${response.project_id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const selectExistingProject = (project: Project) => {
    setCurrentProject({
      id: project.project_id,
      name: project.name
    });
    
    localStorage.setItem('currentProject', JSON.stringify({
      id: project.project_id,
      name: project.name
    }));
    
    toast.success(`Switched to project: ${project.name}`);
    navigate(`/project/${project.project_id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      {(loading || isLoading) && <Loader message={loading ? "Creating your project..." : "Loading projects..."} />}
      
      <div className="w-full max-w-3xl animate-scale-in">
        <div className="flex space-x-4 mb-6">
          <button
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${!showExisting ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setShowExisting(false)}
          >
            Create New Project
          </button>
          <button
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${showExisting ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setShowExisting(true)}
          >
            Select Existing Project
          </button>
        </div>
        
        {!showExisting ? (
          <Card className="w-full p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create a New Project</h1>
              <p className="text-gray-500">Start your QA journey by creating a new testing project</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200"
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-500/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2"
                disabled={loading}
              >
                Create Project
              </button>
            </form>
          </Card>
        ) : (
          <Card className="w-full p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Select an Existing Project</h1>
              <p className="text-gray-500">Continue working on one of your existing QA projects</p>
            </div>
            
            {existingProjects.length > 0 ? (
              <div className="space-y-3">
                {existingProjects.map((project) => (
                  <div 
                    key={project.project_id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-sm cursor-pointer transition-all"
                    onClick={() => selectExistingProject(project)}
                  >
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {project.project_id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No existing projects found.</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateProject;