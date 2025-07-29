export interface QlooEntity {
  id: string
  name: string
  category: string
  description?: string
  image_url?: string
  location?: {
    latitude?: number
    longitude?: number
    address?: string
  }
  metadata?: Record<string, any>
  score?: number
}

export interface QlooSearchResponse {
  entities: QlooEntity[]
  total: number
}

export interface QlooRecommendation {
  entity: QlooEntity
  score: number
  reasoning?: string
  affinity?: string
}

export interface QlooRecsResponse {
  recommendations: QlooRecommendation[]
  total: number
}

export interface UserPreference {
  id: string
  name: string
  category: string
  description?: string
  confidence?: number
}

export interface GroupMember {
  id: string
  name: string
  preferences: UserPreference[]
  avatar?: string
}

export interface GroupProfile {
  id: string
  name: string
  members: GroupMember[]
  mergedPreferences: UserPreference[]
  createdAt: string
}

export interface ItineraryItem {
  id: string
  title: string
  description: string
  time: string
  location?: {
    name: string
    address?: string
    coordinates?: [number, number]
  }
  category: string
  image_url?: string
  reasoning?: string
  price_range?: string
  duration?: string
  booking_url?: string
  tags?: string[]
}

export interface Itinerary {
  id: string
  title: string
  description: string
  duration: '1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '6-day' | '7-day'
  items: ItineraryItem[]
  created_at: string
  user_preferences: UserPreference[]
  group_profile?: GroupProfile
  location?: string
  budget_range?: string
  theme?: string
  share_url?: string
}

export interface TasteInput {
  text: string
  category?: string
  confidence?: number
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    action?: 'generate' | 'refine' | 'explain' | 'modify'
    preferences?: UserPreference[]
    context?: string
  }
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  currentItinerary?: Itinerary
  userPreferences: UserPreference[]
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface FilterOptions {
  budget?: 'low' | 'medium' | 'high'
  duration?: string
  categories?: string[]
  location?: string
  date?: string
  group_size?: number
}

export interface CrossDomainInsight {
  source_preference: UserPreference
  target_category: string
  reasoning: string
  examples: string[]
} 