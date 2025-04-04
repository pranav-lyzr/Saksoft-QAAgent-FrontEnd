import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import JiraConnector from '../components/JiraConnector';
import JiraIssuesList from '../components/JiraIssuesList';
import Loader from '../components/Loader';
import { getProject } from '../services/api';
import { toast } from 'sonner';
import { HelpCircle, ExternalLink } from 'lucide-react';
import CustomTooltip from '../components/CustomTooltip';

const JiraIntegration = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { loading: projectLoading } = useProject();
  const [loading, setLoading] = useState(true);
  const [hasJiraIntegration, setHasJiraIntegration] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    checkJiraIntegration();
  }, [projectId]);

  const checkJiraIntegration = async () => {
    try {
      setLoading(true);
      const project = await getProject(projectId!);
      setHasJiraIntegration(!!project.jira_integration);
    } catch (error) {
      console.error('Error checking Jira integration:', error);
      toast.error('Failed to check Jira integration status');
    } finally {
      setLoading(false);
    }
  };

  const handleJiraConnected = () => {
    setHasJiraIntegration(true);
  };

  const handleJiraDisconnected = () => {
    setHasJiraIntegration(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 px-6">
      {(loading || projectLoading) && <Loader />}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Jira Integration</h1>
            <CustomTooltip 
              content={
                <div className="space-y-2">
                  <p className="font-medium">What is Jira Integration?</p>
                  <p>This feature allows you to connect your Atlassian Jira account and sync issues to this project.</p>
                </div>
              }
              side="right"
            >
              <span className="ml-2 cursor-help">
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </span>
            </CustomTooltip>
          </div>
          <p className="text-gray-500">
            Connect your project with Jira to sync issues and streamline your workflow.
          </p>
        </div>
        
        {!loading && (
          hasJiraIntegration ? (
            <JiraIssuesList 
              projectId={projectId!} 
              onDisconnected={handleJiraDisconnected} 
            />
          ) : (
            <JiraConnector 
              projectId={projectId!} 
              onConnected={handleJiraConnected} 
            />
          )
        )}
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-center mb-2">
            <h3 className="text-md font-medium text-blue-800">About Jira Integration</h3>
            <a 
              href="https://support.atlassian.com/jira-software-cloud/docs/what-is-jira-software/" 
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
            >
              Learn more <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          <p className="text-sm text-blue-700">
            This integration allows you to connect your project with Atlassian Jira. 
            To get started, you'll need:
          </p>
          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Your Atlassian account email address</li>
            <li>A Jira API token (can be created in your Atlassian account security settings)</li>
            <li>Your Jira instance URL (e.g., https://your-domain.atlassian.net)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JiraIntegration;
