import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function GeneEnrichmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-3xl text-gray-500">Gene Set Enrichment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-400 mb-6">Coming Soon</p>
              <p className="text-gray-500">
                This feature is currently under development. Gene set enrichment analysis will allow you to identify
                biological pathways and processes that are overrepresented in your gene sets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
