'use client'

import { useEffect, useRef } from 'react'
import { ItineraryItem } from '@/types'

interface MapDisplayProps {
  items: ItineraryItem[]
  className?: string
}

export default function MapDisplay({ items, className = '' }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const loadMap = async () => {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      if (!mapRef.current) return

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      const map = L.map(mapRef.current).setView([40.7128, -74.0060], 13)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      items.forEach((item, index) => {
        if (item.location?.coordinates) {
          const [lat, lng] = item.location.coordinates
          const marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold">${item.title}</h3>
                <p class="text-sm text-gray-600">${item.time}</p>
                <p class="text-sm">${item.location.name}</p>
              </div>
            `)
        }
      })
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [items])

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-64 rounded-lg border border-gray-200 ${className}`}
    />
  )
} 