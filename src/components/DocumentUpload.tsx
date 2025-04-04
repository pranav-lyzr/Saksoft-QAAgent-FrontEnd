import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';
import Card from './Card';

interface DocumentUploadProps {
  title: string;
  description: string;
  onUpload: (text: string) => Promise<void>;
  isProcessing: boolean;
}

const DocumentUpload = ({ title, description, onUpload, isProcessing }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (uploadMethod === 'file' && file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          await onUpload(text);
        };
        reader.readAsText(file);
      } else if (uploadMethod === 'text' && text.trim()) {
        await onUpload(text);
      } else {
        toast.error('Please provide a document to process');
      }
    } catch (error) {
      console.error('Error processing document:', error);
      toast.error('Failed to process document');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>
      
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            uploadMethod === 'file'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setUploadMethod('file')}
        >
          Upload File
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            uploadMethod === 'text'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setUploadMethod('text')}
        >
          Paste Text
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {uploadMethod === 'file' ? (
          <div className="space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your document here, or click to browse
                </p>
                <label className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-500/90 transition-colors">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept=".txt,.md,.doc,.docx,.pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="docText" className="block text-sm font-medium text-gray-700">
              Document Text
            </label>
            <textarea
              id="docText"
              value={text}
              onChange={handleTextChange}
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200"
              placeholder="Paste your document text here..."
            />
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-purple-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-500/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2"
          disabled={isProcessing || (uploadMethod === 'file' && !file) || (uploadMethod === 'text' && !text.trim())}
        >
          {isProcessing ? 'Processing...' : 'Process Document'}
        </button>
      </form>
    </Card>
  );
};

export default DocumentUpload;
