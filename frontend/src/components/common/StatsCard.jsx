// frontend/src/components/common/StatsCard.jsx
import React from 'react';
import Card from './Card'; 

export default function StatsCard({ title, value, subtitle, icon, color = 'emerald', trend = null, onClick }) {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-red-50 text-red-700 border-red-200',
        cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    };

    const trendClasses = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600'
    };

    const trendIcons = {
        up: '↗',
        down: '↘',
        neutral: '→'
    };

    return (
        <Card 
            className={`border-2 ${colorClasses[color]} transition-transform hover:scale-[1.02] cursor-pointer ${onClick ? 'hover:shadow-lg' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    <p className="text-sm opacity-70 mt-1">{subtitle}</p>
                    
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trendClasses[trend.direction]}`}>
                                {trendIcons[trend.direction]} {trend.value}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">{trend.label}</span>
                        </div>
                    )}
                </div>
                
                {icon && (
                    <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-50`}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}