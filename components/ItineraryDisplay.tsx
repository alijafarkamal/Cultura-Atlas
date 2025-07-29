'use client'

import { Itinerary } from '@/types'
import { Clock, MapPin, Star, RefreshCw, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ItineraryDisplayProps {
  itinerary: Itinerary
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const getTimeIcon = (time: string) => {
    if (time.toLowerCase().includes('morning')) return '🌅'
    if (time.toLowerCase().includes('afternoon')) return '☀️'
    if (time.toLowerCase().includes('evening')) return '🌆'
    if (time.toLowerCase().includes('night')) return '🌙'
    return '🕐'
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      restaurant: '🍽️',
      food: '🍽️',
      music: '🎵',
      movie: '🎬',
      art: '🎨',
      travel: '✈️',
      activity: '🎯',
      shopping: '🛍️',
      culture: '🏛️',
      entertainment: '🎪',
    }
    return icons[category.toLowerCase()] || '📍'
  }

  const downloadPDF = async () => {
    const element = document.getElementById('itinerary-content')
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${itinerary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <div className="card" id="itinerary-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {itinerary.title}
          </h2>
          <p className="text-gray-600">
            {itinerary.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {itinerary.duration}
        </div>
      </div>

      <div className="space-y-6">
        {itinerary.items.map((item, index) => (
          <div
            key={item.id}
            className="relative border-l-4 border-primary-500 pl-6 pb-6"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-500 rounded-full"></div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getTimeIcon(item.time)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
                <span className="text-2xl">
                  {getCategoryIcon(item.category)}
                </span>
              </div>

              <p className="text-gray-700 mb-3 leading-relaxed">
                {item.description}
              </p>

              {item.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{item.location.name}</span>
                  {item.location.address && (
                    <span className="text-gray-500">• {item.location.address}</span>
                  )}
                </div>
              )}

              {item.reasoning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      Why this was chosen:
                    </span>
                  </div>
                  <p className="text-sm text-amber-700">
                    {item.reasoning}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Generated on {new Date(itinerary.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadPDF}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          <button className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium">
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
          </div>
        </div>
      </div>
    </div>
  )
} 