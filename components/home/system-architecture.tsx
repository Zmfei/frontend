import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Eye, Workflow } from "lucide-react"

export function SystemArchitecture() {
  const architectureComponents = [
    {
      icon: Brain,
      title: "Large Language Model",
      description: "Advanced NLP for literature analysis and marker gene extraction",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Workflow,
      title: "AI Agent System",
      description: "Intelligent agents for automated processing and validation",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Eye,
      title: "Multi-modal Analysis",
      description: "Process text, images, tables, and figures from literature",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Users,
      title: "Human-in-the-loop",
      description: "Expert validation and quality control mechanisms",
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">System Architecture</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our integrated AI system combines cutting-edge technologies to deliver accurate and comprehensive marker
            gene knowledge extraction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {architectureComponents.map((component, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${component.color}`}
                >
                  <component.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">{component.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {component.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-gray-50 rounded-full px-8 py-4">
            <span className="text-sm font-medium text-gray-600">Processing Pipeline:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Literature Input</span>
              <span className="text-gray-400">→</span>
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">AI Analysis</span>
              <span className="text-gray-400">→</span>
              <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Extraction</span>
              <span className="text-gray-400">→</span>
              <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Validation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
