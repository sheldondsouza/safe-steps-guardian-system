
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ActivityData {
  time: string;
  movement: number;
  fallRisk: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  title: string;
  period: 'day' | 'week' | 'month';
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, title, period }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="movement" 
                stroke="#0070f3" 
                activeDot={{ r: 8 }} 
                name="Movement Level"
              />
              <Line 
                type="monotone" 
                dataKey="fallRisk" 
                stroke="#ef4444" 
                name="Fall Risk Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
