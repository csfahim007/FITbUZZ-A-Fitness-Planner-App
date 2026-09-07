import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProgressChart() {
  // Sample data - replace with your actual data
  const data = [
    { date: 'Jan', weight: 180, bodyFat: 22 },
    { date: 'Feb', weight: 178, bodyFat: 21 },
    { date: 'Mar', weight: 175, bodyFat: 20 },
    { date: 'Apr', weight: 173, bodyFat: 19 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
          <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}