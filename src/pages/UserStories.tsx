import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createUserStory, getUserStories, analyzeUserStories } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'sonner';
import { 
  FileText, ArrowLeft, AlertTriangle, CheckCircle, Tag, Zap, 
  Users, Layers, Puzzle, Clock 
} from 'lucide-react';

// Helper function to format timestamp
const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Component to render story analysis details
const StoryAnalysisDetails = ({ story }: { story: any }) => (
  <div className="space-y-4">
    {/* Title and Description */}
    {/* <Card className="p-4">
      <div className="flex items-center mb-3">
        <BookOpen className="h-4 w-4 mr-2 text-green-500" />
        <h4 className="text-sm font-semibold text-gray-700">Title & Description</h4>
      </div>
      <div>
        <p className="text-sm text-gray-800 font-medium">{story.analysis_result.title || 'N/A'}</p>
        <p className="text-xs text-gray-600 mt-1">{story.analysis_result.description || 'No description available'}</p>
      </div>
    </Card> */}

    {/* Analysis Grid */}
    <div className="grid grid-cols-2 gap-4">
      {/* Category */}
      <Card className="p-4">
        <div className="flex items-center mb-2">
          <Tag className="h-4 w-4 mr-2 text-blue-500" />
          <h4 className="text-sm font-semibold text-gray-700">Category</h4>
        </div>
        <p className="text-xs text-gray-600">
          {story.analysis_result.category || 'N/A'}
        </p>
      </Card>
      
      {/* Priority */}
      <Card className="p-4">
        <div className="flex items-center mb-2">
          <Zap className="h-4 w-4 mr-2 text-purple-500" />
          <h4 className="text-sm font-semibold text-gray-700">Priority</h4>
        </div>
        <p className={`text-xs font-medium ${
          story.analysis_result.priority === 'high' 
            ? 'text-red-600' 
            : story.analysis_result.priority === 'medium' 
            ? 'text-yellow-600' 
            : 'text-green-600'
        }`}>
          {story.analysis_result.priority?.toUpperCase() || 'N/A'}
        </p>
      </Card>
    </div>

    {/* User Role */}
    <Card className="p-4">
      <div className="flex items-center mb-3">
        <Users className="h-4 w-4 mr-2 text-teal-500" />
        <h4 className="text-sm font-semibold text-gray-700">User Role</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {story.analysis_result.user_role && (
          <span className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded-full">
            {story.analysis_result.user_role}
          </span>
        )}
      </div>
    </Card>
    
    {/* Topics */}
    <Card className="p-4">
      <div className="flex items-center mb-3">
        <Layers className="h-4 w-4 mr-2 text-indigo-500" />
        <h4 className="text-sm font-semibold text-gray-700">Topics</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {story.analysis_result.topics?.map((topic: string, idx: number) => (
          <span 
            key={idx} 
            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>
    </Card>

    {/* Features */}
    <Card className="p-4">
      <div className="flex items-center mb-3">
        <Puzzle className="h-4 w-4 mr-2 text-orange-500" />
        <h4 className="text-sm font-semibold text-gray-700">Features</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {story.analysis_result.features?.map((feature: string, idx: number) => (
          <span 
            key={idx} 
            className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full"
          >
            {feature}
          </span>
        ))}
      </div>
    </Card>

    {/* Original Text */}
    {/* <Card className="p-4">
      <div className="flex items-center mb-3">
        <ListCheck className="h-4 w-4 mr-2 text-pink-500" />
        <h4 className="text-sm font-semibold text-gray-700">Original Text</h4>
      </div>
      <p className="text-xs text-gray-600 italic">
        "{story.analysis_result.original_text || story.text}"
      </p>
    </Card> */}
  </div>
);

const UserStories = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [userStoryText, setUserStoryText] = useState('');
  const [userStories, setUserStories] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (!projectId) return;
    
    const fetchUserStories = async () => {
      try {
        setLoading(true);
        const data = await getUserStories(projectId);
        setUserStories(data.stories || []);
      } catch (error) {
        console.error('Error fetching user stories:', error);
        toast.error('Failed to load user stories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStories();
  }, [projectId]);

  // Sort user stories based on the selected order
  const sortedUserStories = [...userStories].sort((a, b) => {
    const getTimestamp = (story: any) => story.analyzed 
      ? (story.analysis_result?.created_at || story.created_at)
      : story.created_at;

    return sortOrder === 'newest'
      ? getTimestamp(b) - getTimestamp(a)
      : getTimestamp(a) - getTimestamp(b);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userStoryText.trim()) {
      toast.error('Please enter a user story');
      return;
    }
    
    try {
      setLoading(true);
      const response = await createUserStory(projectId!, userStoryText);
      
      setUserStories(prev => [...prev, {
        id: response.story_id,
        text: userStoryText,
        analyzed: false,
        project_id: projectId,
        created_at: Date.now() / 1000
      }]);
      
      setUserStoryText('');
      
      toast.success('User story added successfully');
    } catch (error) {
      console.error('Error adding user story:', error);
      toast.error('Failed to add user story');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeStories = async () => {
    if (!projectId) return;
    
    try {
      setAnalyzing(true);
      await analyzeUserStories(projectId);
      
      toast.success('Analysis started successfully');
      
      setTimeout(async () => {
        try {
          const data = await getUserStories(projectId);
          setUserStories(data.stories || []);
        } catch (error) {
          console.error('Error fetching updated user stories:', error);
        } finally {
          setAnalyzing(false);
        }
      }, 5000);
    } catch (error) {
      console.error('Error analyzing user stories:', error);
      toast.error('Failed to analyze user stories');
      setAnalyzing(false);
    }
  };

  const countAnalyzedStories = () => {
    return userStories.filter(story => story.analyzed).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-30 pb-12 px-6">
      {(loading || analyzing) && (
        <Loader 
          message={loading ? "Processing user story..." : "Analyzing user stories..."} 
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="items-center mb-8">
          <button 
            onClick={() => navigate(`/project/${projectId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors mb-5"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Stories</h1>
            <p className="text-gray-500 text-sm">Add and analyze stories for your project</p>
          </div>
        </div>
        
        <Card className="p-6 mb-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userStoryText" className="block text-sm font-medium text-gray-700">
                User Story
              </label>
              <textarea
                id="userStoryText"
                value={userStoryText}
                onChange={(e) => setUserStoryText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200"
                placeholder="As a [type of user], I want [an action] so that [a benefit/a value]"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-500/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2"
              disabled={loading}
            >
              Add User Story
            </button>
          </form>
        </Card>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Added User Stories</h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort:</span>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {userStories.length > 0 && (
                <button
                  onClick={handleAnalyzeStories}
                  disabled={userStories.length === 0 || analyzing}
                  className="px-4 py-2 text-sm bg-secondary text-gray-700 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Analyze All Stories
                </button>
              )}
            </div>
          </div>
          
          {userStories.length === 0 ? (
            <EmptyState
              title="No user stories added"
              description="Add user stories above to start creating your test plan."
              icon={<FileText className="h-12 w-12" />}
            />
          ) : (
            <div className="space-y-4">
              {sortedUserStories.map((story) => (
                <Card 
                  key={story.id} 
                  className={`p-6 border transition-all duration-300 ${
                    story.analyzed 
                    ? 'border-green-100 bg-green-50/30' 
                    : 'border-amber-100 bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${story.analyzed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {story.analyzed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertTriangle className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-gray-800 mb-3">{story.text}</p>
                      
                      {/* Timeline Section */}
                      <Card className="p-4 mb-4">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <h4 className="text-sm font-semibold text-gray-700">Timeline</h4>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Created:</span>{' '}
                            {formatTimestamp(story.created_at)}
                          </div>
                          {story.analyzed && story.analysis_result && (
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Analyzed:</span>{' '}
                              {formatTimestamp(story.analysis_result.created_at || story.created_at)}
                            </div>
                          )}
                        </div>
                      </Card>
                      
                      {/* Analysis Details */}
                      {story.analyzed && story.analysis_result && (
                        <StoryAnalysisDetails story={story} />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {userStories.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {countAnalyzedStories()} of {userStories.length} stories analyzed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStories;