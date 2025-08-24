import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, GitBranch, Clock } from "lucide-react"
import Link from "next/link"

export default function AdvancedAnalysisPage() {
  const analysisTools = [
    {
      title: "Cell Classification",
      description: "Classify cell types from single-cell RNA sequencing data using marker genes",
      icon: BarChart3,
      href: "/advanced/cell-classification",
      available: true,
    },
    {
      title: "Gene Set Enrichment",
      description: "Perform enrichment analysis on gene sets to identify biological pathways",
      icon: TrendingUp,
      href: "/advanced/gene-enrichment",
      available: false,
    },
    {
      title: "Pathway Analysis",
      description: "Analyze biological pathways and their relationships with marker genes",
      icon: GitBranch,
      href: "/advanced/pathway",
      available: false,
    },
    {
      title: "Temporal Analysis",
      description: "Study gene expression changes over time and developmental stages",
      icon: Clock,
      href: "/advanced/temporal",
      available: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analysis</h1>
          <p className="text-gray-600">Comprehensive analysis tools for genomic data and bioinformatics research</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {analysisTools.map((tool, index) => (
            <Link key={index} href={tool.href}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      tool.available ? "bg-blue-100 group-hover:bg-blue-200" : "bg-gray-100"
                    }`}
                  >
                    <tool.icon className={`h-8 w-8 ${tool.available ? "text-blue-600" : "text-gray-400"}`} />
                  </div>
                  <CardTitle className={`text-xl ${tool.available ? "text-gray-900" : "text-gray-500"}`}>
                    {tool.title}
                  </CardTitle>
                  {!tool.available && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      Coming Soon
                    </div>
                  )}
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className={tool.available ? "text-gray-600" : "text-gray-400"}>
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
