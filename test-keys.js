require('dotenv').config({ path: '.env.local' })

console.log('Testing API Keys...')
console.log('QLOO_API_TOKEN:', process.env.QLOO_API_TOKEN ? 'Found' : 'Not found')
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Found' : 'Not found')

if (process.env.GEMINI_API_KEY) {
  console.log('✅ Gemini API key is available')
} else {
  console.log('❌ Gemini API key is missing')
}

if (process.env.QLOO_API_TOKEN) {
  console.log('✅ Qloo API key is available')
} else {
  console.log('❌ Qloo API key is missing')
} 