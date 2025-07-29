import { NextRequest, NextResponse } from 'next/server'
import { qlooAPI } from '@/lib/qloo-api'
import { UserPreference } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { preferences } = body

    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      return NextResponse.json(
        { error: 'Preferences array is required' },
        { status: 400 }
      )
    }

    const analysis = await qlooAPI.analyzeTasteProfile(preferences)

    return NextResponse.json({
      profile: analysis.profile,
      insights: analysis.insights,
      recommendations: analysis.recommendations,
      summary: {
        totalPreferences: preferences.length,
        categories: Array.from(new Set(preferences.map(p => p.category))),
        crossDomainConnections: analysis.insights.length
      }
    })

  } catch (error: any) {
    console.error('Taste Analysis Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze taste profile' },
      { status: 500 }
    )
  }
} 