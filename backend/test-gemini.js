require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', process.env.GOOGLE_API_KEY ? 'Present' : 'Missing');
    
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not found in environment');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = "Hello, can you respond with 'Gemini API is working!'?";
    
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini Response:', text);
    console.log('✅ Gemini API is working correctly!');
    
  } catch (error) {
    console.error('❌ Gemini API Error:');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
  }
}

testGemini();