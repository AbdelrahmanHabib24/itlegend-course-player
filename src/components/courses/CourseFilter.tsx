import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface CourseFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onSelectStatus,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          id="course-search"
          name="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search courses by name or instructor"
          placeholder="Search by course name or instructor..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-accent focus:bg-white transition-colors text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {/* Filter Tabs & Status - Single inline row */}
      <div className="flex items-center gap-2 overflow-x-auto min-w-0 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-accent text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-accent text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Status Dropdown - stays inline with category buttons */}
        <div className="relative shrink-0 inline-flex items-center">
          <select
            id="status-filter"
            name="status"
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            aria-label="Filter courses by completion status"
            className="appearance-none shrink-0 whitespace-nowrap pl-3 pr-7 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 focus:outline-none focus:border-accent cursor-pointer transition-colors"
          >
            <option value="all">All Progress Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not-started">Not Started</option>
          </select>
          <ChevronDown
            className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
