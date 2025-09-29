'use client';

import { useState } from 'react';
import { Search, FileText, Download, Share, Filter } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'ppt';
  size: string;
  modified: string;
  category: string;
}

const documents: Document[] = [
  { id: '1', name: 'Fountain Labs Overview.pdf', type: 'pdf', size: '2.4 MB', modified: '2 hours ago', category: 'Company' },
  { id: '2', name: 'AI Platform Architecture.doc', type: 'doc', size: '1.8 MB', modified: '1 day ago', category: 'Technical' },
  { id: '3', name: 'Team Directory.txt', type: 'txt', size: '45 KB', modified: '3 days ago', category: 'HR' },
  { id: '4', name: 'Q4 Roadmap.ppt', type: 'ppt', size: '5.2 MB', modified: '1 week ago', category: 'Planning' },
  { id: '5', name: 'Security Guidelines.pdf', type: 'pdf', size: '890 KB', modified: '2 weeks ago', category: 'Security' },
  { id: '6', name: 'API Documentation.doc', type: 'doc', size: '3.1 MB', modified: '3 weeks ago', category: 'Technical' },
];

interface MobileDocumentProps {
  documentType: 'document' | 'document2';
}

export function MobileDocument({ documentType }: MobileDocumentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(documents.map(doc => doc.category)))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'txt': return '📋';
      case 'ppt': return '📊';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-600';
      case 'doc': return 'bg-blue-100 text-blue-600';
      case 'txt': return 'bg-gray-100 text-gray-600';
      case 'ppt': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 active:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getTypeIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(doc.type)}`}>
                        {doc.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{doc.size}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Modified {doc.modified}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{filteredDocuments.length} documents</span>
          <span>
            {(filteredDocuments.reduce((total, doc) => {
              const size = parseFloat(doc.size);
              const unit = doc.size.includes('KB') ? 'KB' : 'MB';
              return total + (unit === 'MB' ? size * 1024 : size);
            }, 0) / 1024).toFixed(1)} MB total
          </span>
        </div>
      </div>
    </div>
  );
}