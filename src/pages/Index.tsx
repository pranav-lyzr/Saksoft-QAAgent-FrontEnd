import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import CreateProject from './CreateProject';

const Index = () => {
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useProject();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored project in localStorage
    const storedProject = localStorage.getItem('currentProject');
    
    if (storedProject) {
      try {
        const projectData = JSON.parse(storedProject);
        setCurrentProject(projectData);
        navigate(`/project/${projectData.id}`);
      } catch (error) {
        console.error('Error parsing stored project:', error);
        localStorage.removeItem('currentProject');
      }
    }
    
    setLoading(false);
  }, [setCurrentProject, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {currentProject ? (
        <h1>Welcome back to {currentProject.name}!</h1>
      ) : (
        <CreateProject />
      )}
    </div>
  );
};

export default Index;
