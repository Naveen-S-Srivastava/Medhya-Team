import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function ScoresChart() {
  const [scores, setScores] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!baseUrl) return;
    fetch(`${baseUrl}/admin/scores`)
      .then((res) => res.json())
      .then((data) => {
        const withNames = Array.isArray(data)
          ? data.map((s, idx) => ({
              label: `User ${idx + 1}`,
              phq9: s?.phq9 ?? null,
              gad7: s?.gad7 ?? null,
            }))
          : [];
        setScores(withNames);
      })
      .catch(() => setScores([]));
  }, [baseUrl]);

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        <BarChart data={scores} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} domain={[0, 27]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="phq9" name="PHQ-9" fill="rgba(255, 99, 132, 0.7)" />
          <Bar dataKey="gad7" name="GAD-7" fill="rgba(54, 162, 235, 0.7)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


