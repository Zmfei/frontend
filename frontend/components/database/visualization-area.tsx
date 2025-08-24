"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface VisualizationAreaProps {
  species?: string
  year?: string
}

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6B7280", "#EC4899", "#14B8A6", "#A855F7", "#22C55E"]

export function VisualizationArea({ species, year }: VisualizationAreaProps) {
  const [tissueStats, setTissueStats] = useState<{ tissue: string; count: number }[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams()
        if (species && species !== "all") params.append("species", species)
        if (year && year !== "all") params.append("publication_year", year)
        const res = await fetch(`http://localhost:8002/query/tissue-stats?${params.toString()}`)
        const data = await res.json()
        setTissueStats(Array.isArray(data.data) ? data.data : [])
      } catch (e) {
        console.error("Failed to load tissue stats", e)
        setTissueStats([])
      }
    }
    fetchStats()
  }, [species, year])

  const pieData = useMemo(() => tissueStats.map(t => ({ name: t.tissue, value: t.count })), [tissueStats])

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
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }: any) => `${name}: ${Number(value ?? 0).toLocaleString()}`} outerRadius={120} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-4">Distribution of marker genes across different tissues and organs</p>
          </TabsContent>

          <TabsContent value="temporal-trends" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="markers" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-4">Temporal trends</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
