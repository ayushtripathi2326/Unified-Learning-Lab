require('dotenv').config();

console.log('🔍 Checking environment variables:');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'Present' : 'Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
console.log('NVIDIA_API_KEY:', process.env.NVIDIA_API_KEY ? 'Present' : 'Missing');
console.log('PERPLEXITY_API_KEY:', process.env.PERPLEXITY_API_KEY ? 'Present' : 'Missing');

const models = [
    {
        id: 'built-in',
        name: 'Built-in AI',
        description: 'Context-aware assistant available without external API keys',
        requiresApiKey: false,
        default: true
    }
];

// Add OpenAI models if API key exists
if (process.env.OPENAI_API_KEY) {
    models.push({
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Fast, reliable everyday assistant',
        requiresApiKey: false
    });
}

// Add Google Gemini if API key exists
if (process.env.GOOGLE_API_KEY) {
    models.push({
        id: 'gemini-2.5-flash',
        name: 'Google Gemini 2.5 Flash',
        description: 'Latest and most efficient AI model',
        requiresApiKey: false
    });
}

if (process.env.GROQ_API_KEY) {
    models.push({
        id: 'groq-llama-3.1-8b-instant',
        name: 'Groq LLaMA 3.1 8B',
        description: 'Fast responses powered by Groq inference',
        requiresApiKey: false
    });
}

if (process.env.NVIDIA_API_KEY) {
    models.push({
        id: 'nvidia-llama-3.1-8b',
        name: 'NVIDIA NIM LLaMA 3.1 8B',
        description: 'High-performance responses via NVIDIA NIM',
        requiresApiKey: false
    });
}

if (process.env.PERPLEXITY_API_KEY) {
    models.push({
        id: 'perplexity-llama-3.1-sonar-small',
        name: 'Perplexity Sonar Small',
        description: 'Search-augmented answers from Perplexity',
        requiresApiKey: false
    });
}

console.log('\n📋 Available models:');
models.forEach(model => {
    console.log(`- ${model.name} (${model.id})`);
});

console.log(`\n✅ Total models: ${models.length}`);