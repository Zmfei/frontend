import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, ImageIcon, FileSpreadsheet, File, TrendingUp, Users, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with Project Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="text-blue-600">GeneExplore</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Comprehensive marker gene knowledge base powered by AI-driven literature analysis. Discover, analyze, and
            explore gene expression patterns across tissues and cell types.
          </p>

          {/* Quick Entry Links */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4" asChild>
              <Link href="/database">
                Explore Database
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent" asChild>
              <Link href="/paper-analysis">
                Analyze Literature
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent" asChild>
              <Link href="/advanced-analysis">
                Advanced Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Database Statistics - Merged from separate section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-4xl font-bold text-blue-600">125,847</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">Total Markers</h3>
                <p className="text-sm text-gray-600">Curated marker genes across all datasets</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-4xl font-bold text-green-600">2,456</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">Cell Types</h3>
                <p className="text-sm text-gray-600">Distinct cell types identified and cataloged</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-4xl font-bold text-purple-600">89</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">Tissues</h3>
                <p className="text-sm text-gray-600">Different tissues and organs analyzed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Architecture</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlined AI-powered pipeline for comprehensive marker gene knowledge extraction
            </p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-6 bg-gray-50 rounded-2xl px-12 py-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Literature Input</span>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">AI</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">AI Analysis</span>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Extraction</span>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Document Types - 4 cards in one row */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Supported Document Types</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload and analyze various document formats for comprehensive marker gene extraction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">PDF Documents</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">
                  Research papers and scientific articles
                </CardDescription>
                <div className="inline-flex bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.pdf</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Images & Figures</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">Scientific illustrations and charts</CardDescription>
                <div className="flex gap-2 justify-center">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.jpg</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.png</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Spreadsheets</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">Data tables and expression matrices</CardDescription>
                <div className="flex gap-2 justify-center">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.xlsx</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.csv</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <File className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Text Documents</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">Word documents and manuscripts</CardDescription>
                <div className="flex gap-2 justify-center">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.docx</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.doc</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">.txt</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">G</span>
                </div>
                <span className="text-xl font-bold">GeneExplore</span>
              </div>
              <p className="text-gray-400">Comprehensive marker gene knowledge base for researchers worldwide.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/database" className="hover:text-white transition-colors">
                    Database
                  </Link>
                </li>
                <li>
                  <Link href="/paper-analysis" className="hover:text-white transition-colors">
                    Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/advanced-analysis" className="hover:text-white transition-colors">
                    Advanced Tools
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GeneExplore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
