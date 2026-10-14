'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDataItem[];
  centerValue?: string | number;
  centerLabel?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  height = 200,
  innerRadius = 55,
  outerRadius = 75,
  showLegend = true,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value: any, name: any) => [
                `${value} (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {(centerValue !== undefined || centerLabel !== undefined) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerValue !== undefined && (
              <span className="text-2xl font-bold text-gray-900 leading-tight">
                {centerValue}
              </span>
            )}
            {centerLabel !== undefined && (
              <span className="text-xs text-muted-foreground font-medium">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 w-full">
          {data.map((item) => {
            const pct =
              total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div
                key={item.name}
                className="flex items-center text-xs text-gray-600 gap-1.5"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-gray-400">({item.value})</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
