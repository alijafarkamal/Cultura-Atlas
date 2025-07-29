'use client'

import { useState } from 'react'
import { TasteInput, UserPreference, Itinerary, CrossDomainInsight } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TasteInputForm from '@/components/TasteInputForm'
import ItineraryDisplay from '@/components/ItineraryDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'
import ChatInterface from '@/components/ChatInterface'
import TasteInsights from '@/components/TasteInsights'
import { Sparkles, Globe, Users, Zap, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  const [preferences, setPreferences] = useState<UserPreference[]>([])
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<CrossDomainInsight[]>([])
  const [showChat, setShowChat] = useState(false)
  const [activeSection, setActiveSection] = useState<'input' | 'results'>('input')

  const handleGenerateItinerary = async (duration: '1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '6-day' | '7-day' = '1-day', location?: string) => {
    if (preferences.length === 0) {
      setError('Please add at least one preference')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences,
          duration,
          location,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate itinerary')
      }

      setItinerary(data.itinerary)
      setActiveSection('results')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const addPreference = (input: TasteInput) => {
    const newPreference: UserPreference = {
      id: `pref-${Date.now()}`,
      name: input.text,
      category: input.category || 'general',
    }
    setPreferences(prev => [...prev, newPreference])
  }

  const removePreference = (id: string) => {
    setPreferences(prev => prev.filter(p => p.id !== id))
  }

  const clearAll = () => {
    setPreferences([])
    setItinerary(null)
    setError(null)
    setActiveSection('input')
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Main App Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Tabs */}
          <div className="flex justify-center mb-12">
            <div className="glass-effect rounded-2xl p-2">
              <button
                onClick={() => setActiveSection('input')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeSection === 'input'
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Plan Your Trip
              </button>
              <button
                onClick={() => setActiveSection('results')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeSection === 'results'
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
                disabled={!itinerary}
              >
                Your Itinerary
              </button>
            </div>
          </div>

          {/* Main Content */}
          {activeSection === 'input' ? (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Input Form */}
              <div className="space-y-8">
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">What are your tastes?</h2>
                      <p className="text-white/70">Tell us what you love and we'll craft the perfect cultural journey</p>
                    </div>
                  </div>

                  <TasteInputForm
                    onAddPreference={addPreference}
                    preferences={preferences}
                    onRemovePreference={removePreference}
                    onClearAll={clearAll}
                    onGenerateItinerary={handleGenerateItinerary}
                    loading={loading}
                  />
                </div>

                {/* Features Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card text-center cultural-pattern">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Global Coverage</h3>
                    <p className="text-white/60 text-sm">50+ cities worldwide</p>
                  </div>
                  <div className="card text-center cultural-pattern">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Group Planning</h3>
                    <p className="text-white/60 text-sm">Perfect for couples & families</p>
                  </div>
                  <div className="card text-center cultural-pattern">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">AI Powered</h3>
                    <p className="text-white/60 text-sm">Smart cultural matching</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview & Chat */}
              <div className="space-y-8">
                {error && (
                  <div className="card bg-red-500/20 border-red-400/30">
                    <p className="text-red-200">{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="card text-center">
                    <LoadingSpinner />
                    <p className="text-white/80 mt-4 text-lg">
                      Crafting your perfect itinerary...
                    </p>
                    <p className="text-white/60 mt-2">
                      Analyzing your cultural preferences and finding hidden gems
                    </p>
                  </div>
                )}

                {!loading && !itinerary && (
                  <div className="card">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Star className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Ready to Discover?</h3>
                      <p className="text-white/70 mb-6">
                        Add your preferences and let our AI create a personalized cultural journey just for you.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-white/60">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Add your favorite music, food, or activities</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-white/60">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Choose your destination and duration</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-white/60">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span>Get your personalized itinerary</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <ChatInterface
                  userPreferences={preferences}
                  currentItinerary={itinerary || undefined}
                  onItineraryUpdate={setItinerary}
                />
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-8">
              {itinerary && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Your Cultural Journey</h2>
                      <p className="text-white/70">Crafted specifically for your unique tastes</p>
                    </div>
                    <button
                      onClick={() => setActiveSection('input')}
                      className="btn-outline"
                    >
                      Plan Another Trip
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      {itinerary && <ItineraryDisplay itinerary={itinerary} />}
                    </div>
                    <div className="space-y-6">
                      <TasteInsights insights={insights || []} userPreferences={preferences} />
                      
                      <div className="card">
                        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <button className="w-full btn-secondary">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Share Itinerary
                          </button>
                          <button 
                            onClick={async () => {
                              if (itinerary && itinerary.items) {
                                try {
                                  const element = document.getElementById('itinerary-content')
                                  if (!element) return

                                  const { default: html2canvas } = await import('html2canvas')
                                  const { default: jsPDF } = await import('jspdf')

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
                            }}
                            className="w-full btn-outline"
                          >
                            Download PDF
                          </button>
                          <button className="w-full btn-outline">
                            Book Experiences
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-amber-300 font-extrabold">Cultura Atlas</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We combine the power of AI with cultural intelligence to create experiences that truly match your personality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-solid">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Matching</h3>
              <p className="text-gray-600 mb-4">
                Our advanced AI analyzes your cultural preferences to find perfect matches across domains.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cross-domain cultural connections</li>
                <li>• Personalized recommendations</li>
                <li>• Hidden gem discovery</li>
              </ul>
            </div>

            <div className="card-solid">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Group Intelligence</h3>
              <p className="text-gray-600 mb-4">
                Merge multiple preferences to create perfect itineraries for couples, families, and friends.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multi-person preference merging</li>
                <li>• Conflict resolution</li>
                <li>• Shared experience planning</li>
              </ul>
            </div>

            <div className="card-solid">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Refinement</h3>
              <p className="text-gray-600 mb-4">
                Chat with your AI concierge to refine and perfect your travel plans in real-time.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Conversational AI interface</li>
                <li>• Instant itinerary updates</li>
                <li>• Cultural context explanations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How <span className="text-amber-300 font-extrabold">Cultura Atlas</span> Works
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Our AI-powered platform creates personalized cultural journeys in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Share Your Tastes</h3>
              <p className="text-white/80 mb-6">
                Tell us what you love - from music and food to art and activities. Our AI understands your cultural preferences.
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-yellow-300 font-medium">"I love jazz, sushi, and hiking"</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>
              <p className="text-white/80 mb-6">
                Our AI analyzes your preferences using Qloo's cultural graph and finds cross-domain connections.
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-yellow-300 font-medium">"Jazz + Sushi = Live music restaurants"</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 via-purple-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎯</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get Your Journey</h3>
              <p className="text-white/80 mb-6">
                Receive a personalized itinerary with cultural insights, hidden gems, and perfect timing.
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-yellow-300 font-medium">"Your perfect cultural day in NYC"</p>
              </div>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
                              <h3 className="text-2xl font-bold text-white mb-8">The Cultura Atlas Flow</h3>
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="text-center">
                                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold">🎵</span>
                </div>
                <p className="text-white text-sm">Your Tastes</p>
              </div>
              <ArrowRight className="w-8 h-8 text-amber-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold">🧠</span>
                </div>
                <p className="text-white text-sm">AI Analysis</p>
              </div>
              <ArrowRight className="w-8 h-8 text-amber-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold">🗺️</span>
                </div>
                <p className="text-white text-sm">Qloo Graph</p>
              </div>
              <ArrowRight className="w-8 h-8 text-amber-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold">✨</span>
                </div>
                <p className="text-white text-sm">Your Journey</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple <span className="text-amber-300 font-extrabold">Pricing</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Choose the plan that fits your travel style. All plans include our AI-powered cultural matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="card-solid relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $0<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for trying out Cultura Atlas</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    3 itineraries per month
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic AI recommendations
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Single user
                  </li>
                  <li className="flex items-center text-gray-500">
                    <span className="text-gray-400 mr-2">✗</span>
                    Group planning
                  </li>
                  <li className="flex items-center text-gray-500">
                    <span className="text-gray-400 mr-2">✗</span>
                    Priority support
                  </li>
                </ul>
                <button className="w-full btn-outline text-gray-900 border-gray-300 hover:bg-gray-100">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="card-solid relative border-2 border-amber-400 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $19<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For serious cultural explorers</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited itineraries
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced AI matching
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Group planning (up to 4 people)
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Cultural insights
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Priority support
                  </li>
                </ul>
                <button className="w-full btn-primary">
                  Start Pro Trial
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="card-solid relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $99<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For teams and organizations</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited team members
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom integrations
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    API access
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Dedicated support
                  </li>
                </ul>
                <button className="w-full btn-outline text-gray-900 border-gray-300 hover:bg-gray-100">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-amber-300 font-extrabold">Cultura Atlas</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We're revolutionizing travel planning by combining AI with cultural intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
              <p className="text-white/80 mb-6 text-lg leading-relaxed">
                Cultura Atlas was born from a simple idea: what if we could use AI to understand not just where people want to go, 
                but why they want to go there? We believe that travel is about more than just visiting places - it's about 
                connecting with cultures, discovering new perspectives, and creating meaningful experiences.
              </p>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                By leveraging Qloo's cultural graph and advanced AI, we create personalized journeys that go beyond typical 
                tourist recommendations. We find the hidden connections between your tastes and the world's cultural offerings.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                                <div className="text-3xl font-bold text-amber-300 mb-2">50+</div>
              <div className="text-white/70">Cities Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300 mb-2">10K+</div>
              <div className="text-white/70">Happy Travelers</div>
            </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card cultural-pattern">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">AI-Powered Innovation</h4>
                    <p className="text-white/70">
                      We use cutting-edge AI to analyze cultural preferences and create meaningful connections across domains.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card cultural-pattern">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Global Cultural Network</h4>
                    <p className="text-white/70">
                      Partnered with Qloo to access the world's largest cultural preference graph and recommendation engine.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card cultural-pattern">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Community Driven</h4>
                    <p className="text-white/70">
                      Built by travelers, for travelers. Every feature is designed to enhance your cultural exploration journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 