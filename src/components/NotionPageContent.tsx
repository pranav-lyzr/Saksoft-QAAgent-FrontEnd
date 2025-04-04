import { useState, useEffect } from 'react';
import { getNotionPageContent, analyzeNotionPage } from '../services/api';
import { CardContent } from './Card';
import Card from './Card';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import NotionPageDialog from './NotionPageDialog';
import NotionAnalysisResults from './NotionAnalysisResults';

interface NotionPageContentProps {
  projectId: string;
  pageId: string;
  pageTitle: string;
  onBack: () => void;
  onUserStoryAdded?: () => void;
}

interface NotionBlock {
  id: string;
  type: string;
  paragraph?: {
    rich_text: {
      plain_text: string;
    }[];
  };
  // Add other block types as needed
}

const NotionPageContent = ({ 
  projectId, 
  pageId, 
  pageTitle,
  onBack,
  onUserStoryAdded 
}: NotionPageContentProps) => {
  const [content, setContent] = useState<NotionBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    user_stories: any[];
    technical_insights: any[];
    story_ids: string[];
    insight_ids: string[];
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPageContent();
  }, [pageId]);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      const data = await getNotionPageContent(projectId, pageId);
      setContent(data.content || []);
    } catch (error) {
      console.error('Error fetching Notion page content:', error);
      toast.error('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePage = async () => {
    try {
      setAnalyzing(true);
      const result = await analyzeNotionPage(projectId, pageId);
      setAnalysisResult(result);
      setDialogOpen(true);
      
      // Notify success
      const storiesCount = result.user_stories?.length || 0;
      const insightsCount = result.technical_insights?.length || 0;
      toast.success(`Analysis complete! Extracted ${storiesCount} stories and ${insightsCount} insights.`);
      
      if (onUserStoryAdded) onUserStoryAdded();
    } catch (error) {
      console.error('Error analyzing Notion page:', error);
      toast.error('Failed to analyze page');
    } finally {
      setAnalyzing(false);
    }
  };

  const renderBlock = (block: NotionBlock) => {
    switch (block.type) {
      case 'paragraph':
        if (!block.paragraph?.rich_text?.length) return null;
        
        const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
        if (!text) return null;
        
        return (
          <div key={block.id} className="py-2">
            <p className="text-gray-800">{text}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h3 className="text-lg font-medium flex-1">{pageTitle}</h3>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleAnalyzePage}
              disabled={analyzing || loading}
              className="ml-2"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Page'}
            </Button>
          </div>
          
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading content...</div>
          ) : content.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No content found in this page</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {content.map(block => renderBlock(block))}
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <NotionPageDialog
          trigger={<div className="hidden" />}
          title="Page Analysis Results"
          description="User stories and technical insights extracted from the Notion page"
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <NotionAnalysisResults 
            userStories={analysisResult.user_stories || []} 
            technicalInsights={analysisResult.technical_insights || []} 
          />
        </NotionPageDialog>
      )}
    </>
  );
};

export default NotionPageContent;
