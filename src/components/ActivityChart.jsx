
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ApiService } from './ApiService';

const ActivityChart = ({ title, period }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const activityData = await ApiService.getActivityData(period);
        setData(activityData);
        setError(null);
      } catch (err) {
        setError('Error loading activity data');
        console.error('Failed to load activity data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : error ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
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
                <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => new Date(label).toLocaleString()} 
                />
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
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
