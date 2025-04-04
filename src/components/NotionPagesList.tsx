import { useState, useEffect } from 'react';
import { getNotionPages } from '../services/api';
import { CardContent } from './Card';
import Card from './Card';
import Button from './Button';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface NotionPagesListProps {
  projectId: string;
  onSelectPage: (pageId: string, pageTitle: string) => void;
}

interface NotionPage {
  id: string;
  title: string;
}

const NotionPagesList = ({ projectId, onSelectPage }: NotionPagesListProps) => {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPages();
  }, [projectId]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await getNotionPages(projectId);
      setPages(data.pages || []);
    } catch (error) {
      console.error('Error fetching Notion pages:', error);
      toast.error('Failed to load Notion pages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Notion Pages</h3>
          <Button variant="outline" size="sm" onClick={fetchPages} disabled={loading}>
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No pages found in the connected Notion database</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pages.map((page) => (
              <li key={page.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {page.title || 'Untitled Page'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onSelectPage(page.id, page.title || 'Untitled Page')}
                  >
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default NotionPagesList;