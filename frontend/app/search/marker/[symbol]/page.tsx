import { MarkerDetail } from "@/components/search/marker-detail"

interface MarkerPageProps {
  params: Promise<{
    symbol: string
  }>
}

export default async function MarkerPage({ params }: MarkerPageProps) {
  const { symbol } = await params
  const markerSymbol = decodeURIComponent(symbol)
  
  return <MarkerDetail markerSymbol={markerSymbol} />
}

export async function generateMetadata({ params }: MarkerPageProps) {
  const { symbol } = await params
  const markerSymbol = decodeURIComponent(symbol)
  
  return {
    title: `${markerSymbol} - Cell Marker Details | DeepMarker`,
    description: `Detailed information about ${markerSymbol} cell marker including expression patterns, associated cell types, and scientific publications.`,
  }
}
