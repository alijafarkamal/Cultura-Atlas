import { QlooSearchResponse, QlooRecsResponse, QlooEntity, UserPreference, CrossDomainInsight } from '@/types'

const API_BASE = 'https://hackathon.api.qloo.com'
const API_KEY = process.env.QLOO_API_TOKEN

if (!API_KEY) {
  throw new Error('QLOO_API_TOKEN environment variable is required')
}

const headers = {
  accept: 'application/json',
  'X-Api-Key': API_KEY
}

async function fetchQloo(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`, { headers })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

class QlooAPI {
  constructor() {
    if (!API_KEY) {
      throw new Error('QLOO_API_TOKEN environment variable is required')
    }
  }

  async searchEntities(query: string, page: number = 1, take: number = 10): Promise<QlooSearchResponse> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      take: take.toString()
    })
    const response = await fetchQloo(`/search?${params.toString()}`)
    return {
      entities: response.results || [],
      total: response.total || 0,
    }
  }

  async searchTags(query: string) {
    const params = new URLSearchParams({ query })
    return await fetchQloo(`/v2/tags?${params.toString()}`)
  }

  async fetchAudiences() {
    return await fetchQloo('/v2/audiences')
  }

  async getInsights({ tagId, entityType = 'urn:entity:movie' }: { tagId: string; entityType?: string }) {
    const params = new URLSearchParams({
      'filter.type': entityType,
      'signal.interests.tags': tagId
    })
    return await fetchQloo(`/v2/insights?${params.toString()}`)
  }

  async getRecommendations(
    entityIds: string[],
    categories?: string[],
    location?: { latitude: number; longitude: number; radius?: number }
  ): Promise<QlooRecsResponse> {
    const searchPromises = entityIds.map(id => this.searchEntities(id))
    const searchResults = await Promise.all(searchPromises)
    const allEntities = searchResults.flatMap(result => result.entities)
    
    return {
      recommendations: allEntities.map(entity => ({
        entity,
        score: 1.0,
        reasoning: 'Based on search results'
      })),
      total: allEntities.length,
    }
  }

  async getCrossDomainRecommendations(
    preferences: string[],
    targetCategories: string[] = ['restaurant', 'music', 'movie', 'travel', 'activity', 'art', 'book', 'fashion']
  ): Promise<QlooRecsResponse> {
    const searchPromises = preferences.map(pref => 
      this.searchEntities(pref)
    )

    const searchResults = await Promise.all(searchPromises)
    const allEntities = searchResults.flatMap(result => result.entities)
    const entityIds = allEntities.map(entity => entity.id)

    if (entityIds.length === 0) {
      return { recommendations: [], total: 0 }
    }

    return this.getRecommendations(entityIds, targetCategories)
  }

  async analyzeTasteProfile(preferences: UserPreference[]): Promise<{
    profile: string
    insights: CrossDomainInsight[]
    recommendations: QlooRecsResponse
  }> {
    const preferenceTexts = preferences.map(p => p.name)
    const recommendations = await this.getCrossDomainRecommendations(preferenceTexts)
    
    const insights: CrossDomainInsight[] = []
    
    for (const pref of preferences) {
      const crossDomainResults = await this.getCrossDomainRecommendations(
        [pref.name],
        ['restaurant', 'music', 'activity', 'art']
      )
      
      if (crossDomainResults.recommendations.length > 0) {
        insights.push({
          source_preference: pref,
          target_category: crossDomainResults.recommendations[0].entity.category,
          reasoning: `Your love for ${pref.name} connects to ${crossDomainResults.recommendations[0].entity.category} culture`,
          examples: crossDomainResults.recommendations.slice(0, 3).map(r => r.entity.name)
        })
      }
    }

    const profile = this.generateTasteProfile(preferences, insights)
    
    return {
      profile,
      insights,
      recommendations
    }
  }

  private generateTasteProfile(preferences: UserPreference[], insights: CrossDomainInsight[]): string {
    const categories = preferences.map(p => p.category)
    const uniqueCategories = Array.from(new Set(categories))
    
    let profile = `Cultural enthusiast with diverse interests in ${uniqueCategories.join(', ')}. `
    
    if (insights.length > 0) {
      profile += `Shows cross-cultural connections, particularly ${insights[0].reasoning.toLowerCase()}. `
    }
    
    if (preferences.length > 3) {
      profile += 'Has eclectic taste spanning multiple cultural domains.'
    } else {
      profile += 'Has focused cultural interests with potential for discovery.'
    }
    
    return profile
  }

  async getGroupRecommendations(
    groupPreferences: UserPreference[],
    targetCategories: string[],
    strategy: 'intersection' | 'union' = 'union'
  ): Promise<QlooRecsResponse> {
    const uniquePreferences = this.mergeGroupPreferences(groupPreferences, strategy)
    return this.getCrossDomainRecommendations(
      uniquePreferences.map(p => p.name),
      targetCategories
    )
  }

  private mergeGroupPreferences(
    preferences: UserPreference[], 
    strategy: 'intersection' | 'union'
  ): UserPreference[] {
    if (strategy === 'union') {
      const uniqueMap = new Map<string, UserPreference>()
      preferences.forEach(pref => {
        const key = `${pref.name}-${pref.category}`
        if (!uniqueMap.has(key) || (pref.confidence || 0) > (uniqueMap.get(key)?.confidence || 0)) {
          uniqueMap.set(key, pref)
        }
      })
      return Array.from(uniqueMap.values())
    } else {
      const preferenceCounts = new Map<string, { pref: UserPreference; count: number }>()
      
      preferences.forEach(pref => {
        const key = `${pref.name}-${pref.category}`
        if (preferenceCounts.has(key)) {
          preferenceCounts.get(key)!.count++
        } else {
          preferenceCounts.set(key, { pref, count: 1 })
        }
      })
      
      return Array.from(preferenceCounts.values())
        .filter(item => item.count > 1)
        .map(item => item.pref)
    }
  }
}

export const qlooAPI = new QlooAPI() 