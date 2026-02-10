
import React from 'react';

const DashboardStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                            {stat.icon}
                        </div>
                        <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {stat.change}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mt-4">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
