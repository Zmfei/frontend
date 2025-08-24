import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function ProjectOverview() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
          <Zap className="w-4 h-4 mr-2" />
          AI-Powered Knowledge Base
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Automated
          <br />
          <span className="text-blue-600">Marker Gene</span>
          <br />
          Knowledge Base
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          Leveraging advanced AI and multi-modal analysis to automatically construct a comprehensive marker gene
          knowledge base from scientific literature. Our system combines LLM technology with human-in-the-loop
          validation to ensure accuracy and reliability.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4" asChild>
            <Link href="/database">
              Explore Database
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent" asChild>
            <Link href="/paper-analysis">Analyze Literature</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
