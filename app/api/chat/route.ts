import { NextRequest, NextResponse } from 'next/server'
import { geminiAPI } from '@/lib/gemini-api'
import { qlooAPI } from '@/lib/qloo-api'
import { ChatMessage, UserPreference } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, currentItinerary, userPreferences, chatHistory } = body

    if (!message || !userPreferences || !Array.isArray(userPreferences)) {
      return NextResponse.json(
        { error: 'Message and user preferences are required' },
        { status: 400 }
      )
    }

    const preferenceTexts = userPreferences.map((p: UserPreference) => p.name)
    const recommendations = await qlooAPI.getCrossDomainRecommendations(
      preferenceTexts,
      ['restaurant', 'music', 'movie', 'travel', 'activity', 'art']
    )

    const chatResponse = await geminiAPI.chatResponse(
      message,
      currentItinerary || null,
      userPreferences,
      recommendations.recommendations,
      chatHistory || []
    )

    return NextResponse.json({
      message: chatResponse,
      recommendations: recommendations.recommendations
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    )
  }
} 