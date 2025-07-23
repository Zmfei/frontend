import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Globe, Clock } from "lucide-react"

export function DatabaseStatistics() {
  const statistics = [
    {
      icon: TrendingUp,
      title: "Total Markers",
      value: "125,847",
      description: "Curated marker genes",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Cell Types",
      value: "2,456",
      description: "Distinct cell types covered",
      color: "text-green-600",
    },
    {
      icon: Globe,
      title: "Tissues/Organs",
      value: "89",
      description: "Different tissues analyzed",
      color: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Last Updated",
      value: "2 hours ago",
      description: "Real-time data processing",
      color: "text-orange-600",
    },
  ]

  const speciesData = [
    { name: "Human", count: "45,231", percentage: 36 },
    { name: "Mouse", count: "38,492", percentage: 31 },
    { name: "Rat", count: "15,678", percentage: 12 },
    { name: "Zebrafish", count: "12,345", percentage: 10 },
    { name: "Others", count: "14,101", percentage: 11 },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Database Statistics</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time insights into our comprehensive marker gene knowledge base, continuously updated with the latest
            scientific literature.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statistics.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Species Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {speciesData.map((species, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full bg-blue-600"
                        style={{
                          backgroundColor: `hsl(${220 + index * 30}, 70%, 50%)`,
                        }}
                      ></div>
                      <span className="font-medium">{species.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{species.count}</div>
                      <div className="text-sm text-gray-500">{species.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New markers added from Nature paper</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Database validation completed</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cell type annotations updated</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New tissue categories added</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
