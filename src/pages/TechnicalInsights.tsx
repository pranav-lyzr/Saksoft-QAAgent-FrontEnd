import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTechnicalInsight, getTechnicalInsights, analyzeTechnicalInsights } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'sonner';
import { Code, ArrowLeft, CheckCircle, FileText, Server, Layers, Component  } from 'lucide-react';

const TechnicalInsights = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [insightText, setInsightText] = useState('');
  const [insights, setInsights] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const data = await getTechnicalInsights(projectId);
        console.log("Data",data);
        setInsights(data.insights || []);
      } catch (error) {
        console.error('Error fetching technical insights:', error);
        toast.error('Failed to load technical insights');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!insightText.trim()) {
      toast.error('Please enter a technical insight');
      return;
    }
    
    try {
      setLoading(true);
      const response = await createTechnicalInsight(projectId!, insightText);
      
      // Add the new insight to the list
      setInsights(prev => [...prev, {
        _id: response.insight_id,
        text: insightText,
        analyzed: false,
        analysis_result: null,
        project_id: projectId
      }]);
      
      // Clear the input
      setInsightText('');
      
      toast.success('Technical insight added successfully');
    } catch (error) {
      console.error('Error adding technical insight:', error);
      toast.error('Failed to add technical insight');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeInsights = async () => {
    if (!projectId) return;
    
    try {
      setAnalyzing(true);
      await analyzeTechnicalInsights(projectId);
      
      toast.success('Analysis started successfully');
      
      // Wait a bit then fetch updated insights
      setTimeout(async () => {
        try {
          const data = await getTechnicalInsights(projectId);
          setInsights(data.insights || []);
        } catch (error) {
          console.error('Error fetching updated insights:', error);
        } finally {
          setAnalyzing(false);
        }
      }, 5000); // Wait 5 seconds before refreshing
    } catch (error) {
      console.error('Error analyzing technical insights:', error);
      toast.error('Failed to analyze technical insights');
      setAnalyzing(false);
    }
  };

  const countAnalyzedInsights = () => {
    return insights.filter(insight => insight.analyzed).length;
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-red-50 text-red-600';
      case 'medium': return 'bg-yellow-50 text-yellow-600';
      case 'low': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };
  
  const getComplexityColor = (complexity: 'high' | 'medium' | 'low') => {
    switch (complexity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {loading && <Loader message="Processing technical insight..." />}
      {analyzing && <Loader message="Analyzing technical insights..." />}
      
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Technical Insights</h1>
          <p className="text-gray-500">
            Add technical details about your project to enhance test plan generation
          </p>
        </div>
        
        <Card className="p-6 mb-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="insightText" className="block text-sm font-medium text-gray-700">
                Technical Insight
              </label>
              <textarea
                id="insightText"
                value={insightText}
                onChange={(e) => setInsightText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200"
                placeholder="Add technical details such as architecture, frameworks, performance requirements, etc."
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-500/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2"
              disabled={loading}
            >
              Add Technical Insight
            </button>
          </form>
        </Card>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Added Technical Insights</h2>
            
            {insights.length > 0 && (
              <button
                onClick={handleAnalyzeInsights}
                disabled={insights.length === 0 || analyzing}
                className="px-4 py-2 text-sm bg-secondary text-gray-700 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Analyze All Insights
              </button>
            )}
          </div>
          
          {insights.length === 0 ? (
            <EmptyState
              title="No technical insights added"
              description="Add technical insights above to enhance your test plan generation."
              icon={<Code className="h-12 w-12" />}
            />
          ) : (
            <div className="space-y-3">
              {insights.map((insight) => {
                // Skip insights without analysis if they haven't been analyzed
                if (!insight.analyzed || !insight.analysis_result) {
                  return (
                    <div 
                      key={insight._id} 
                      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-5"
                    >
                      <p className="text-gray-600">{insight.text}</p>
                      <div className="mt-3 text-sm text-yellow-600">
                        Pending Analysis
                      </div>
                    </div>
                  );
                }

                // Render analyzed insights
                return (
                  <div 
                    key={insight._id} 
                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                  >
                    {/* Insight Header */}
                    <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">
                          {insight.analysis_result.title}
                        </h2>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.analysis_result.impact)}`}>
                        Impact: {insight.analysis_result.impact.toUpperCase()}
                      </div>
                    </div>

                    {/* Insight Body */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{insight.text}</p>

                      {/* Analysis Details Grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              Description
                            </h3>
                            <p className="text-gray-700">{insight.analysis_result.description}</p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                              <Server className="h-4 w-4 mr-2 text-purple-500" />
                              Technical Details
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Level:</span>
                                <span className="font-medium">{insight.analysis_result.level}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium">{insight.analysis_result.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                              <Layers className="h-4 w-4 mr-2 text-green-500" />
                              Tech Areas
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {insight.analysis_result.tech_areas.map((area: string, idx: number) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                              <Component className="h-4 w-4 mr-2 text-green-500" />
                              Components
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {insight.analysis_result.components.map((area: string, idx: number) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                              Implementation Details
                            </h3>
                            <div className={`px-3 py-2 rounded-lg text-sm ${getComplexityColor(insight.analysis_result.implementation_complexity)}`}>
                              Complexity: {insight.analysis_result.implementation_complexity.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          
          {insights.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {countAnalyzedInsights()} of {insights.length} insights analyzed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalInsights;