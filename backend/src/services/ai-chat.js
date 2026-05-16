const Groq = require('groq-sdk');
const { getDb } = require('../database/init');

let groq = null;
let chatHistories = new Map(); // sessionId -> messages array

const SYSTEM_PROMPT = `You are VedaHeal — an expert Ayurvedic wellness guide chatbot. You have deep knowledge of:
- Ayurvedic herbs (Dravyaguna), their properties (Rasa, Virya, Vipaka, Prabhav), dosage, and safety
- Yoga asanas, pranayama, mudras, and meditation for specific health conditions
- Ayurvedic diet (Ahara) and lifestyle (Vihara) recommendations
- Dosha theory (Vata, Pitta, Kapha) and Prakriti assessment
- Classical Ayurvedic texts: Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Bhavaprakash Nighantu
- Panchakarma therapies and their indications

RULES:
1. Always respond in a warm, caring, knowledgeable tone — like a trusted Ayurvedic doctor friend.
2. When user describes a health problem, ask 2-3 follow-up questions to understand severity, duration, and triggers before giving recommendations.
3. Give specific, actionable advice — herb names with dosage, yoga poses with duration, diet specifics.
4. Always include a brief disclaimer that this is wellness guidance, not medical advice.
5. Include Hindi names of herbs in parentheses when possible.
6. If user asks about something dangerous or outside Ayurveda scope, politely redirect.
7. Keep responses concise but complete. Use bullet points and bold for readability.
8. When recommending herbs, mention: name, how to use, dosage, and key precaution.
9. Suggest a simple daily routine/schedule when giving a healing plan.
10. Support both English and Hindi queries.
11. For serious conditions (cancer, heart attack, stroke), always advise seeing a doctor immediately.
12. Use emojis sparingly for warmth (🌿, 🧘, 🍽️, ⚠️).
13. If user greets, introduce yourself briefly and ask what health concern they have.`;

function initAI() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log('  ℹ️  No GROQ_API_KEY found. Chat will use rule-based mode.');
    return false;
  }

  try {
    groq = new Groq({ apiKey });
    console.log('  ✅ Groq AI (Llama 3) initialized for chat');
    return true;
  } catch (err) {
    console.log('  ⚠️  Groq AI init failed:', err.message);
    return false;
  }
}

async function getAIResponse(message, context) {
  if (!groq) return null;

  const sessionId = context.sessionId || 'default';

  try {
    // Get or create chat history
    let history = chatHistories.get(sessionId);
    if (!history) {
      // Build initial context from DB
      const dbContext = buildDBContext(message);
      history = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `Here is relevant data from our Ayurvedic database:\n${dbContext}` }
      ];
      chatHistories.set(sessionId, history);

      // Clean old sessions
      if (chatHistories.size > 50) {
        const firstKey = chatHistories.keys().next().value;
        chatHistories.delete(firstKey);
      }
    }

    // Add user message
    history.push({ role: 'user', content: message });

    // Keep history manageable (last 20 messages + system)
    const systemMsgs = history.filter(m => m.role === 'system');
    const chatMsgs = history.filter(m => m.role !== 'system').slice(-16);
    const trimmedHistory = [...systemMsgs, ...chatMsgs];

    // Update DB context for new queries
    const freshContext = buildDBContext(message);
    if (freshContext && freshContext !== 'No specific database matches found.') {
      trimmedHistory[1] = { role: 'system', content: `Relevant database info for current query:\n${freshContext}` };
    }

    const completion = await groq.chat.completions.create({
      messages: trimmedHistory,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) return null;

    // Save assistant reply to history
    history.push({ role: 'assistant', content: reply });
    chatHistories.set(sessionId, history);

    return {
      messages: [{ type: 'text', content: reply }],
      context: { ...context, stage: 'ai_chat', sessionId },
      suggestions: generateSuggestions(message, reply)
    };
  } catch (err) {
    console.error('Groq API error:', err.message);
    return null; // Fall back to rule-based
  }
}

function buildDBContext(message) {
  const db = getDb();
  const msgLower = message.toLowerCase();
  let context = '';

  // Find relevant herbs
  const searchTerms = msgLower.split(/\s+/).filter(w => w.length > 3);
  let herbs = [];

  for (const term of searchTerms) {
    const found = db.prepare(`
      SELECT name, name_hi, description, properties, taste, potency, dosha_effect, how_to_use, dosage, side_effects, contraindications
      FROM herbs WHERE name LIKE ? OR description LIKE ? OR properties LIKE ? LIMIT 3
    `).all(`%${term}%`, `%${term}%`, `%${term}%`);
    herbs.push(...found);
  }

  // Deduplicate
  herbs = [...new Map(herbs.map(h => [h.name, h])).values()].slice(0, 5);

  if (herbs.length > 0) {
    context += 'RELEVANT HERBS:\n';
    herbs.forEach(h => {
      context += `• ${h.name}${h.name_hi ? ' (' + h.name_hi + ')' : ''}: ${(h.description || '').substring(0, 150)}\n`;
      if (h.how_to_use && h.how_to_use !== 'Consult a qualified Ayurvedic practitioner for proper usage and dosage.') {
        context += `  Usage: ${h.how_to_use}\n`;
      }
      if (h.dosage && h.dosage !== 'As directed by Ayurvedic practitioner.') {
        context += `  Dosage: ${h.dosage}\n`;
      }
      if (h.contraindications) context += `  Avoid: ${h.contraindications}\n`;
    });
  }

  // Find relevant symptoms/remedies
  const symptoms = db.prepare(`
    SELECT id, name, name_hi, description, dosha_association FROM symptoms
    WHERE name LIKE ? OR description LIKE ? LIMIT 2
  `).all(`%${msgLower}%`, `%${msgLower}%`);

  if (symptoms.length > 0) {
    context += '\nHEALTH CONDITIONS:\n';
    for (const sym of symptoms) {
      context += `• ${sym.name} (${sym.name_hi || ''}): ${sym.description}. Dosha: ${sym.dosha_association}\n`;

      const remedies = db.prepare(`
        SELECT title, type, how_to_use FROM remedies WHERE symptom_id = ? LIMIT 4
      `).all(sym.id);

      if (remedies.length > 0) {
        remedies.forEach(r => {
          context += `  - ${r.title} (${r.type}): ${(r.how_to_use || '').substring(0, 80)}\n`;
        });
      }
    }
  }

  return context || 'No specific database matches found.';
}

function generateSuggestions(message, response) {
  const suggestions = [];
  const respLower = response.toLowerCase();

  if (respLower.includes('herb') || respLower.includes('ashwagandha') || respLower.includes('remedy')) {
    suggestions.push('Any side effects?');
  }
  if (respLower.includes('yoga') || respLower.includes('asana') || respLower.includes('pranayama')) {
    suggestions.push('Show me the steps');
  }
  if (respLower.includes('diet') || respLower.includes('food') || respLower.includes('eat')) {
    suggestions.push('What to avoid?');
  }
  if (respLower.includes('dosha') || respLower.includes('vata') || respLower.includes('pitta')) {
    suggestions.push('How to balance my dosha?');
  }

  if (suggestions.length < 3) {
    suggestions.push('Tell me more');
    suggestions.push('I have another problem');
  }

  return suggestions.slice(0, 4);
}

function isAIAvailable() {
  return groq !== null;
}

module.exports = { initAI, getAIResponse, isAIAvailable };
