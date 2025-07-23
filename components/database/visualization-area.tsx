"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for visualizations
const tissueDistribution = [
  { tissue: "Brain", count: 2456 },
  { tissue: "Heart", count: 1834 },
  { tissue: "Liver", count: 1623 },
  { tissue: "Kidney", count: 1445 },
  { tissue: "Lung", count: 1289 },
  { tissue: "Muscle", count: 1156 },
]

const temporalTrends = [
  { year: 2020, markers: 1200 },
  { year: 2021, markers: 1850 },
  { year: 2022, markers: 2400 },
  { year: 2023, markers: 3100 },
  { year: 2024, markers: 2800 },
]

const speciesDistribution = [
  { name: "Human", value: 45, color: "#3B82F6" },
  { name: "Mouse", value: 31, color: "#10B981" },
  { name: "Rat", value: 12, color: "#8B5CF6" },
  { name: "Others", value: 12, color: "#F59E0B" },
]

export function VisualizationArea() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tissue-distribution" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tissue-distribution">Tissue Distribution</TabsTrigger>
            <TabsTrigger value="temporal-trends">Temporal Trends</TabsTrigger>
            <TabsTrigger value="species-distribution">Species Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="tissue-distribution" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tissueDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tissue" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
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

          <TabsContent value="species-distribution" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={speciesDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {speciesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-4">Distribution of marker genes across different species</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
