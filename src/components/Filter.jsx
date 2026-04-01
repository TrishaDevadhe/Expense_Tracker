import React from 'react';

import { EXPENSE_CATEGORIES } from '../utils/expenseModel';

const Filter = ({ filterCategory, setFilterCategory }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-50/50 px-4 py-2.5 rounded-xl border border-gray-100">
      <label htmlFor="filter" className="text-sm font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">
        Filter Array
      </label>
      <div className="relative">
        <select
          id="filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all cursor-pointer font-medium text-gray-700 shadow-sm hover:border-gray-300"
        >
          <option value="All">All Categories</option>
          {EXPENSE_CATEGORIES.map(cat => (
             <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Filter;
