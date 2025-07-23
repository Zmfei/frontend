import { LLMInteractionBox } from "@/components/paper-analysis/llm-interaction-box"
import { AnalysisResultDisplay } from "@/components/paper-analysis/analysis-result-display"

export default function PaperAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paper Analysis</h1>
          <p className="text-gray-600">Upload literature and extract marker gene information using AI analysis</p>
        </div>

        <div className="grid gap-8">
          <LLMInteractionBox />
          <AnalysisResultDisplay />
        </div>
      </div>
    </div>
  )
}
