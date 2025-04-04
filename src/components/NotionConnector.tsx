import { useState } from 'react';
import Card from './Card';
import { CardContent } from './Card';
import Button from './Button';
import { connectNotionIntegration } from '../services/api';
import { toast } from 'sonner';

interface NotionConnectorProps {
  projectId: string;
  onConnected: () => void;
}

const NotionConnector = ({ projectId, onConnected }: NotionConnectorProps) => {
  const [databaseId, setDatabaseId] = useState('');
  const [internalToken, setInternalToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!databaseId.trim() || !internalToken.trim()) {
      toast.error('Please provide both Database ID and Internal Integration Token');
      return;
    }
    
    try {
      setIsConnecting(true);
      await connectNotionIntegration(projectId, databaseId, internalToken);
      toast.success('Notion integration connected successfully');
      onConnected();
    } catch (error) {
      console.error('Error connecting Notion:', error);
      toast.error('Failed to connect Notion integration');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <h3 className="text-lg font-medium mb-4">Connect Notion Integration</h3>
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="databaseId" className="block text-sm font-medium text-gray-700 mb-1">
              Notion Database ID
            </label>
            <input
              id="databaseId"
              type="text"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Enter your Notion database ID"
            />
          </div>
          
          <div>
            <label htmlFor="internalToken" className="block text-sm font-medium text-gray-700 mb-1">
              Notion Internal Integration Token
            </label>
            <input
              id="internalToken"
              type="password"
              value={internalToken}
              onChange={(e) => setInternalToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Enter your Notion integration token"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Notion'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotionConnector;
