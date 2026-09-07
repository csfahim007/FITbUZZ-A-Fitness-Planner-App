import { useGetProgressQuery } from '../../api/progressApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ProgressChart() {
  const { data: progressData, isLoading } = useGetProgressQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
      <LineChart width={600} height={300} data={progressData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}