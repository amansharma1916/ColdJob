import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch, LuUsers, LuFileText, LuFile, LuLoader } from 'react-icons/lu';
import { useDebounce } from '@/hooks/useDebounce';
import { useClickOutside } from '@/hooks/useClickOutside';
import { globalSearch } from '@/api/searchApi';

const RESULT_ICONS = {
  contacts: LuUsers,
  templates: LuFileText,
  resumes: LuFile,
};

const RESULT_ROUTES = {
  contacts: '/contacts',
  templates: '/templates',
  resumes: '/resumes',
};

const RESULT_LABELS = {
  contacts: 'Contact',
  templates: 'Template',
  resumes: 'Resume',
};

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ contacts: [], templates: [], resumes: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const ref = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(ref, () => {
    setIsFocused(false);
    setSelectedIndex(-1);
  });

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults({ contacts: [], templates: [], resumes: [] });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    globalSearch(debouncedQuery)
      .then((res) => {
        if (!cancelled) {
          setResults(res.data?.data || { contacts: [], templates: [], resumes: [] });
          setIsLoading(false);
          setSelectedIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSelect = (category, item) => {
    const route = RESULT_ROUTES[category];
    setIsFocused(false);
    setQuery('');
    setResults({ contacts: [], templates: [], resumes: [] });
    navigate(route);
  };

  const flattenResults = () => {
    const flat = [];
    for (const category of ['contacts', 'templates', 'resumes']) {
      for (const item of results[category]) {
        flat.push({ category, item });
      }
    }
    return flat;
  };

  const handleKeyDown = (e) => {
    const flat = flattenResults();
    if (!flat.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flat.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flat.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(flat[selectedIndex].category, flat[selectedIndex].item);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const getResultLabel = (category, item) => {
    switch (category) {
      case 'contacts':
        return `${item.firstName} ${item.lastName}`.trim() || item.email;
      case 'templates':
        return item.name;
      case 'resumes':
        return item.name;
      default:
        return '';
    }
  };

  const getResultSubtitle = (category, item) => {
    switch (category) {
      case 'contacts':
        return item.email;
      case 'templates':
        return item.subject;
      case 'resumes':
        return '';
      default:
        return '';
    }
  };

  const totalResults = results.contacts.length + results.templates.length + results.resumes.length;

  return (
    <div ref={ref} className="relative min-w-0 lg:min-w-[200px] shrink">
      <div className="relative">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search contacts, templates..."
          className="w-28 sm:w-48 md:w-56 lg:w-72 bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition"
        />
        {!query && !isFocused && (
          <kbd className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 rounded">
            ⌘K
          </kbd>
        )}
        {isLoading && (
          <LuLoader className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
      </div>

      {isFocused && query.length >= 2 && (
        <div className="fixed sm:absolute left-2 sm:left-0 right-2 sm:right-0 top-auto sm:top-full mt-0 sm:mt-2 bg-white rounded-lg sm:rounded-lg shadow-dropdown border border-gray-200 z-50 py-2 max-h-80 overflow-y-auto min-w-[280px] sm:min-w-0">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              Searching...
            </div>
          ) : totalResults === 0 ? (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            flattenResults().map(({ category, item }, idx) => {
              const Icon = RESULT_ICONS[category];
              const label = getResultLabel(category, item);
              const subtitle = getResultSubtitle(category, item);
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={`${category}-${item._id || item.id}`}
                  onClick={() => handleSelect(category, item)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-md shrink-0 ${
                    category === 'contacts' ? 'bg-blue-100 text-blue-600' :
                    category === 'templates' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="font-medium truncate">{label}</div>
                    {subtitle && (
                      <div className="text-xs text-gray-400 truncate">{subtitle}</div>
                    )}
                  </div>
                  <span className="ml-auto text-xs text-gray-400 shrink-0 capitalize">{RESULT_LABELS[category]}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}