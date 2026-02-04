import React from 'react';

const StatsCard = ({ stat }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${stat.color} text-white`}>
          {stat.icon}
        </div>
        <span className={`text-xs font-medium ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
          {stat.change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mt-4">{stat.value}</h3>
      <p className="text-sm text-gray-500">{stat.title}</p>
    </div>
  );
};

export default StatsCard;