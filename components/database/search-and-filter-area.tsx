"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Calendar, Filter } from "lucide-react"

export function SearchAndFilterArea() {
  const [yearRange, setYearRange] = useState([2020, 2024])
  const [selectedTissues, setSelectedTissues] = useState<string[]>([])

  const tissues = ["Brain", "Heart", "Liver", "Kidney", "Lung", "Muscle", "Skin", "Blood", "Bone", "Pancreas"]

  return (
    <div className="space-y-6 h-fit">
      {/* Keyword Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Keyword Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="keyword-search">Search markers, cell types, tissues, or PMID</Label>
            <Input id="keyword-search" placeholder="e.g., CD4, T cell, brain, PMID:12345678" className="mt-1" />
          </div>
          <Button className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </CardContent>
      </Card>

      {/* Temporal Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Publication Date</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>
              Year Range: {yearRange[0]} - {yearRange[1]}
            </Label>
            <Slider value={yearRange} onValueChange={setYearRange} max={2024} min={2000} step={1} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tissue Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Tissue/Organ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {tissues.map((tissue) => (
              <div key={tissue} className="flex items-center space-x-2">
                <Checkbox
                  id={tissue}
                  checked={selectedTissues.includes(tissue)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTissues([...selectedTissues, tissue])
                    } else {
                      setSelectedTissues(selectedTissues.filter((t) => t !== tissue))
                    }
                  }}
                />
                <Label htmlFor={tissue} className="text-sm">
                  {tissue}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full bg-transparent">
        Reset Filters
      </Button>
    </div>
  )
}
