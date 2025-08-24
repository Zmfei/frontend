import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, ImageIcon, FileSpreadsheet, File, TrendingUp, Activity, Globe, Dna } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section with Project Overview */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Welcome to <span className="text-blue-600">DeepMarker</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered gateway to a comprehensive marker gene knowledge base. Discover, analyze, and explore gene
            expression patterns with unparalleled ease and precision.
          </p>

          {/* Quick Entry Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 transition-transform transform hover:scale-105"
              asChild
            >
              <Link href="/database">
                Explore Database
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 transition-transform transform hover:scale-105"
              asChild
            >
              <Link href="/paper-analysis">
                Analyze Literature
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 transition-transform transform hover:scale-105"
              asChild
            >
              <Link href="/advanced-analysis">
                Advanced Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Database Statistics */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-blue-100">
              <CardHeader className="pb-2">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <Dna className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-5xl font-bold text-blue-600">125,847</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">Total Markers</h3>
                <p className="text-sm text-gray-500">Curated marker genes across all datasets</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-green-100">
              <CardHeader className="pb-2">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <Activity className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-5xl font-bold text-green-600">2,456</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">Cell Types</h3>
                <p className="text-sm text-gray-500">Distinct cell types identified and cataloged</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-purple-100">
              <CardHeader className="pb-2">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <Globe className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-5xl font-bold text-purple-600">89</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">Tissues</h3>
                <p className="text-sm text-gray-500">Different tissues and organs analyzed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Technology</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined, AI-powered pipeline for comprehensive marker gene knowledge extraction.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative flex items-center space-x-8 md:space-x-16">
              {/* Icons */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <span className="text-md font-semibold text-gray-700">Literature Input</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    AI
                  </div>
                </div>
                <span className="text-md font-semibold text-gray-700">AI Analysis</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="h-12 w-12 text-purple-600" />
                </div>
                <span className="text-md font-semibold text-gray-700">Data Extraction</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-white" />
                  </div>
                </div>
                <span className="text-md font-semibold text-gray-700">Database Output</span>
              </div>
              {/* Dashed Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200" style={{ transform: 'translateY(-50%)', zIndex: -1 }}>
                <svg width="100%" height="100%">
                  <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="10, 10" stroke="currentColor" strokeWidth="2" className="text-gray-300" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Document Types */}
      <section className="py-24 px-4 bg-blue-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Analyze Any Document</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload and analyze various document formats for comprehensive marker gene extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-red-100">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <FileText className="h-10 w-10 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold">PDF Documents</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">
                  Research papers and scientific articles.
                </CardDescription>
                <div className="inline-flex bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">.pdf</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-green-100">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <ImageIcon className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Images & Figures</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">Scientific illustrations and charts.</CardDescription>
                <div className="flex gap-2 justify-center">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">.jpg</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">.png</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-blue-100">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <FileSpreadsheet className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Spreadsheets</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">Data tables and expression matrices.</CardDescription>
                <div className="flex gap-2 justify-center">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">.xlsx</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">.csv</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border-purple-100">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <File className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Text Documents</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4">Word documents and manuscripts.</CardDescription>
                <div className="flex gap-2 justify-center">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">.docx</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">.txt</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-2xl font-bold">DeepMarker</span>
              </div>
              <p className="text-gray-400">AI-powered marker gene knowledge base.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/database" className="hover:text-blue-300 transition-colors">
                    Database
                  </Link>
                </li>
                <li>
                  <Link href="/paper-analysis" className="hover:text-blue-300 transition-colors">
                    Paper Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/advanced-analysis" className="hover:text-blue-300 transition-colors">
                    Advanced Analysis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-blue-300 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300 transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-blue-300 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 DeepMarker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
