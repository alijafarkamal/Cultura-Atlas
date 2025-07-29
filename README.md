# Cultura Atlas 🎯

An AI-powered cultural itinerary planner that creates personalized trips based on your taste using the Qloo Taste Graph API and Google Gemini LLM.

## ✨ Features

- **🎯 Taste-Based Recommendations**: Input your preferences (food, music, movies, etc.) and get personalized recommendations
- **🤖 AI-Generated Itineraries**: Natural language trip plans crafted by Google Gemini
- **🌐 Cross-Domain Discovery**: Find restaurants, music venues, cultural activities, and more
- **💬 Conversational AI**: Chat with your cultural concierge for personalized assistance
- **🔍 Cultural Insights**: Discover cross-domain connections and cultural patterns
- **👥 Group Planning**: Merge multiple people's tastes for collaborative itineraries
- **🗺️ Location Support**: Optional location-based recommendations
- **📅 Flexible Duration**: 1-day, 2-day, 3-day, or weekend plans
- **🎨 Beautiful UI**: Modern, responsive interface with Tailwind CSS
- **🔄 Real-time Refinement**: Modify and refine itineraries through conversation

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with React 18 and TypeScript
- **Styling**: Tailwind CSS
- **APIs**: 
  - Qloo Taste Graph API for recommendations
  - Google Gemini for natural language itinerary generation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Qloo API key
- Google Gemini API key

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cultura-atlas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   QLOO_API_TOKEN=your_qloo_api_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Get API Keys**
   - **Qloo API**: Sign up at [Qloo](https://qloo.com) and get your API key
   - **Google Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Add Your Preferences**: Enter things you love (e.g., "jazz", "sushi", "hiking")
2. **Choose Categories**: Select relevant categories for each preference
3. **Set Location** (optional): Add a specific city or location
4. **Select Duration**: Choose between 1-day or 2-day trips
5. **Generate**: Click "Generate My Itinerary" to create your personalized plan

## 🏗️ Project Structure

```
cultura-atlas/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── generate-itinerary/route.ts
│   │   ├── chat/route.ts
│   │   └── analyze-taste/route.ts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── TasteInputForm.tsx # User preference input
│   ├── ItineraryDisplay.tsx # Itinerary visualization
│   ├── LoadingSpinner.tsx # Loading states
│   ├── ChatInterface.tsx  # Conversational AI
│   ├── TasteInsights.tsx  # Cultural connections
│   └── MapDisplay.tsx     # Optional map component
├── lib/                   # API services
│   ├── qloo-api.ts        # Qloo API integration
│   └── gemini-api.ts      # Gemini API integration
├── types/                 # TypeScript type definitions
│   └── index.ts
└── package.json
```

## 🔧 API Integration

### Qloo Taste Graph API
- **Search**: Find entities based on user input
- **Recommendations**: Get cross-domain recommendations
- **Taste Analysis**: Generate cultural profiles and insights
- **Group Planning**: Merge multiple user preferences
- **Categories**: Restaurants, music, movies, travel, activities, art, books, fashion

### Google Gemini
- **Itinerary Generation**: Create natural language trip plans
- **Conversational AI**: Chat-based interaction and refinement
- **Cultural Context**: Add insights and cultural background
- **Cross-Domain Insights**: Explain cultural connections
- **Structured Output**: JSON-formatted responses

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for custom component styles

### Categories
- Add new categories in `components/TasteInputForm.tsx`
- Update category icons in `components/ItineraryDisplay.tsx`

### API Prompts
- Customize Gemini prompts in `lib/gemini-api.ts`
- Modify Qloo API parameters in `lib/qloo-api.ts`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app is compatible with any Node.js hosting platform that supports Next.js.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Qloo](https://qloo.com) for the Taste Graph API
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling 