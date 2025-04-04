import { useState, useEffect } from 'react';
import { getJiraIssues, syncJiraIssues, removeJiraToken } from '../services/api';
import Card, { CardContent } from './Card';
import Button from './Button';
import { toast } from 'sonner';
import { RefreshCw, Filter, Trash2, HelpCircle, Info } from 'lucide-react';
import CustomTooltip from './CustomTooltip';
import CustomPopover from './CustomPopover';

interface JiraIssuesListProps {
  projectId: string;
  onDisconnected: () => void;
}

const JiraIssuesList = ({ projectId, onDisconnected }: JiraIssuesListProps) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [projectKey, setProjectKey] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    statuses: '',
    issueTypes: '',
    assignee: '',
    priority: '',
    labels: ''
  });

  useEffect(() => {
    fetchIssues();
  }, [projectId]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await getJiraIssues(projectId);
      setIssues(data.issues || []);
    } catch (error) {
      console.error('Error fetching Jira issues:', error);
      toast.error('Failed to load Jira issues');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      // Parse comma-separated values into arrays
      const syncRequest: any = { project_key: projectKey || undefined };
      
      if (filters.statuses) 
        syncRequest.statuses = filters.statuses.split(',').map(s => s.trim());
      
      if (filters.issueTypes) 
        syncRequest.issue_types = filters.issueTypes.split(',').map(s => s.trim());
      
      if (filters.assignee) 
        syncRequest.assignee = filters.assignee.trim();
      
      if (filters.priority) 
        syncRequest.priority = filters.priority.trim();
      
      if (filters.labels) 
        syncRequest.labels = filters.labels.split(',').map(s => s.trim());

      await syncJiraIssues(projectId, syncRequest);
      toast.success('Jira issues sync started');
      
      // Wait a moment before fetching the updated issues
      setTimeout(fetchIssues, 2000);
    } catch (error) {
      console.error('Error syncing Jira issues:', error);
      toast.error('Failed to sync Jira issues');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Jira integration? This will remove all synced issues.')) {
      return;
    }
    
    try {
      setLoading(true);
      await removeJiraToken(projectId);
      toast.success('Jira integration disconnected');
      onDisconnected();
    } catch (error) {
      console.error('Error disconnecting Jira:', error);
      toast.error('Failed to disconnect Jira integration');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Helper function to get color class based on status
  const getStatusColorClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('closed')) {
      return 'bg-green-100 text-green-800';
    } else if (statusLower.includes('progress') || statusLower.includes('review')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower.includes('block') || statusLower.includes('hold')) {
      return 'bg-red-100 text-red-800';
    } else if (statusLower.includes('todo') || statusLower.includes('backlog') || statusLower.includes('open')) {
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-purple-100 text-purple-800'; // Default for other statuses
  };

  return (
    <div>
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-medium">Jira Issues</h3>
              <CustomPopover
                trigger={
                  <button className="ml-2 text-gray-500 hover:text-gray-700">
                    <Info className="h-4 w-4" />
                  </button>
                }
                content={
                  <div className="space-y-2">
                    <h4 className="font-medium">About Jira Sync</h4>
                    <p className="text-sm text-gray-600">
                      Sync issues from your Jira projects to keep track of them here. 
                      You can filter issues by various criteria.
                    </p>
                    <p className="text-sm text-gray-600">
                      The sync is manual - click "Sync Issues" whenever you want to update 
                      your issues from Jira.
                    </p>
                  </div>
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchIssues} 
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
                disabled={loading}
                className="text-red-600 hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Disconnect
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Sync Filters</h4>
                <CustomTooltip
                  content={
                    <div className="space-y-2 text-sm">
                      <p>These filters determine which issues to sync from Jira:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Project Key: The Jira project key (e.g., PROJ)</li>
                        <li>Statuses: Comma-separated list of issue statuses</li>
                        <li>Issue Types: Comma-separated list of issue types</li>
                        <li>Assignee: Username or email of the assignee</li>
                        <li>Priority: Single priority value</li>
                        <li>Labels: Comma-separated list of labels</li>
                      </ul>
                      <p>Leave fields blank to not filter by that criteria.</p>
                    </div>
                  }
                >
                  <span className="cursor-help">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </span>
                </CustomTooltip>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Project Key
                  </label>
                  <input
                    type="text"
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="e.g., PROJ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Statuses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={filters.statuses}
                    onChange={(e) => handleFilterChange('statuses', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="To Do, In Progress, Done"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Issue Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={filters.issueTypes}
                    onChange={(e) => handleFilterChange('issueTypes', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="Bug, Task, Story"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={filters.assignee}
                    onChange={(e) => handleFilterChange('assignee', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="Username or email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <input
                    type="text"
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="High, Medium, Low"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Labels (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={filters.labels}
                    onChange={(e) => handleFilterChange('labels', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="frontend, urgent, backend"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button 
                  onClick={handleSync} 
                  disabled={syncing}
                  size="sm"
                >
                  {syncing ? 'Syncing...' : 'Sync Issues'}
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading issues...</div>
          ) : issues.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500 mb-4">No Jira issues synced yet.</p>
              <Button onClick={handleSync} disabled={syncing}>
                {syncing ? 'Syncing...' : 'Sync Jira Issues'}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {issues.map((issue) => (
                <div key={issue.jira_key} className="py-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                          {issue.jira_key}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-md font-medium ${getStatusColorClass(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                          {issue.issue_type}
                        </span>
                      </div>
                      <h4 className="font-medium mt-1">{issue.summary}</h4>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        {issue.description ? (
                          <p className="line-clamp-2">{issue.description}</p>
                        ) : (
                          <p className="italic text-gray-400">No description</p>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {issue.labels && issue.labels.map((label: string) => (
                          <span key={label} className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {label}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        {issue.assignee && (
                          <span className="mr-3">Assignee: {issue.assignee}</span>
                        )}
                        {issue.priority && (
                          <span className="mr-3">Priority: {issue.priority}</span>
                        )}
                        <span>Updated: {new Date(issue.updated_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JiraIssuesList;
