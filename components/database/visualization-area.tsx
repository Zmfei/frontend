"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

// Mock data for visualizations
const tissueDistribution = [
  { name: "Brain", value: 2456, color: "#3B82F6" },
  { name: "Heart", value: 1834, color: "#10B981" },
  { name: "Liver", value: 1623, color: "#8B5CF6" },
  { name: "Kidney", value: 1445, color: "#F59E0B" },
  { name: "Lung", value: 1289, color: "#EF4444" },
  { name: "Muscle", value: 1156, color: "#6B7280" },
  { name: "Blood", value: 987, color: "#EC4899" },
  { name: "Skin", value: 876, color: "#14B8A6" },
]

const temporalTrends = [
  { year: 2020, markers: 1200 },
  { year: 2021, markers: 1850 },
  { year: 2022, markers: 2400 },
  { year: 2023, markers: 3100 },
  { year: 2024, markers: 2800 },
]

export function VisualizationArea() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tissue-distribution" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tissue-distribution">Tissue Distribution</TabsTrigger>
            <TabsTrigger value="temporal-trends">Temporal Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="tissue-distribution" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tissueDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tissueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Distribution of marker genes across different tissues and organs
            </p>
          </TabsContent>

          <TabsContent value="temporal-trends" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temporalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="markers" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-4">Temporal trends showing marker gene discoveries over time</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
