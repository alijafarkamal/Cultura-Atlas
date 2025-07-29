'use client'

import { useState } from 'react'
import { Menu, X, Sparkles, Globe, Users, Zap } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="Cultura Atlas Logo" 
                width={48} 
                height={48}
                className="object-cover rounded-2xl"
                priority
              />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Cultura Atlas</span>
              <div className="text-xs text-amber-300 font-medium">Global Cultural Explorer</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">Features</a>
            <a href="#how-it-works" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">How it Works</a>
            <a href="#pricing" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">Pricing</a>
            <a href="#about" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">About</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="btn-outline">Sign In</button>
            <button className="btn-primary">Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-amber-300 transition-colors p-2 rounded-lg hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect rounded-xl p-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">Features</a>
              <a href="#how-it-works" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">How it Works</a>
              <a href="#pricing" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">Pricing</a>
              <a href="#about" className="text-white font-semibold hover:text-amber-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">About</a>
              <div className="pt-4 border-t border-white/20">
                <button className="btn-outline w-full mb-2">Sign In</button>
                <button className="btn-primary w-full">Get Started</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/25 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white text-sm font-medium">AI-Powered Cultural Discovery</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your Perfect
            <span className="block text-amber-300 font-extrabold">Cultural Journey</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            Let AI craft personalized itineraries based on your unique tastes. 
            From jazz to sushi, art to adventure - we connect your passions to unforgettable experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button className="btn-primary text-lg px-8 py-4">
              Start Your Journey
            </button>
            <button className="btn-outline text-lg px-8 py-4">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-white">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center cultural-pattern">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Cross-Domain Discovery</h3>
            <p className="text-white/70">Find hidden connections between your favorite music, food, art, and travel experiences.</p>
          </div>

          <div className="card text-center cultural-pattern">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Group Planning</h3>
            <p className="text-white/70">Merge multiple tastes to create perfect itineraries for couples, families, and friends.</p>
          </div>

          <div className="card text-center cultural-pattern">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">AI Concierge</h3>
            <p className="text-white/70">Chat with your personal cultural assistant to refine and perfect your travel plans.</p>
          </div>
        </div>
      </section>
    </header>
  )
} 