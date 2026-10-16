import { Routes, Route, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { api } from './lib/axios'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// Fetcher function menggunakan Axios
const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await api.get<Post[]>('/posts')
  return data.slice(0, 5) // Ambil 5 data pertama untuk demo
}

function Dashboard() {
  const { data, isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  // Dummy data untuk visualisasi Recharts
  const chartData = [
    { name: 'Jan', total: 40 },
    { name: 'Feb', total: 70 },
    { name: 'Mar', total: 55 },
    { name: 'Apr', total: 90 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard & Analytics</h2>

      {/* Recharts Component */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Monthly Overview</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TanStack Query Data */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Recent API Data (Axios + Query)</h3>
        {isLoading && <p className="text-sm text-gray-400">Loading data...</p>}
        {isError && <p className="text-sm text-red-500">Error: {error.message}</p>}
        {data && (
          <ul className="divide-y divide-gray-100">
            {data.map((post) => (
              <li key={post.id} className="py-2">
                <p className="font-medium text-sm text-gray-900 capitalize">{post.title}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">Tentang Aplikasi</h2>
      <p className="mt-2 text-gray-600">Halaman ini dimuat menggunakan React Router.</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4">
        <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">
          Dashboard
        </Link>
        <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600">
          About
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}