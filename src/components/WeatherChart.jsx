import React from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

function WeatherChart({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  // Prepare data for the chart
  const chartData = forecast.map(day => ({
    name: day.date.substring(0, 3), // e.g., "Mon"
    Rain: day.precipitation,
    'Max Temp': day.maxTemp,
    'Min Temp': day.minTemp,
  }));

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Rain (mm)', angle: 90, position: 'insideRight', fontSize: 12 }} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ fontSize: '14px', borderRadius: '0.5rem', boxShadow: '1px 1px 5px #ccc' }} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar dataKey="Rain" yAxisId="right" fill="#3b82f6" barSize={20} />
          <Line type="monotone" yAxisId="left" dataKey="Max Temp" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" yAxisId="left" dataKey="Min Temp" stroke="#60a5fa" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeatherChart;