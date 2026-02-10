
import React from 'react';
import { Search } from 'lucide-react';

const Header = ({ activeTab, filters, handleFilterChange }) => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
                    <p className="text-sm text-gray-500">Welcome back, Admin</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            value={filters?.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-700 font-semibold">A</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
