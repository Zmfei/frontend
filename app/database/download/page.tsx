import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function DatabaseDownloadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Download Complete Dataset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600">Download the complete GeneExplore dataset (CSV & JSON).</p>

              <div className="space-y-4">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-5 w-5" />
                  Download All Data
                </Button>

                <div className="text-sm text-gray-500">
                  <p>Dataset includes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>125,847 marker genes</li>
                    <li>2,456 cell types</li>
                    <li>89 tissue types</li>
                    <li>Complete literature references</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
