import { useState, useEffect, useMemo } from 'react';
import { Bookmark as BookmarkIcon, Plus, Search, Tag, ArrowUp, ArrowDown, Trash2, ExternalLink } from 'lucide-react';
import type { Bookmark } from '../types';

export default function BookmarkWidget() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    tags: '',
    note: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach(b => b.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      const matchesSearch = searchTerm === '' ||
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.note.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = selectedTag === '' || bookmark.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [bookmarks, searchTerm, selectedTag]);

  const handleAddBookmark = () => {
    if (!formData.title || !formData.url) return;

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: formData.title,
      url: formData.url,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      note: formData.note,
      createdAt: Date.now(),
    };

    setBookmarks([...bookmarks, newBookmark]);
    setFormData({ title: '', url: '', tags: '', note: '' });
    setIsAdding(false);
  };

  const moveBookmark = (index: number, direction: 'up' | 'down') => {
    const newBookmarks = [...bookmarks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBookmarks.length) return;

    [newBookmarks[index], newBookmarks[targetIndex]] = [newBookmarks[targetIndex], newBookmarks[index]];
    setBookmarks(newBookmarks);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Bookmarks</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top duration-200">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Note (optional)"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
          <button
            onClick={handleAddBookmark}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Bookmark
          </button>
        </div>
      )}

      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {bookmarks.length === 0 ? 'No bookmarks yet' : 'No matching bookmarks'}
          </div>
        ) : (
          filteredBookmarks.map((bookmark, index) => (
            <div
              key={bookmark.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-800 hover:text-blue-600 truncate flex items-center gap-1"
                    >
                      {bookmark.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{bookmark.url}</p>
                  {bookmark.note && (
                    <p className="text-sm text-gray-600 mt-1">{bookmark.note}</p>
                  )}
                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bookmark.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveBookmark(bookmarks.indexOf(bookmark), 'up')}
                    disabled={bookmarks.indexOf(bookmark) === 0}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveBookmark(bookmarks.indexOf(bookmark), 'down')}
                    disabled={bookmarks.indexOf(bookmark) === bookmarks.length - 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="p-1 rounded hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
