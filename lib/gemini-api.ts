import { GoogleGenAI } from '@google/genai'
import { QlooRecommendation, UserPreference, Itinerary, ChatMessage, CrossDomainInsight, FilterOptions } from '@/types'

class GeminiAPI {
  private ai: GoogleGenAI

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required')
    }
    this.ai = new GoogleGenAI({ apiKey })
  }

  async generateItinerary(
    recommendations: QlooRecommendation[],
    userPreferences: UserPreference[],
    duration: '1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '6-day' | '7-day' = '1-day',
    location?: string,
    filters?: FilterOptions,
    insights?: CrossDomainInsight[]
  ): Promise<Itinerary> {
    const prompt = this.buildItineraryPrompt(recommendations, userPreferences, duration, location, filters, insights)
    
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
      
      return this.parseItineraryResponse(response.text || '', userPreferences, duration, location)
    } catch (error: any) {
      console.error('Gemini API Error:', error)
      throw new Error('Failed to generate itinerary')
    }
  }

  async chatResponse(
    message: string,
    currentItinerary: Itinerary | null,
    userPreferences: UserPreference[],
    recommendations: QlooRecommendation[],
    chatHistory: ChatMessage[]
  ): Promise<ChatMessage> {
    const prompt = this.buildChatPrompt(message, currentItinerary, userPreferences, recommendations, chatHistory)
    
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
      
      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: response.text || '',
        timestamp: new Date().toISOString(),
        metadata: {
          action: this.detectAction(message),
          preferences: userPreferences,
          context: currentItinerary ? 'itinerary_exists' : 'new_conversation'
        }
      }
    } catch (error: any) {
      console.error('Gemini Chat Error:', error)
      throw new Error('Failed to generate chat response')
    }
  }

  async refineItinerary(
    currentItinerary: Itinerary,
    userRequest: string,
    newRecommendations?: QlooRecommendation[]
  ): Promise<Itinerary> {
    const prompt = this.buildRefinementPrompt(currentItinerary, userRequest, newRecommendations)
    
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
      
      return this.parseItineraryResponse(response.text || '', currentItinerary.user_preferences, currentItinerary.duration, currentItinerary.location)
    } catch (error: any) {
      console.error('Gemini Refinement Error:', error)
      throw new Error('Failed to refine itinerary')
    }
  }

  private buildItineraryPrompt(
    recommendations: QlooRecommendation[],
    userPreferences: UserPreference[],
    duration: '1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '6-day' | '7-day',
    location?: string,
    filters?: FilterOptions,
    insights?: CrossDomainInsight[]
  ): string {
    const prefText = userPreferences.map(p => `${p.name} (${p.category})`).join(', ')
    const recsText = recommendations
      .slice(0, 15)
      .map(rec => `- ${rec.entity.name} (${rec.entity.category}): ${rec.entity.description || 'No description'}`)
      .join('\n')

    const filterText = filters ? `\nFilters: ${JSON.stringify(filters)}` : ''
    const insightText = insights && insights.length > 0 
      ? `\nCross-domain insights:\n${insights.map(i => `- ${i.reasoning}`).join('\n')}` 
      : ''

    return `You are a creative travel concierge and cultural expert. Based on these user preferences: ${prefText}
${location ? `Location: ${location}` : ''}${filterText}${insightText}

And these taste-based recommendations from Qloo:
${recsText}

Write a ${duration} travel plan that includes:
- Morning, afternoon, and evening activities (for 1-day) or day-by-day breakdown (for multi-day)
- Smooth transitions between activities
- Cultural context and insights
- Vivid, friendly, and engaging descriptions
- Cross-domain connections that surprise and delight

Format your response as a JSON object with this structure:
{
  "title": "Creative trip title",
  "description": "Brief overview of the trip",
  "theme": "Cultural theme of the trip",
  "items": [
    {
      "id": "unique-id",
      "title": "Activity title",
      "description": "Detailed description with cultural context",
      "time": "Morning/Afternoon/Evening or Day 1 Morning/etc",
      "location": {
        "name": "Place name",
        "address": "Address if available"
      },
      "category": "restaurant/music/activity/etc",
      "reasoning": "Why this was chosen based on user preferences",
      "price_range": "$/$$/$$$",
      "duration": "Estimated time",
      "tags": ["cultural", "local", "unique"]
    }
  ]
}

Be creative, culturally insightful, and make it sound like advice from a knowledgeable local guide. Focus on unexpected connections and hidden gems.`
  }

  private buildChatPrompt(
    message: string,
    currentItinerary: Itinerary | null,
    userPreferences: UserPreference[],
    recommendations: QlooRecommendation[],
    chatHistory: ChatMessage[]
  ): string {
    const prefText = userPreferences.map(p => `${p.name} (${p.category})`).join(', ')
    const itineraryText = currentItinerary 
      ? `\nCurrent itinerary: ${currentItinerary.title} - ${currentItinerary.description}`
      : ''
    const historyText = chatHistory.length > 0 
      ? `\nRecent conversation:\n${chatHistory.slice(-3).map(msg => `${msg.type}: ${msg.content}`).join('\n')}`
      : ''

    return `You are a friendly cultural concierge assistant for Cultura Atlas. 

User preferences: ${prefText}${itineraryText}${historyText}

Available recommendations:
${recommendations.slice(0, 10).map(rec => `- ${rec.entity.name} (${rec.entity.category})`).join('\n')}

User message: "${message}"

Respond naturally and helpfully. You can:
- Explain why certain recommendations match their tastes
- Suggest modifications to their itinerary
- Answer questions about cultural connections
- Provide additional context about recommendations
- Help refine their preferences

Keep responses conversational, culturally insightful, and focused on their specific tastes.`
  }

  private buildRefinementPrompt(
    currentItinerary: Itinerary,
    userRequest: string,
    newRecommendations?: QlooRecommendation[]
  ): string {
    const currentItems = currentItinerary.items.map(item => 
      `- ${item.title} (${item.time}): ${item.description}`
    ).join('\n')

    const newRecsText = newRecommendations 
      ? `\nNew recommendations to consider:\n${newRecommendations.map(r => `- ${r.entity.name} (${r.entity.category})`).join('\n')}`
      : ''

    return `Refine this itinerary based on the user's request: "${userRequest}"

Current itinerary:
${currentItems}${newRecsText}

Modify the itinerary to address the user's request while maintaining the cultural connections and flow. Return the complete updated itinerary in the same JSON format as before.`
  }

  private detectAction(message: string): 'generate' | 'refine' | 'explain' | 'modify' {
    const lower = message.toLowerCase()
    if (lower.includes('generate') || lower.includes('create') || lower.includes('plan')) return 'generate'
    if (lower.includes('change') || lower.includes('modify') || lower.includes('update')) return 'modify'
    if (lower.includes('explain') || lower.includes('why') || lower.includes('tell me more')) return 'explain'
    return 'refine'
  }

  private parseItineraryResponse(
    response: string,
    userPreferences: UserPreference[],
    duration: '1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '6-day' | '7-day',
    location?: string
  ): Itinerary {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        id: `itinerary-${Date.now()}`,
        title: parsed.title || 'Your Personalized Trip',
        description: parsed.description || 'A curated experience based on your tastes',
        theme: parsed.theme || 'Cultural Discovery',
        duration,
        items: parsed.items || [],
        created_at: new Date().toISOString(),
        user_preferences: userPreferences,
        location,
        share_url: `https://culturaatlas.app/share/${Date.now()}`
      }
    } catch (error) {
      console.error('Failed to parse itinerary response:', error)
      throw new Error('Failed to parse generated itinerary')
    }
  }
}

export const geminiAPI = new GeminiAPI() 