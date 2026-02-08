'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PriceHistory } from '@/lib/api/client';
import { formatPrice } from '@/lib/utils/format';

interface PriceChartProps {
  priceHistory: PriceHistory[];
}

export function PriceChart({ priceHistory }: PriceChartProps) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No price history available
      </div>
    );
  }

  const chartData = priceHistory.map((entry) => ({
    date: new Date(entry.recordedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    minPrice: entry.minPrice,
    maxPrice: entry.maxPrice,
    avgPrice: entry.avgPrice,
    source: entry.source,
  }));

  return (
    <div className="w-full h-80" data-testid="price-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip
            formatter={(value) => formatPrice(value as number)}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="minPrice"
            name="Min Price"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="maxPrice"
            name="Max Price"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="avgPrice"
            name="Avg Price"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
