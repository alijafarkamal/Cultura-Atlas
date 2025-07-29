'use client'

import { CrossDomainInsight, UserPreference } from '@/types'
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react'

interface TasteInsightsProps {
  insights: CrossDomainInsight[]
  userPreferences: UserPreference[]
}

export default function TasteInsights({ insights, userPreferences }: TasteInsightsProps) {
  if (insights.length === 0) {
    return null
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold">Cultural Connections</h3>
        <Sparkles className="w-4 h-4 text-purple-500" />
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-purple-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-purple-900">
                    {insight.source_preference.name}
                  </span>
                  <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {insight.source_preference.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {insight.target_category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">
                  {insight.reasoning}
                </p>
                
                {insight.examples.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Examples:</p>
                    <div className="flex flex-wrap gap-1">
                      {insight.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white px-2 py-1 rounded border text-gray-700"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Insight:</strong> Your diverse tastes create unique cultural connections! 
          We use these patterns to find hidden gems and unexpected experiences that match your personality.
        </p>
      </div>
    </div>
  )
} 