require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { fetch } = require('undici');

async function listModels() {
  try {
    console.log('Checking available Gemini models...');
    
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not found');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // Try direct API call to check key validity
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_API_KEY}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ API Key is valid!');
      console.log('Available models:', data.models?.map(m => m.name) || 'None');
      return;
    } else {
      console.log('❌ API Error:', data.error?.message || 'Unknown error');
    }
    
    // Test common model names
    const commonModels = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'text-bison-001'
    ];
    
    console.log('\n🔍 Testing common models:');
    
    for (const modelName of commonModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        console.log(`✅ ${modelName} - WORKING`);
        break; // Stop at first working model
      } catch (error) {
        console.log(`❌ ${modelName} - ${error.status || 'ERROR'}: ${error.message.split(':')[0]}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error listing models:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    
    if (error.status === 403) {
      console.log('\n💡 Possible fixes:');
      console.log('1. Enable Generative Language API in Google Cloud Console');
      console.log('2. Check API key permissions');
      console.log('3. Verify billing is enabled');
    }
  }
}

listModels();