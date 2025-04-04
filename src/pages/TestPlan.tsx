import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateTestPlan } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Repeat, ChevronDown, ChevronUp } from 'lucide-react';

interface TestPlanItem {
  id: string;
  content: string;
  createdAt: string;
  isExpanded: boolean;
}

const TestPlan = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [testPlans, setTestPlans] = useState<TestPlanItem[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Fetch existing test plans when component mounts
    const fetchTestPlans = async () => {
      if (!projectId) return;

      try {
        const response = await fetch(`http://localhost:8001/project/${projectId}/test-plans`);
        const data = await response.json();
        
        // Transform fetched data into TestPlanItem format
        const formattedPlans = data.test_plans.map((plan: any) => ({
          id: plan._id || crypto.randomUUID(),
          content: plan.test_plan,
          createdAt: plan.timestamp || new Date().toISOString(),
          isExpanded: false
        }));

        setTestPlans(formattedPlans);
      } catch (error) {
        console.error('Error fetching test plans:', error);
        toast.error('Failed to fetch test plans');
      }
    };

    fetchTestPlans();
  }, [projectId]);

  const handleGenerateTestPlan = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setGenerating(true);
      const data = await generateTestPlan(projectId);
      
      if (data.error) {
        toast.error(data.error);
      } else {
        const newTestPlan: TestPlanItem = {
          id: crypto.randomUUID(),
          content: data.test_plan,
          createdAt: new Date().toISOString(),
          isExpanded: false
        };

        setTestPlans(prevPlans => [newTestPlan, ...prevPlans]);
        toast.success('Test plan generated successfully');
      }
    } catch (error) {
      console.error('Error generating test plan:', error);
      toast.error('Failed to generate test plan');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const toggleTestPlanExpand = (id: string) => {
    setTestPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === id 
          ? { ...plan, isExpanded: !plan.isExpanded } 
          : plan
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {loading && <Loader message="Loading..." />}
      {generating && <Loader message="Generating test plan..." />}

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>

        <div className="mb-8 animate-slide-up flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Plans</h1>
            <p className="text-gray-500">
              Generate and view comprehensive test plans based on project analysis
            </p>
          </div>
          <button
            onClick={handleGenerateTestPlan}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
            disabled={generating}
          >
            <Repeat className="h-4 w-4 mr-2" />
            Regenerate
          </button>
        </div>

        {testPlans.length === 0 ? (
          <div className="text-center p-12 animate-scale-in">
            <EmptyState
              title="No test plans generated yet"
              description="Generate a test plan based on your user stories and technical insights"
              icon={<FileText className="h-12 w-12" />}
              action={
                <button
                  onClick={handleGenerateTestPlan}
                  className="mt-4 px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-500/90 transition-colors"
                  disabled={generating}
                >
                  Generate Test Plan
                </button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            {testPlans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`p-6 shadow-md relative ${index === 0 ? 'animate-fade-in' : ''}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    Generated on: {new Date(plan.createdAt).toLocaleString()}
                  </div>
                  <button 
                    onClick={() => toggleTestPlanExpand(plan.id)}
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    {plan.isExpanded ? (
                      <>
                        Collapse <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Expand <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>

                {plan.isExpanded ? (
                  <MarkdownRenderer content={plan.content} />
                ) : (
                  <div className="line-clamp-3 text-gray-700 opacity-70">
                    {plan.content.split('\n').slice(0, 3).join('\n')}...
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPlan;