import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-3 leading-relaxed text-gray-600" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-3 space-y-1 text-gray-600" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-3 space-y-1 text-gray-600" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="my-1" {...props} />
          ),
          code: ({ node, inline, ...props }: { node?: any; inline?: boolean } & React.HTMLAttributes<HTMLElement>) => (
            inline ? 
              <code className="bg-gray-100 text-purple-600 px-1 py-0.5 rounded text-sm font-mono" {...props} /> :
              <pre className="block bg-gray-100 p-3 rounded-md text-gray-800 text-sm font-mono overflow-x-auto my-3">
                <code {...props} />
              </pre>
          ),          
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-purple-200 pl-4 py-1 my-3 text-gray-600 italic" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-purple-600 hover:text-purple-800 transition-colors underline" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-gray-200" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-800" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-200" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-200" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-gray-50 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 text-sm text-gray-600" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
