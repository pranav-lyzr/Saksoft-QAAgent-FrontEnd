import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateTests } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import { CardContent } from '../components/Card';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import { ArrowLeft, Database, Shield, Code, FileText, ClipboardList } from 'lucide-react';

type TestType = 'api' | 'database' | 'security' | 'story' | 'architecture';

const testTypes = [
  { 
    id: 'api' as TestType, 
    name: 'API Tests', 
    description: 'Generate tests for your API endpoints',
    icon: <Code className="h-6 w-6 text-blue-500" /> 
  },
  { 
    id: 'database' as TestType, 
    name: 'Database Tests', 
    description: 'Generate tests for database operations',
    icon: <Database className="h-6 w-6 text-green-500" /> 
  },
  { 
    id: 'security' as TestType, 
    name: 'Security Tests', 
    description: 'Generate security and vulnerability tests',
    icon: <Shield className="h-6 w-6 text-red-500" /> 
  },
  { 
    id: 'story' as TestType, 
    name: 'User Story Tests', 
    description: 'Generate tests based on user stories',
    icon: <FileText className="h-6 w-6 text-purple-500" /> 
  },
  { 
    id: 'architecture' as TestType, 
    name: 'Architecture Tests', 
    description: 'Generate tests for architectural patterns',
    icon: <ClipboardList className="h-6 w-6 text-orange-500" /> 
  }
];

interface TestCaseResult {
  id: string;
  name: string;
  description: string;
  steps: string[];
  expected_result?: string;
  expected_results?: string;
  priority: string;
  category: string;
}

const GenerateTests = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loading, setLoading } = useProject();
  const [generatingType, setGeneratingType] = useState<TestType | null>(null);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);

  const handleGenerateTests = async (testType: TestType) => {
    if (!projectId) return;
    
    try {
      setGeneratingType(testType);
      setLoading(true);
      
      const result = await generateTests(projectId, testType);
      
      if (Array.isArray(result.tests)) {
        setTestResults(result.tests);
        toast.success(`${testType.charAt(0).toUpperCase() + testType.slice(1)} tests generated successfully`);
      } else {
        toast.error('Invalid test data format received');
        console.error('Invalid test data format:', result);
      }
    } catch (error) {
      console.error(`Error generating ${testType} tests:`, error);
      toast.error(`Failed to generate ${testType} tests`);
    } finally {
      setGeneratingType(null);
      setLoading(false);
    }
  };

  const renderTestCase = (testCase: TestCaseResult) => {
    // Handle either expected_result or expected_results key
    const expectedResult = testCase.expected_result || testCase.expected_results || 'No expected result specified';
    
    return (
      <Card key={testCase.id} className="mb-4 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{testCase.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  testCase.priority === 'High' ? 'bg-red-100 text-red-700' :
                  testCase.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {testCase.priority}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-3">ID: {testCase.id}</div>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
              {testCase.category}
            </span>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-600">{testCase.description}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Steps</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              {testCase.steps.map((step, index) => (
                <li key={index} className="pl-1">
                  {typeof step === 'string' ? step : `Step ${index + 1}`}
                </li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Expected Result</h4>
            <p className="text-sm text-gray-600">{expectedResult}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {loading && <Loader message={`Generating ${generatingType} tests...`} />}
      
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Specialized Tests</h1>
          <p className="text-gray-500">
            Create specific test suites for different aspects of your application
          </p>
        </div>
        
        {!testResults ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {testTypes.map((type) => (
              <Card 
                key={type.id}
                className="cursor-pointer hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-2 rounded-full bg-gray-50 mr-3">
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleGenerateTests(type.id)}
                    className="w-full mt-2"
                    variant="outline"
                  >
                    Generate {type.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900">Test Results</h2>
              <Button
                onClick={() => setTestResults(null)}
                variant="outline"
                size="sm"
              >
                Generate Another Test
              </Button>
            </div>
            
            <div className="space-y-4">
              {testResults.length > 0 ? (
                testResults.map((testCase) => renderTestCase(testCase))
              ) : (
                <Card className="p-6 text-center">
                  <div className="text-amber-500 mb-4">
                    <Shield className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Cases Available</h3>
                  <p className="text-gray-500">
                    Try adding more project information or selecting a different test type.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateTests;