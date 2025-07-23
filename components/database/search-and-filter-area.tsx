"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Calendar } from "lucide-react"

export function SearchAndFilterArea() {
  const [yearRange, setYearRange] = useState([2020, 2024])
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([])

  const species = ["Human", "Mouse", "Rat", "Zebrafish", "Drosophila"]
  const tissues = ["Brain", "Heart", "Liver", "Kidney", "Lung", "Muscle"]

  return (
    <div className="space-y-6">
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
            <Label htmlFor="keyword-search">Search markers, cell types, tissues, PMID, or species</Label>
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

      {/* Species Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Species</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {species.map((specie) => (
              <div key={specie} className="flex items-center space-x-2">
                <Checkbox
                  id={specie}
                  checked={selectedSpecies.includes(specie)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSpecies([...selectedSpecies, specie])
                    } else {
                      setSelectedSpecies(selectedSpecies.filter((s) => s !== specie))
                    }
                  }}
                />
                <Label htmlFor={specie} className="text-sm">
                  {specie}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tissue Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Tissue/Organ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tissues.map((tissue) => (
              <div key={tissue} className="flex items-center space-x-2">
                <Checkbox id={tissue} />
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
