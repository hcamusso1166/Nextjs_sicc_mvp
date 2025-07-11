'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DocReqData {
  status: string;
  count: number;
}

export default function DocReqProveedorChart({ data }: { data: DocReqData[] }) {
  const chartData = useMemo(() => {
    const backgroundColors = [
      '#f97316',
      '#6b7280',
      '#ef4444',
      '#10b981',
      '#a855f7',
      '#facc15',
    ];
    return {
      labels: data.map((d) => d.status),
      datasets: [
        {
          data: data.map((d) => d.count),
          backgroundColor: backgroundColors.slice(0, data.length),
        },
      ],
    };
  }, [data]);

  return <Pie data={chartData} />;
}