import { useState } from 'react';
// import Card, { CardContent } from './Card';
import Button from './Button';
import { addJiraToken } from '../services/api';
import { toast } from 'sonner';
import { HelpCircle } from 'lucide-react';
import CustomTooltip from './CustomTooltip';

interface JiraConnectorProps {
  projectId: string;
  onConnected: () => void;
}

const JiraConnector = ({ projectId, onConnected }: JiraConnectorProps) => {
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [jiraUrl, setJiraUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !apiToken.trim() || !jiraUrl.trim()) {
      toast.error('Please provide all required fields');
      return;
    }
    
    // Basic URL validation
    if (!jiraUrl.startsWith('https://')) {
      toast.error('Jira URL must start with https://');
      return;
    }
    
    try {
      setIsConnecting(true);
      await addJiraToken(projectId, email, apiToken, jiraUrl);
      toast.success('Jira integration connected successfully');
      onConnected();
    } catch (error) {
      console.error('Error connecting Jira:', error);
      toast.error('Failed to connect Jira integration');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="mb-6 border border-gray-100 shadow rounded-2xl p-10">
      <div>
        <h3 className="text-lg font-medium mb-4">Connect Jira Integration</h3>
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              Atlassian Email
              <CustomTooltip
                content={<p className="max-w-xs">Enter the email address associated with your Atlassian account</p>}
              >
                <span className="ml-1 cursor-help">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </span>
              </CustomTooltip>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Enter your Atlassian email address"
            />
          </div>
          
          <div>
            <label htmlFor="apiToken" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              Jira API Token
              <CustomTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>Generate an API token from your Atlassian account:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Atlassian account settings</a></li>
                      <li>Click "Create API token"</li>
                      <li>Name your token and click "Create"</li>
                      <li>Copy the token and paste it here</li>
                    </ol>
                  </div>
                }
              >
                <span className="ml-1 cursor-help">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </span>
              </CustomTooltip>
            </label>
            <input
              id="apiToken"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Enter your Jira API token"
            />
            <p className="text-xs text-gray-500 mt-1">
              Generate an API token from your 
              <a 
                href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary ml-1 hover:underline"
              >
                Atlassian Account Settings
              </a>
            </p>
          </div>
          
          <div>
            <label htmlFor="jiraUrl" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              Jira URL
              <CustomTooltip
                content={<p className="max-w-xs">Enter your Jira instance URL (e.g., https://your-domain.atlassian.net)</p>}
              >
                <span className="ml-1 cursor-help">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </span>
              </CustomTooltip>
            </label>
            <input
              id="jiraUrl"
              type="url"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="https://your-domain.atlassian.net"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Jira'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JiraConnector;
