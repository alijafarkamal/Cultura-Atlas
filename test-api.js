// Test script for API validation
// Run with: node test-api.js

require('dotenv').config({ path: '.env.local' })

const API_URL = 'https://hackathon.api.qloo.com'
const QLOO_TOKEN = process.env.QLOO_API_TOKEN
const GEMINI_KEY = process.env.GEMINI_API_KEY

const headers = {
  accept: 'application/json',
  'X-Api-Key': QLOO_TOKEN
}

async function fetchQloo(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, { headers })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

async function testQlooAPI() {
  console.log('🧪 Testing Qloo Hackathon API...')
  
  if (!QLOO_TOKEN) {
    console.log('❌ QLOO_API_TOKEN not found in environment variables')
    return false
  }

  try {
    console.log('🔍 Testing search endpoint...')
    const searchResults = await fetchQloo('/search?query=jazz&page=1&take=10')
    console.log('✅ Search endpoint working')
    console.log('📊 Search results:', searchResults.results?.length || 0, 'entities found')

    console.log('🔍 Testing basic search with different query...')
    const searchResults2 = await fetchQloo('/search?query=rock&page=1&take=5')
    console.log('✅ Second search working')
    console.log('📊 Second search results:', searchResults2.results?.length || 0, 'entities found')

    console.log('🔍 Testing search with category filter...')
    const searchResults3 = await fetchQloo('/search?query=music&page=1&take=5')
    console.log('✅ Category search working')
    console.log('📊 Category search results:', searchResults3.results?.length || 0, 'entities found')

    return true
  } catch (error) {
    console.log('❌ Qloo API test failed:', error.message)
    console.log('🔍 Error details:', error)
    return false
  }
}

async function testGeminiAPI() {
  console.log('\n🧪 Testing Gemini API...')
  
  if (!GEMINI_KEY) {
    console.log('❌ GEMINI_API_KEY not found in environment variables')
    return false
  }

  try {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY })

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Say 'Hello, Gemini API is working!'",
    })
    
    console.log('✅ Gemini API working')
    console.log('📝 Response:', response.text)
    return true
  } catch (error) {
    console.log('❌ Gemini API test failed:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n')
  
  const qlooTest = await testQlooAPI()
  const geminiTest = await testGeminiAPI()
  
  console.log('\n📋 Test Results:')
  console.log(`Qloo API: ${qlooTest ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Gemini API: ${geminiTest ? '✅ PASS' : '❌ FAIL'}`)
  
  if (qlooTest && geminiTest) {
    console.log('\n🎉 All tests passed! Your APIs are ready to use.')
  } else {
    console.log('\n⚠️  Some tests failed. Check your API keys and try again.')
  }
}

runTests().catch(console.error) 