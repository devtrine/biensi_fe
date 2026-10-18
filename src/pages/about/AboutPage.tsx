import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const AboutPage: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => [],
  });

  const chartData = [
    { name: 'Jan', total: 40 },
    { name: 'Feb', total: 70 },
    { name: 'Mar', total: 55 },
    { name: 'Apr', total: 90 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Tentang Aplikasi</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sistem Dashboard HR BIENSI Fesyenindo dengan integrasi analitik visual, TanStack Query, dan pelaporan metrik KPI nasional.
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-2xs border border-slate-200/90">
        <h3 className="text-sm font-bold text-slate-800 mb-4 font-heading">Monthly Overview</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#c8102e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-2xs border border-slate-200/90">
        <h3 className="text-sm font-bold text-slate-800 mb-2 font-heading">Recent API Data (Axios + Query)</h3>
        {isLoading && <p className="text-sm text-slate-400">Loading data...</p>}
        {isError && <p className="text-sm text-red-500">Error: {error.message}</p>}
        {data && data.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {data.map((post) => (
              <li key={post.id} className="py-2">
                <p className="font-medium text-sm text-slate-900 capitalize">{post.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500">Belum ada data eksternal yang dimuat.</p>
        )}
      </div>
    </div>
  );
};
