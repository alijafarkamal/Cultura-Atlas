import { NextRequest, NextResponse } from 'next/server'
import { qlooAPI } from '@/lib/qloo-api'
import { geminiAPI } from '@/lib/gemini-api'
import { UserPreference } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { preferences, duration = '1-day', location } = body

    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      return NextResponse.json(
        { error: 'Preferences are required and must be an array' },
        { status: 400 }
      )
    }

    const preferenceTexts = preferences.map((p: UserPreference) => p.name)
    
    const recommendations = await qlooAPI.getCrossDomainRecommendations(
      preferenceTexts,
      ['restaurant', 'music', 'movie', 'travel', 'activity']
    )

    if (recommendations.recommendations.length === 0) {
      return NextResponse.json(
        { error: 'No recommendations found for the given preferences' },
        { status: 404 }
      )
    }

    const itinerary = await geminiAPI.generateItinerary(
      recommendations.recommendations,
      preferences,
      duration,
      location
    )

    return NextResponse.json({
      itinerary,
      recommendations: recommendations.recommendations,
      total_recommendations: recommendations.total
    })

  } catch (error: any) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary' },
      { status: 500 }
    )
  }
} 