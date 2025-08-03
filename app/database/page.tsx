import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Filter, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DatabasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Access</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you want to access the DeepMarker marker gene database
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Download Full Data</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Download the complete DeepMarker dataset with all marker genes, cell types, and tissue information
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/database/download">
                  Download Dataset
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Tissue Specific</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Browse and filter marker genes by specific tissues, cell types, and other criteria
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/database/tissue">
                  Browse by Tissue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
