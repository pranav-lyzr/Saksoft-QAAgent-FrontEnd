import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import { 
  Github, FileText, Code, 
  Upload, CodeSquare
} from 'lucide-react';
import notion from "../assets/notion.png";



const JiraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 pt-1 text-blue-500">
    <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0z"/>
  </svg>
);

// interface ProjectItem {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   path: string;
//   highlight?: boolean;
//   new?: boolean;
// }

const ProjectDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  // const navigate = useNavigate();
  const { setCurrentProject, loading, setLoading } = useProject();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProject(projectId);
        
        setProject(data);
        setCurrentProject({
          id: projectId,
          name: data.name
        });
        
        localStorage.setItem('currentProject', JSON.stringify({
          id: projectId,
          name: data.name
        }));
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);

  const sections = [
    {
      title: 'Testing',
      items: [
        // {
        //   title: 'Test Plan',
        //   description: 'Generate and view comprehensive test plans',
        //   icon: <ClipboardList className="h-6 w-6" />,
        //   path: `/project/${projectId}/test-plan`
        // },
        {
          title: 'Generate Tests',
          description: 'Create specialized test suites',
          icon: <CodeSquare className="h-6 w-6 text-green-400" />,
          path: `/project/${projectId}/generate-tests`,
          new: true
        }
      ]
    },
    {
      title: 'Project Requirements',
      items: [
        {
          title: 'User Stories',
          description: 'Add and analyze user stories',
          icon: <FileText className="h-6 w-6 text-red-500" />,
          path: `/project/${projectId}/user-stories`
        },
        {
          title: 'Upload PRD',
          description: 'Extract user stories from PRD',
          icon: <Upload className="h-6 w-6 text-blue-500" />,
          path: `/project/${projectId}/upload-prd`,
          new: true
        },
        {
          title: 'Notion Integration',
          description: 'Import user stories from Notion',
          icon:  <img src={notion} alt="Notion" className="h-6 w-6" />,
          path: `/project/${projectId}/notion-integration`,
          new: true
        },
        {
          title: 'Jira Integration',
          description: 'Sync issues from Jira',
          icon: <JiraIcon />,
          path: `/project/${projectId}/jira-integration`,
          new: true
        },
        {
          title: 'Technical Insights',
          description: 'Add technical requirements',
          icon: <Code className="h-6 w-6 text-violet-500" />,
          path: `/project/${projectId}/technical-insights`
        },
        {
          title: 'Upload Technical Docs',
          description: 'Extract architecture from TDD',
          icon: <Upload className="h-6 w-6 text-yellow-500" />,
          path: `/project/${projectId}/upload-tech-doc`,
          new: true
        }
      ]
    },
    {
      title: 'Project Setup',
      items: [
        {
          title: 'Repository',
          description: 'Connect to your GitHub repository',
          icon: <Github className="h-6 w-6 text-indigo-500" />,
          path: `/project/${projectId}/repository`,
          highlight: !project?.repository_url
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {loading && <Loader />}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
          <p className="text-gray-500">
            Manage your project settings, user stories, and test plans
          </p>
        </div>
        
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8 animate-slide-up" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
            <h2 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className="block"
                >
                  <Card className={`p-6 hover:shadow-md transition-shadow h-full`}>
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-gray-500/10 mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                          
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDashboard;