import { BookOpen, Code } from 'lucide-react';

interface UserStory {
  id: string;
  text: string;
  analysis_result?: {
    title?: string;
    description?: string;
    priority?: string;
    topics?: string[];
    category?: string;
  };
}

interface TechnicalInsight {
  id: string;
  text: string;
  analysis_result?: any;
}

interface NotionAnalysisResultsProps {
  userStories: UserStory[];
  technicalInsights: TechnicalInsight[];
}

const NotionAnalysisResults = ({ 
  userStories, 
  technicalInsights 
}: NotionAnalysisResultsProps) => {
  return (
    <div className="space-y-6">
      {/* User Stories Section */}
      <div>
        <h3 className="text-lg font-medium flex items-center mb-4">
          <BookOpen className="h-5 w-5 mr-2 text-blue-500" /> User Stories
        </h3>
        {userStories && userStories.length > 0 ? (
          <div className="space-y-4">
            {userStories.map((story) => (
              <div key={story.id} className="p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-gray-800 mb-2">{story.text}</p>
                {story.analysis_result && (
                  <div className="mt-2">
                    {story.analysis_result.priority && (
                      <span className="inline-block px-2 py-1 mr-2 mt-1 text-xs rounded-full bg-purple-100 text-purple-700">
                        {story.analysis_result.priority}
                      </span>
                    )}
                    {story.analysis_result.category && (
                      <span className="inline-block px-2 py-1 mr-2 mt-1 text-xs rounded-full bg-green-100 text-green-700">
                        {story.analysis_result.category}
                      </span>
                    )}
                    {story.analysis_result.topics && story.analysis_result.topics.map((topic, i) => (
                      <span key={i} className="inline-block px-2 py-1 mr-2 mt-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No user stories found</p>
        )}
      </div>

      {/* Technical Insights Section */}
      <div>
        <h3 className="text-lg font-medium flex items-center mb-4">
          <Code className="h-5 w-5 mr-2 text-amber-500" /> Technical Insights
        </h3>
        {technicalInsights && technicalInsights.length > 0 ? (
          <div className="space-y-4">
            {technicalInsights.map((insight) => (
              <div key={insight.id} className="p-4 bg-amber-50 rounded-md border border-amber-100">
                <p className="text-gray-800">{insight.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No technical insights found</p>
        )}
      </div>
    </div>
  );
};

export default NotionAnalysisResults;
