'use client';

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface Prediction {
  prediction_for: string;
  predicted_source: 'grid' | 'generator' | 'off';
  confidence_score: number;
}

export default function PredictionChart({ data }: { data: Prediction[] }) {
  const chartData = data.map(p => ({
    time: new Date(p.prediction_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    confidence: p.confidence_score,
    source: p.predicted_source,
    sourceValue: p.predicted_source === 'grid' ? 3 : (p.predicted_source === 'generator' ? 2 : 1)
  }));

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'grid': return '#10b981'; // green-500
      case 'generator': return '#f59e0b'; // yellow-500
      case 'off': return '#ef4444'; // red-500
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" />
          <YAxis hide domain={[0, 4]} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow-sm text-xs">
                    <p className="font-bold">{data.time}</p>
                    <p>Source: <span className="font-semibold uppercase" style={{ color: getSourceColor(data.source) }}>{data.source}</span></p>
                    <p>Confidence: {data.confidence.toFixed(1)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="sourceValue">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getSourceColor(entry.source)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
