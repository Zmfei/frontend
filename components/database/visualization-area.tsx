"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

// Mock data for visualizations
const tissueDistribution = [
  { tissue: "Brain", count: 2456 },
  { tissue: "Heart", count: 1834 },
  { tissue: "Liver", count: 1623 },
  { tissue: "Kidney", count: 1445 },
  { tissue: "Lung", count: 1289 },
  { tissue: "Muscle", count: 1156 },
  { tissue: "Blood", count: 987 },
  { tissue: "Skin", count: 876 },
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
        </Tabs>
      </CardContent>
    </Card>
  )
}
