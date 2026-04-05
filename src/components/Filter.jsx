import React from 'react';

const CATEGORIES = [
  'Food & Drink', 'Transport', 'Housing', 'Health', 
  'Entertainment', 'Shopping', 'Education', 'Other'
];

const Filter = ({ filterCategory, setFilterCategory, startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 w-full md:w-auto justify-end">
      
      {/* Category Filter */}
      <div className="flex items-center gap-3 w-full xl:w-auto">
        <label htmlFor="filter" className="text-sm font-semibold text-slate-400 whitespace-nowrap uppercase tracking-wider hidden sm:block drop-shadow-sm">
          Filter
        </label>
        <div className="relative w-full xl:w-full">
          <select
            id="filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium text-slate-100 shadow-sm hover:bg-slate-700 pointer-events-auto"
          >
            <option className="bg-slate-800 text-slate-100" value="All">All Categories</option>
            {CATEGORIES.map(cat => (
               <option className="bg-slate-800 text-slate-100" key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Vertical Divider (Hidden on small screens) */}
      <div className="hidden xl:block w-px h-6 bg-slate-700 mx-1"></div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2 w-full xl:w-auto justify-between xl:justify-start">
        <div className="flex-1 xl:flex-none">
          <input 
            type="date"
            title="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full xl:w-36 appearance-none px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium text-slate-100 shadow-sm hover:bg-slate-700"
          />
        </div>
        
        <span className="text-slate-400 text-sm font-bold px-1 drop-shadow-sm">to</span>
        
        <div className="flex-1 xl:flex-none">
          <input 
            type="date"
            title="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full xl:w-36 appearance-none px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium text-slate-100 shadow-sm hover:bg-slate-700"
          />
        </div>
        
        {/* Clear Button - Shows if ANY filter is active */}
        <div className="flex items-center justify-center w-8">
          {(startDate || endDate || filterCategory !== 'All') && (
            <button 
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setFilterCategory('All');
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors animate-fade-in"
              title="Clear all filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Filter;
