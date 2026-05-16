const express = require('express');
const router = express.Router();
const { getDb } = require('../database/init');
const { getAIResponse, isAIAvailable } = require('../services/ai-chat');

router.post('/', async (req, res) => {
  const db = getDb();
  const { message, context } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  const ctx = context || { stage: 'greeting', history: [], answers: {} };
  const msg = message.trim();
  const msgLower = msg.toLowerCase();

  // Track history
  ctx.history = ctx.history || [];
  ctx.history.push(msg);
  if (ctx.history.length > 10) ctx.history.shift();

  // Try AI first if available
  if (isAIAvailable() && ctx.stage !== 'greeting') {
    const aiResponse = await getAIResponse(msg, ctx);
    if (aiResponse) {
      return res.json(aiResponse);
    }
    // If AI fails, fall through to rule-based
  }

  const response = processMessage(db, msg, msgLower, ctx);
  res.json(response);
});

// ================ MAIN ROUTER ================
function processMessage(db, msg, msgLower, ctx) {
  // Universal intents that work regardless of stage
  if (isGreetingMsg(msgLower)) return greeting(db, ctx);
  if (msgLower.match(/^(yes|yeah|haan|ok|okay|sure|please|han|ha)$/)) {
    if (ctx.lastSuggestion) return handleSuggestion(db, ctx.lastSuggestion, ctx);
  }
  if (isThankYou(msgLower)) return thankResponse(ctx);
  if (isReset(msgLower)) return greeting(db, { history: [], answers: {} });

  // Check for herb queries
  const herbQuery = detectHerb(db, msgLower);
  if (herbQuery) return showHerbDetails(db, herbQuery, ctx);

  // Check for "what about X for Y" type queries
  if (msgLower.match(/best (herb|medicine|remedy|treatment) for/i) ||
      msgLower.match(/which (herb|medicine|remedy) for/i)) {
    const sym = detectSymptom(db, msgLower);
    if (sym) return showTopHerbsForSymptom(db, sym, ctx);
  }

  // Compare herbs
  if (msgLower.includes('compare') || msgLower.includes('difference between')) {
    return handleComparison(db, msgLower, ctx);
  }

  // Stage-based routing
  switch (ctx.stage) {
    case 'greeting':
    case 'identify_problem':
      return identifyProblem(db, msg, msgLower, ctx);
    case 'ask_severity':
      return handleSeverity(db, msgLower, ctx);
    case 'ask_duration':
      return handleDuration(db, msgLower, ctx);
    case 'ask_trigger':
      return handleTrigger(db, msg, ctx);
    case 'ask_extra':
      return handleExtra(db, msg, ctx);
    case 'follow_up':
      return handleFollowUp(db, msg, msgLower, ctx);
    default:
      return identifyProblem(db, msg, msgLower, ctx);
  }
}

// ================ GREETING ================
function greeting(db, ctx) {
  return {
    messages: [{
      type: 'text',
      content: 'Namaste! 🙏 I\'m your Ayurvedic wellness companion.'
    }, {
      type: 'text',
      content: 'Tell me what\'s troubling you, and I\'ll create a personalized healing plan with herbs, yoga, diet, and a daily schedule — all based on ancient Ayurvedic wisdom.'
    }, {
      type: 'quick_help',
      content: {
        title: 'You can ask me about:',
        items: [
          { icon: '🤒', text: 'Any health problem you\'re facing' },
          { icon: '🌿', text: 'Information about specific herbs' },
          { icon: '🧘', text: 'Yoga and pranayama practices' },
          { icon: '🍽️', text: 'Diet and food recommendations' }
        ]
      }
    }],
    context: { ...ctx, stage: 'identify_problem' },
    suggestions: ['I have acidity', 'Back pain since long', 'Can\'t sleep at night', 'Tell me about Ashwagandha', 'Stress and anxiety']
  };
}

function isGreetingMsg(m) {
  return ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hii', 'helo', 'start', 'begin'].some(g => m === g || m.startsWith(g + ' '));
}

function isThankYou(m) {
  return ['thank', 'thanks', 'dhanyavad', 'shukriya', 'bahut accha', 'great', 'awesome'].some(t => m.includes(t));
}

function isReset(m) {
  return ['reset', 'start over', 'restart', 'new chat', 'clear'].some(r => m.includes(r));
}

function thankResponse(ctx) {
  return {
    messages: [{
      type: 'text',
      content: '🙏 You\'re most welcome! Wishing you good health and balance.'
    }, {
      type: 'text',
      content: 'Remember — Ayurveda works gradually but deeply. Stay consistent with the routine for at least 2-4 weeks. I\'m here whenever you need guidance.'
    }],
    context: { ...ctx, stage: 'follow_up' },
    suggestions: ['Another health problem', 'Tell me about a herb', 'Take dosha quiz']
  };
}

// ================ PROBLEM IDENTIFICATION ================
function identifyProblem(db, msg, msgLower, ctx) {
  const detected = detectSymptom(db, msgLower);

  if (detected) {
    return {
      messages: [{
        type: 'text',
        content: `I understand — you're dealing with **${detected.name}** ${detected.name_hi ? `(${detected.name_hi})` : ''}.`
      }, {
        type: 'symptom_card',
        content: {
          name: detected.name,
          dosha: detected.dosha_association,
          description: detected.description,
          message: `In Ayurveda, this is typically associated with imbalanced **${detected.dosha_association} dosha**. Let me ask a few questions to give you the most effective personalized plan.`
        }
      }, {
        type: 'text',
        content: 'How **severe** is your condition?'
      }],
      context: { ...ctx, stage: 'ask_severity', symptom_id: detected.id, symptom: detected, answers: {} },
      suggestions: ['Mild — comes occasionally', 'Moderate — daily discomfort', 'Severe — constantly affects me']
    };
  }

  // Maybe multi-symptom?
  const allSymptoms = db.prepare('SELECT * FROM symptoms ORDER BY name').all();
  return {
    messages: [{
      type: 'text',
      content: 'I want to help you, but I\'m not quite sure what you mean. Could you describe it differently or pick from below?'
    }, {
      type: 'symptom_grid',
      content: { symptoms: allSymptoms.slice(0, 8) }
    }],
    context: { ...ctx, stage: 'identify_problem' },
    suggestions: allSymptoms.slice(0, 5).map(s => s.name)
  };
}

// ================ SEVERITY ================
function handleSeverity(db, msgLower, ctx) {
  let severity = 'moderate';
  if (/(mild|slight|little|occasion|halka|thoda|sometimes)/.test(msgLower)) severity = 'mild';
  else if (/(severe|very|extreme|worst|bahut|constant|terrible|unbearable)/.test(msgLower)) severity = 'severe';

  ctx.answers.severity = severity;

  return {
    messages: [{
      type: 'text',
      content: `Understood — **${severity}** severity noted. ${severity === 'severe' ? '💚 Don\'t worry, we\'ll address this thoroughly.' : ''}`
    }, {
      type: 'text',
      content: 'How long have you been experiencing this?'
    }],
    context: { ...ctx, stage: 'ask_duration' },
    suggestions: ['Just started (few days)', 'A few weeks', '1-3 months', 'More than 6 months', 'Years now']
  };
}

// ================ DURATION ================
function handleDuration(db, msgLower, ctx) {
  let duration = 'months';
  if (/(few day|just start|recent|new|abhi|naya|2-3 day)/.test(msgLower)) duration = 'recent';
  else if (/(week|2 week)/.test(msgLower)) duration = 'recent';
  else if (/(year|long time|6 month|chronic|kaafi|bahut din|always|years)/.test(msgLower)) duration = 'chronic';

  ctx.answers.duration = duration;

  const triggerQ = getTriggerQuestion(ctx.symptom);
  return {
    messages: [{
      type: 'text',
      content: 'Got it. Now one more important question to personalize this for you:'
    }, {
      type: 'text',
      content: triggerQ.question
    }],
    context: { ...ctx, stage: 'ask_trigger' },
    suggestions: triggerQ.suggestions
  };
}

// ================ TRIGGER ================
function handleTrigger(db, msg, ctx) {
  ctx.answers.trigger = msg;

  const extraQ = getExtraQuestion(ctx.symptom);
  if (extraQ) {
    return {
      messages: [{
        type: 'text',
        content: 'One last quick question:'
      }, {
        type: 'text',
        content: extraQ.question
      }],
      context: { ...ctx, stage: 'ask_extra' },
      suggestions: extraQ.suggestions
    };
  }

  return generateProtocol(db, ctx);
}

// ================ EXTRA ================
function handleExtra(db, msg, ctx) {
  ctx.answers.extra = msg;
  return generateProtocol(db, ctx);
}

// ================ PROTOCOL GENERATION ================
function generateProtocol(db, ctx) {
  const { symptom_id, answers, symptom } = ctx;

  const allRemedies = db.prepare('SELECT * FROM remedies WHERE symptom_id = ?').all(symptom_id);
  const allYoga = db.prepare('SELECT * FROM yoga_exercises WHERE symptom_id = ?').all(symptom_id);
  const topHerbs = db.prepare(`
    SELECT h.*, hsm.effectiveness FROM herb_symptom_map hsm
    JOIN herbs h ON h.id = hsm.herb_id WHERE hsm.symptom_id = ?
    ORDER BY CASE hsm.effectiveness WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END LIMIT 4
  `).all(symptom_id);

  const herbs = allRemedies.filter(r => r.type === 'herb');
  const diet = allRemedies.filter(r => r.type === 'diet');
  const lifestyle = allRemedies.filter(r => r.type === 'lifestyle');
  const homeRemedies = allRemedies.filter(r => r.type === 'home_remedy');

  let intensity, selectedHerbs, selectedYoga, selectedHome, selectedDiet, schedule, encouragement;

  if (answers.severity === 'mild') {
    intensity = 'light';
    selectedHerbs = herbs.slice(0, 2);
    selectedDiet = diet.slice(0, 2);
    selectedYoga = allYoga.filter(y => y.difficulty === 'beginner').slice(0, 3);
    selectedHome = homeRemedies.slice(0, 2);
    schedule = buildLightSchedule(selectedHerbs, selectedYoga, selectedHome);
    encouragement = 'Your condition is mild — you should feel better within 1-2 weeks of consistent practice. Focus on diet and lifestyle first; herbs are supportive.';
  } else if (answers.severity === 'severe' || answers.duration === 'chronic') {
    intensity = 'intensive';
    selectedHerbs = herbs.slice(0, 3);
    selectedDiet = diet.slice(0, 2);
    selectedYoga = allYoga.slice(0, 4);
    selectedHome = homeRemedies.slice(0, 2);
    schedule = buildIntensiveSchedule(selectedHerbs, selectedYoga, selectedHome);
    encouragement = 'This is a deep-rooted condition. Ayurveda will heal it gradually but completely. Be patient — give it 6-8 weeks of consistent practice. Consider consulting an Ayurvedic doctor for Panchakarma therapy too.';
  } else {
    intensity = 'moderate';
    selectedHerbs = herbs.slice(0, 2);
    selectedDiet = diet.slice(0, 2);
    selectedYoga = allYoga.filter(y => y.difficulty !== 'advanced').slice(0, 3);
    selectedHome = homeRemedies.slice(0, 2);
    schedule = buildModerateSchedule(selectedHerbs, selectedYoga, selectedHome);
    encouragement = 'Follow this plan consistently for 2-4 weeks. Most people notice clear improvement within the first 2 weeks. Stay regular — Ayurveda rewards consistency.';
  }

  // Build response messages
  const messages = [
    { type: 'text', content: `Based on your **${answers.severity}** ${symptom.name} (${answers.duration === 'chronic' ? 'long-standing' : answers.duration === 'recent' ? 'recent' : 'few months old'}), here\'s your personalized plan:` },
    { type: 'protocol_summary', content: { symptom: symptom.name, dosha: symptom.dosha_association, intensity, weeks: intensity === 'intensive' ? '6-8' : intensity === 'light' ? '1-2' : '2-4' } }
  ];

  if (selectedHerbs.length > 0) {
    messages.push({
      type: 'remedy_section',
      content: { title: '🌿 Recommended Herbs', items: selectedHerbs }
    });
  }

  if (topHerbs.length > 0) {
    messages.push({
      type: 'herb_chips',
      content: { title: 'These herbs are most effective for your condition:', herbs: topHerbs }
    });
  }

  if (selectedYoga.length > 0) {
    messages.push({
      type: 'yoga_section',
      content: { title: '🧘 Yoga Practice', items: selectedYoga }
    });
  }

  if (selectedDiet.length > 0) {
    messages.push({
      type: 'remedy_section',
      content: { title: '🍽️ Diet Guidance', items: selectedDiet }
    });
  }

  if (selectedHome.length > 0) {
    messages.push({
      type: 'remedy_section',
      content: { title: '🏠 Quick Home Remedies', items: selectedHome }
    });
  }

  messages.push({
    type: 'schedule',
    content: { title: '⏰ Your Daily Schedule', items: schedule }
  });

  messages.push({
    type: 'encouragement',
    content: encouragement
  });

  // Summary card
  const summaryText = buildSummaryText(symptom, answers, selectedHerbs, selectedYoga, selectedDiet, selectedHome, intensity);
  messages.push({
    type: 'text',
    content: summaryText
  });

  return {
    messages,
    context: { ...ctx, stage: 'follow_up', last_protocol: { herbs: selectedHerbs, yoga: selectedYoga, diet: selectedDiet, home: selectedHome } },
    suggestions: ['Tell me more about herbs', 'What foods to avoid?', 'Are there precautions?', 'I have another problem', 'Where to buy herbs?']
  };
}

// ================ FOLLOW-UP ================
function handleFollowUp(db, msg, msgLower, ctx) {
  // New problem detection
  const newSym = detectSymptom(db, msgLower);
  if (newSym && newSym.id !== ctx.symptom_id) {
    return identifyProblem(db, msg, msgLower, ctx);
  }

  // Specific follow-up types
  if (/(precaution|side effect|danger|safe|warning)/.test(msgLower)) {
    const herbs = db.prepare('SELECT title, precautions FROM remedies WHERE symptom_id = ? AND precautions IS NOT NULL').all(ctx.symptom_id);
    return {
      messages: [
        { type: 'text', content: '⚠️ Here are important precautions for your protocol:' },
        { type: 'precaution_list', content: { items: herbs.filter(h => h.precautions) } },
        { type: 'text', content: '💡 General rule: Always start with smaller doses and increase gradually. Stop immediately if you feel any adverse effects, and consult an Ayurvedic doctor.' }
      ],
      context: ctx,
      suggestions: ['What foods to avoid?', 'Tell me about yoga timing', 'Another problem']
    };
  }

  if (/(food|avoid|diet|eat|khana|eating)/.test(msgLower)) {
    const diets = db.prepare('SELECT * FROM remedies WHERE symptom_id = ? AND type = ?').all(ctx.symptom_id, 'diet');
    return {
      messages: [
        { type: 'text', content: '🍽️ Here\'s your complete dietary guidance:' },
        { type: 'remedy_section', content: { title: '', items: diets } }
      ],
      context: ctx,
      suggestions: ['Tell me about herbs', 'Yoga details', 'Another problem']
    };
  }

  if (/(herb|medicine|dawai|tablet)/.test(msgLower)) {
    const herbs = db.prepare('SELECT * FROM remedies WHERE symptom_id = ? AND type = ?').all(ctx.symptom_id, 'herb');
    return {
      messages: [
        { type: 'text', content: '🌿 Here are all the recommended herbs for your condition:' },
        { type: 'remedy_section', content: { title: '', items: herbs } }
      ],
      context: ctx,
      suggestions: ['Where to buy?', 'Yoga details', 'Another problem']
    };
  }

  if (/(yoga|exercise|asana|pranayama)/.test(msgLower)) {
    const yoga = db.prepare('SELECT * FROM yoga_exercises WHERE symptom_id = ?').all(ctx.symptom_id);
    return {
      messages: [
        { type: 'text', content: '🧘 Complete yoga routine for your condition:' },
        { type: 'yoga_section', content: { title: '', items: yoga } }
      ],
      context: ctx,
      suggestions: ['Diet recommendations?', 'Precautions?', 'Another problem']
    };
  }

  if (/(buy|purchase|where|kahan|kaha)/.test(msgLower)) {
    return {
      messages: [
        { type: 'text', content: '🏪 You can buy authentic Ayurvedic herbs from:' },
        { type: 'shop_list', content: {
          stores: [
            { name: 'Patanjali Stores', note: 'Widely available across India' },
            { name: 'Baidyanath / Dabur', note: 'Trusted classical formulations' },
            { name: 'Himalaya / Organic India', note: 'Modern packaging, good quality' },
            { name: 'Local Ayurvedic Pharmacy (Vaidya)', note: 'Best for fresh herbs and consultations' },
            { name: 'Online: Amazon, 1mg, NetMeds, JivaAyurveda', note: 'Convenient, check reviews' }
          ]
        }},
        { type: 'text', content: '💡 Tip: For chronic conditions, consult a qualified Ayurvedic practitioner (BAMS doctor) for personalized formulations.' }
      ],
      context: ctx,
      suggestions: ['Tell me more about herbs', 'Another problem']
    };
  }

  // Smart general knowledge answers (rule-based AI-like)
  const smartAnswer = handleGeneralQuestion(db, msg, msgLower, ctx);
  if (smartAnswer) return smartAnswer;

  // Default
  return {
    messages: [
      { type: 'text', content: 'I can help you with more details. What would you like to know?' },
      { type: 'help_options', content: {
        options: [
          { icon: '🌿', text: 'More about the herbs', query: 'Tell me about the herbs' },
          { icon: '⚠️', text: 'Precautions & safety', query: 'Any precautions?' },
          { icon: '🍽️', text: 'Foods to eat/avoid', query: 'What foods to avoid?' },
          { icon: '🧘', text: 'Yoga details', query: 'Yoga details' },
          { icon: '🏪', text: 'Where to buy', query: 'Where to buy these herbs?' },
          { icon: '🤒', text: 'Another problem', query: 'I have another problem' }
        ]
      }}
    ],
    context: ctx,
    suggestions: []
  };
}

// ================ SMART GENERAL KNOWLEDGE ================
function handleGeneralQuestion(db, msg, msgLower, ctx) {
  // "What is [concept]?" questions
  if (msgLower.match(/what (is|are) (vata|pitta|kapha|dosha|tridosha|prakriti|agni|ama|ojas|rasayana|panchakarma)/)) {
    return answerAyurvedicConcept(msgLower, ctx);
  }

  // "How to improve/boost/increase X" questions
  if (msgLower.match(/(how to|tips for|ways to) (improve|boost|increase|strengthen|build)/)) {
    return answerHowTo(db, msgLower, ctx);
  }

  // "Can I take X with Y" / "Is X safe" questions
  if (msgLower.match(/(can i|is it safe|safe to|ok to)/) && msgLower.match(/(take|use|eat|drink|mix|combine)/)) {
    return answerSafety(db, msgLower, ctx);
  }

  // "Best herb/remedy for X" questions
  if (msgLower.match(/(best|top|most effective|strongest) (herb|remedy|medicine|treatment|cure) for/)) {
    const sym = detectSymptom(db, msgLower);
    if (sym) return showTopHerbsForSymptom(db, sym, ctx);
  }

  // "Difference between X and Y"
  if (msgLower.includes('difference between') || msgLower.includes('vs') || msgLower.includes('versus')) {
    return answerComparison(db, msgLower, ctx);
  }

  // "When to take / timing" questions
  if (msgLower.match(/(when|what time|timing|morning|night|before|after) .*(take|eat|drink|use)/)) {
    return answerTiming(ctx);
  }

  // "How long" questions
  if (msgLower.match(/how (long|many days|many weeks|much time)/)) {
    return answerDuration(ctx);
  }

  // Dosha-related questions
  if (msgLower.match(/(my dosha|which dosha|dosha type|body type|prakriti|constitution)/)) {
    return {
      messages: [{ type: 'text', content: 'To determine your dosha (body constitution), you can take our Dosha Quiz! It asks 10 questions about your body type, digestion, sleep, and temperament.\n\nThe three doshas are:\n• **Vata** (Air+Space) — thin, creative, anxious when imbalanced\n• **Pitta** (Fire+Water) — medium build, focused, angry when imbalanced\n• **Kapha** (Earth+Water) — heavy build, calm, lethargic when imbalanced\n\nMost people are a combination of two doshas. Knowing yours helps personalize all recommendations.' }],
      context: ctx,
      suggestions: ['Take dosha quiz', 'What is Vata?', 'What is Pitta?', 'What is Kapha?']
    };
  }

  // General "help me with" or vague questions — try to detect a symptom
  const sym = detectSymptom(db, msgLower);
  if (sym) {
    return identifyProblem(db, msg, msgLower, ctx);
  }

  return null; // No smart answer found, use default
}

function answerAyurvedicConcept(msgLower, ctx) {
  const concepts = {
    'vata': '**Vata Dosha** (Air + Space)\n\nVata governs all movement in the body — breathing, blood flow, nerve impulses, thoughts. People with Vata constitution are typically thin, creative, energetic, but prone to anxiety, dry skin, constipation, and insomnia when imbalanced.\n\n**Balance Vata with:** warm foods, regular routine, oil massage (Abhyanga), grounding yoga, and calming herbs like Ashwagandha.',
    'pitta': '**Pitta Dosha** (Fire + Water)\n\nPitta governs transformation — digestion, metabolism, body temperature, intellect. Pitta types are medium-built, focused, ambitious, but prone to acidity, inflammation, anger, and skin rashes when imbalanced.\n\n**Balance Pitta with:** cooling foods (coconut, cucumber, mint), avoiding spicy/fried food, Sheetali pranayama, and cooling herbs like Shatavari, Amla.',
    'kapha': '**Kapha Dosha** (Earth + Water)\n\nKapha governs structure — bones, muscles, fluids, immunity. Kapha types are heavy-built, calm, nurturing, but prone to weight gain, congestion, lethargy, and attachment when imbalanced.\n\n**Balance Kapha with:** light/warm/spicy foods, vigorous exercise, early rising, dry massage, and stimulating herbs like Trikatu, Guggulu.',
    'dosha': '**Doshas** are the three fundamental bio-energies in Ayurveda:\n\n• **Vata** (Air+Space) — movement, creativity, nervousness\n• **Pitta** (Fire+Water) — transformation, digestion, anger\n• **Kapha** (Earth+Water) — structure, stability, lethargy\n\nEvery person has a unique combination (Prakriti). Disease occurs when doshas go out of balance (Vikriti). Ayurvedic treatment aims to restore balance.',
    'tridosha': '**Tridosha** means "three doshas" — Vata, Pitta, and Kapha together. A Tridoshic herb or food balances all three doshas — these are rare and very valuable. Examples: Triphala, Amla, Ghee, Guduchi.',
    'prakriti': '**Prakriti** is your birth constitution — the unique ratio of Vata, Pitta, and Kapha you were born with. It never changes. Understanding your Prakriti helps choose the right diet, lifestyle, and herbs for YOU specifically.',
    'agni': '**Agni** is the digestive fire — the most important concept in Ayurveda. Strong Agni = good health. Weak Agni = disease.\n\nTypes: Sama (balanced), Vishama (irregular/Vata), Tikshna (sharp/Pitta), Manda (slow/Kapha).\n\n**Strengthen Agni with:** ginger before meals, eating at regular times, avoiding cold water, Trikatu, and not overeating.',
    'ama': '**Ama** means toxins — undigested food that accumulates when Agni is weak. Ama is the root cause of most diseases in Ayurveda.\n\nSigns of Ama: coated tongue, bad breath, body heaviness, brain fog, joint stiffness.\n\n**Remove Ama with:** fasting, warm water, Triphala, Trikatu, light diet, and Panchakarma.',
    'ojas': '**Ojas** is the essence of immunity and vitality — the finest product of perfect digestion. It gives glow, strength, immunity, and happiness.\n\n**Build Ojas with:** ghee, almonds, dates, saffron milk, Chyawanprash, Ashwagandha, adequate sleep, positive emotions, and avoiding stress/junk food.',
    'rasayana': '**Rasayana** means rejuvenation therapy — herbs and practices that slow aging, boost immunity, and promote longevity.\n\nTop Rasayana herbs: Ashwagandha, Amla, Brahmi, Guduchi, Shatavari, Shilajit.\nTop Rasayana foods: Ghee, Milk, Honey, Almonds, Dates.\nTop Rasayana practice: Chyawanprash daily.',
    'panchakarma': '**Panchakarma** means "five actions" — the ultimate Ayurvedic detox and rejuvenation therapy:\n\n1. **Vamana** — therapeutic vomiting (for Kapha)\n2. **Virechana** — purgation (for Pitta)\n3. **Basti** — medicated enema (for Vata)\n4. **Nasya** — nasal therapy (for head/sinus)\n5. **Raktamokshana** — bloodletting (for blood disorders)\n\nMust be done under qualified practitioner supervision. Not a home remedy.'
  };

  for (const [key, answer] of Object.entries(concepts)) {
    if (msgLower.includes(key)) {
      return {
        messages: [{ type: 'text', content: answer }],
        context: ctx,
        suggestions: ['Tell me about another concept', 'I have a health problem', 'Which herbs are Rasayana?']
      };
    }
  }
  return null;
}

function answerHowTo(db, msgLower, ctx) {
  const topics = {
    'immunity': 'To **boost immunity** naturally:\n\n🌿 **Herbs:** Guduchi (Giloy), Tulsi, Ashwagandha, Amla\n🍽️ **Diet:** Chyawanprash daily, turmeric milk, fresh fruits, avoid sugar\n🧘 **Yoga:** Pranayama (Kapalabhati, Bhastrika), Surya Namaskar\n⏰ **Routine:** Sleep by 10 PM, wake by 6 AM, exercise daily\n\nThe #1 immunity killer is poor sleep. Fix that first.',
    'digestion': 'To **improve digestion** (strengthen Agni):\n\n🌿 **Herbs:** Trikatu before meals, Triphala at bedtime, Ginger tea\n🍽️ **Diet:** Eat warm cooked food, avoid cold/raw, eat largest meal at noon\n⏰ **Rules:** Eat only when hungry, no snacking, no water during meals, chew well\n🧘 **Yoga:** Vajrasana after meals (5 min), Pavanamuktasana\n\nGolden rule: Never eat when stressed or distracted.',
    'sleep': 'To **improve sleep** naturally:\n\n🌿 **Herbs:** Ashwagandha + warm milk at bedtime, Jatamansi, Brahmi\n🧘 **Practice:** Bhramari pranayama, Yoga Nidra, foot massage with sesame oil\n⏰ **Routine:** No screens 1hr before bed, sleep by 10 PM, dark cool room\n🍽️ **Diet:** Light dinner by 7 PM, warm milk with nutmeg pinch\n\nThe #1 sleep destroyer is phone in bed. Remove it.',
    'energy': 'To **boost energy** naturally:\n\n🌿 **Herbs:** Ashwagandha, Shilajit, Chyawanprash, Safed Musli\n🍽️ **Diet:** Dates + almonds + saffron milk morning, ghee in meals, avoid sugar\n🧘 **Yoga:** Surya Namaskar (12 rounds), Bhastrika pranayama\n⏰ **Routine:** Wake before 6 AM (Brahma Muhurta), exercise morning, sleep by 10 PM\n\nDaytime sleeping kills energy. Avoid it completely.',
    'hair': 'To **strengthen hair** and reduce fall:\n\n🌿 **Herbs:** Bhringraj oil (scalp massage 2x/week), Amla internally, Brahmi oil\n🍽️ **Diet:** Black sesame seeds, soaked almonds, iron-rich foods, protein\n🧘 **Yoga:** Adho Mukha Svanasana (increases blood to scalp), Sarvangasana\n⏰ **Routine:** Oil scalp 2-3x/week, gentle shampoo, never comb wet hair\n\nStress is the #1 cause of sudden hair fall. Address it first.',
    'skin': 'To **improve skin** naturally:\n\n🌿 **Herbs:** Manjistha (blood purifier), Neem, Kumkumadi oil (night)\n🍽️ **Diet:** Aloe vera juice morning, avoid dairy/sugar/fried, drink 8 glasses water\n🧘 **Yoga:** Sarvangasana, Matsyasana (improves blood flow to face)\n⏰ **Routine:** Cleanse-tone-moisturize, sleep by 10 PM (skin repairs at night)\n\nSkin reflects gut health. Fix digestion first for lasting glow.',
    'weight': 'To **lose weight** the Ayurvedic way:\n\n🌿 **Herbs:** Triphala, Guggulu, Medohar Guggulu, Garcinia\n🍽️ **Diet:** Largest meal at lunch, light dinner by 7 PM, avoid sugar/maida/fried\n🧘 **Yoga:** Surya Namaskar (12 rounds), Kapalabhati, Navasana\n⏰ **Routine:** Wake 5:30 AM, exercise 45 min, no daytime sleep, warm water all day\n\nAyurveda says: Never eat after sunset for weight loss.'
  };

  for (const [key, answer] of Object.entries(topics)) {
    if (msgLower.includes(key)) {
      return {
        messages: [{ type: 'text', content: answer }],
        context: ctx,
        suggestions: ['Tell me more about herbs', 'Any precautions?', 'I have another question']
      };
    }
  }
  return null;
}

function answerSafety(db, msgLower, ctx) {
  return {
    messages: [{ type: 'text', content: '**General Ayurvedic Safety Rules:**\n\n✅ **Safe combinations:**\n• Most Ayurvedic herbs can be taken together\n• Herbs + yoga + diet changes work synergistically\n• Triphala + Guggulu, Ashwagandha + Shatavari, Brahmi + Shankhpushpi — all safe\n\n⚠️ **Caution needed:**\n• Ayurvedic herbs + allopathic medicine — inform your doctor\n• Blood thinning herbs (garlic, turmeric) + blood thinner drugs — monitor\n• Diabetes herbs + diabetes medication — monitor sugar closely\n• Sedative herbs + sleeping pills — avoid combining\n\n🚫 **Never combine:**\n• Honey + hot water/food (toxic per Ayurveda)\n• Milk + fish/meat/sour fruits\n• Ghee + honey in equal quantities\n\nWhen in doubt, consult a qualified Ayurvedic practitioner (BAMS doctor).' }],
    context: ctx,
    suggestions: ['Tell me about a specific herb', 'I have a health problem', 'What about drug interactions?']
  };
}

function answerComparison(db, msgLower, ctx) {
  // Try to find two herbs mentioned
  const herbs = db.prepare('SELECT * FROM herbs').all();
  const found = [];

  for (const herb of herbs) {
    const name = herb.name.toLowerCase().split('(')[0].trim();
    if (msgLower.includes(name) && found.length < 2) {
      found.push(herb);
    }
  }

  if (found.length === 2) {
    let comparison = `**${found[0].name} vs ${found[1].name}:**\n\n`;
    comparison += `| | ${found[0].name} | ${found[1].name} |\n`;
    comparison += `|---|---|---|\n`;
    comparison += `| Taste | ${found[0].taste || 'N/A'} | ${found[1].taste || 'N/A'} |\n`;
    comparison += `| Potency | ${found[0].potency || 'N/A'} | ${found[1].potency || 'N/A'} |\n`;
    comparison += `| Dosha | ${found[0].dosha_effect || 'N/A'} | ${found[1].dosha_effect || 'N/A'} |\n`;
    comparison += `| Category | ${found[0].category || 'N/A'} | ${found[1].category || 'N/A'} |\n\n`;
    comparison += `**${found[0].name}:** ${found[0].description?.substring(0, 100) || ''}...\n\n`;
    comparison += `**${found[1].name}:** ${found[1].description?.substring(0, 100) || ''}...`;

    return {
      messages: [{ type: 'text', content: comparison }],
      context: ctx,
      suggestions: [`Tell me more about ${found[0].name}`, `Tell me more about ${found[1].name}`]
    };
  }

  return {
    messages: [{ type: 'text', content: 'I can compare herbs for you! Just mention two herb names. For example: "Compare Ashwagandha and Brahmi" or "Ashwagandha vs Shatavari"' }],
    context: ctx,
    suggestions: ['Ashwagandha vs Brahmi', 'Triphala vs Isabgol', 'Tulsi vs Giloy']
  };
}

function answerTiming(ctx) {
  return {
    messages: [{ type: 'text', content: '**Ayurvedic Timing Guide for Herbs:**\n\n🌅 **Morning (empty stomach):**\n• Triphala (if taken for detox)\n• Aloe vera juice\n• Warm lemon water\n• Amla juice\n\n🍳 **Before meals:**\n• Trikatu (digestion)\n• Ginger (appetite)\n• Gudmar (diabetes)\n\n🍽️ **After meals:**\n• Fennel seeds (digestion)\n• Triphala (if taken for digestion)\n• Chitrakadi Vati\n\n🌙 **Bedtime (with warm milk):**\n• Ashwagandha (sleep, strength)\n• Triphala (constipation)\n• Brahmi (brain)\n• Shatavari (women)\n• Nutmeg pinch (sleep)\n\n**General rule:** Herbs with warm milk = Vata/strength. Herbs with honey = Kapha/weight. Herbs with ghee = Pitta/brain.' }],
    context: ctx,
    suggestions: ['When to take Ashwagandha?', 'Best time for Triphala?', 'I have a health problem']
  };
}

function answerDuration(ctx) {
  return {
    messages: [{ type: 'text', content: '**How Long to Take Ayurvedic Herbs:**\n\n⏱️ **Quick relief (1-2 weeks):**\n• Home remedies for cold, acidity, headache\n• Kadha for fever\n• Isabgol for constipation\n\n📅 **Medium term (1-3 months):**\n• Most chronic conditions (joint pain, skin, hair fall)\n• Guggulu formulations\n• Blood purifiers (Manjistha, Neem)\n\n📆 **Long term (3-6 months):**\n• Rasayana herbs (Ashwagandha, Chyawanprash)\n• Hormonal issues (PCOS, thyroid)\n• Deep-rooted conditions (diabetes, arthritis)\n\n**Ayurvedic principle:** Take herbs for the same duration as the disease has existed. 1 year old problem = minimum 3-4 months treatment.\n\n**Cycling:** Take herbs for 2-3 months, break for 2 weeks, then resume. This prevents tolerance.' }],
    context: ctx,
    suggestions: ['How long for hair fall?', 'How long for weight loss?', 'I have another question']
  };
}

function showHerbDetails(db, herb, ctx) {
  const related = db.prepare(`
    SELECT s.name, hsm.effectiveness, hsm.notes
    FROM herb_symptom_map hsm JOIN symptoms s ON s.id = hsm.symptom_id
    WHERE hsm.herb_id = ?
    ORDER BY CASE hsm.effectiveness WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END
  `).all(herb.id);

  return {
    messages: [
      { type: 'text', content: `Here\'s everything you need to know about **${herb.name}** ${herb.name_hi ? `(${herb.name_hi})` : ''}:` },
      { type: 'herb_card', content: { ...herb, related_symptoms: related } }
    ],
    context: { ...ctx, stage: 'follow_up' },
    suggestions: ['Where to buy?', 'Compare with another herb', 'I have a health problem']
  };
}

function showTopHerbsForSymptom(db, symptom, ctx) {
  const herbs = db.prepare(`
    SELECT h.*, hsm.effectiveness, hsm.notes FROM herb_symptom_map hsm
    JOIN herbs h ON h.id = hsm.herb_id WHERE hsm.symptom_id = ?
    ORDER BY CASE hsm.effectiveness WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END
  `).all(symptom.id);

  return {
    messages: [
      { type: 'text', content: `🌿 Top Ayurvedic herbs for **${symptom.name}**:` },
      { type: 'herb_list', content: { herbs } }
    ],
    context: { ...ctx, stage: 'follow_up', symptom_id: symptom.id, symptom },
    suggestions: ['Get full healing plan', 'Tell me about a specific herb', 'I have another problem']
  };
}

function handleComparison(db, msgLower, ctx) {
  return {
    messages: [
      { type: 'text', content: 'I can help you compare herbs. Could you mention which two herbs you want to compare? For example: "Compare Ashwagandha and Brahmi"' }
    ],
    context: ctx,
    suggestions: ['Compare Ashwagandha and Brahmi', 'Ashwagandha vs Shatavari']
  };
}

function handleSuggestion(db, suggestion, ctx) {
  return identifyProblem(db, suggestion, suggestion.toLowerCase(), ctx);
}

// ================ HERB QUERIES ================
function detectHerb(db, msgLower) {
  // Only search if message seems to be asking about a specific herb
  if (!msgLower.match(/(about|tell|what|info|detail|benefit|use of|how to use)/)) {
    // Direct herb name mention (short message)
    if (msgLower.split(' ').length > 4) return null;
  }

  const herbs = db.prepare('SELECT * FROM herbs WHERE name IS NOT NULL').all();
  for (const herb of herbs) {
    const names = [
      herb.name.toLowerCase(),
      herb.name_hi?.toLowerCase(),
      herb.sanskrit_name?.toLowerCase()
    ].filter(Boolean);

    const cleanName = herb.name.split('(')[0].trim().toLowerCase();
    if (cleanName.length > 3) names.push(cleanName);

    for (const name of names) {
      if (name && name.length > 2 && msgLower.includes(name)) {
        return herb;
      }
    }
  }
  return null;
}

// ================ DETECTION ================
function detectSymptom(db, msgLower) {
  const keywords = {
    1: ['acidity', 'acid', 'heartburn', 'burning stomach', 'gerd', 'reflux', 'pet me jalan', 'amlapitta', 'hyperacidity', 'gas', 'bloating', 'indigestion'],
    2: ['back pain', 'back ache', 'backache', 'kamar', 'spine', 'lower back', 'sciatica', 'peeth', 'pith', 'lumbar', 'back problem'],
    3: ['insomnia', 'sleep', 'neend', 'nind', 'sleepless', 'sleeping', 'cant sleep', 'jagta', 'sone nahi'],
    4: ['stress', 'anxiety', 'tension', 'worried', 'tanav', 'chinta', 'nervous', 'panic', 'overthinking', 'depression', 'sad', 'mental', 'anxious'],
    5: ['hair fall', 'hair loss', 'baal', 'hairfall', 'balding', 'thinning', 'hair problem', 'hair issue', 'ganja'],
    6: ['headache', 'migraine', 'sir dard', 'head pain', 'sirdard', 'sar dard', 'head problem'],
    7: ['constipation', 'kabz', 'pet saaf', 'bowel', 'stool', 'qabz', 'latrine', 'toilet problem'],
    8: ['obesity', 'weight', 'fat', 'motapa', 'overweight', 'belly', 'vajan', 'lose weight', 'mota'],
    9: ['joint', 'knee', 'arthritis', 'jod', 'ghutna', 'gathiya', 'rheumatic', 'stiff joint'],
    10: ['skin', 'acne', 'pimple', 'rash', 'eczema', 'twacha', 'muhase', 'daag', 'pigmentation', 'face problem', 'itching'],
    11: ['cold', 'cough', 'sardi', 'khansi', 'flu', 'throat', 'gala', 'naak', 'congestion', 'sneeze', 'fever'],
    12: ['diabetes', 'sugar', 'madhumeh', 'blood sugar', 'glucose', 'insulin', 'diabetic'],
    13: ['pcos', 'pcod', 'period', 'masik', 'hormonal', 'irregular period', 'menstrual'],
    14: ['energy', 'tired', 'fatigue', 'thakan', 'lazy', 'weakness', 'kamzori', 'aalas', 'exhausted', 'stamina'],
    15: ['eye', 'vision', 'aankh', 'nazar', 'screen', 'sight', 'spectacle', 'chasma', 'eye problem', 'eye issue'],
    16: ['blood pressure', 'bp high', 'high bp', 'hypertension', 'uchh raktchap'],
    17: ['low bp', 'low blood pressure', 'hypotension', 'chakkar', 'dizziness'],
    18: ['thyroid', 'hypothyroid', 'hyperthyroid', 'goiter', 'tsh'],
    19: ['piles', 'hemorrhoid', 'bawasir', 'fissure', 'rectal bleeding'],
    20: ['asthma', 'dama', 'wheezing', 'breathless', 'saans'],
    21: ['uti', 'urine infection', 'burning urine', 'peshab', 'urinary'],
    22: ['kidney stone', 'pathri', 'renal stone', 'stone'],
    23: ['liver', 'fatty liver', 'jaundice', 'hepatitis', 'piliya'],
    24: ['ulcer', 'stomach ulcer', 'gastric ulcer', 'peptic'],
    25: ['ibs', 'irritable bowel', 'loose motion', 'diarrhea', 'dast'],
    26: ['allergy', 'sinus', 'sinusitis', 'sneezing', 'rhinitis', 'nasal'],
    27: ['anemia', 'khoon ki kami', 'low hemoglobin', 'iron deficiency', 'pale'],
    28: ['cholesterol', 'ldl', 'triglyceride', 'lipid'],
    29: ['prostate', 'frequent urination at night', 'weak urine stream'],
    30: ['varicose', 'vein', 'leg pain', 'swollen legs', 'spider vein'],
    31: ['migraine', 'one side headache', 'aura', 'light sensitive'],
    32: ['gastritis', 'stomach inflammation', 'pet me sujan'],
    33: ['sciatica', 'leg pain from back', 'nerve pain leg', 'tang me dard'],
    34: ['cervical', 'neck pain', 'gardan', 'spondylosis', 'neck stiff'],
    35: ['gray hair', 'white hair', 'premature gray', 'safed baal'],
    36: ['dandruff', 'rusi', 'flaky scalp', 'itchy scalp', 'scalp'],
    37: ['mouth ulcer', 'canker', 'muh ke chhale', 'oral sore'],
    38: ['bloating', 'gas problem', 'pet phulna', 'flatulence', 'aafara'],
    39: ['weak immunity', 'frequent cold', 'baar baar bimar', 'low immunity'],
    40: ['memory', 'focus', 'concentration', 'bhulna', 'yaaddaasht', 'brain fog'],
    41: ['male infertility', 'sperm count', 'erectile', 'napunsakta'],
    42: ['female infertility', 'conceive', 'garbh', 'baanjhpan'],
    43: ['period pain', 'menstrual cramp', 'dysmenorrhea', 'mahavari dard'],
    44: ['acid reflux', 'gerd', 'chest burn', 'seene me jalan'],
    45: ['tonsil', 'gale me sujan', 'swollen tonsil', 'tonsillitis']
  };

  let bestMatch = null;
  let bestScore = 0;

  for (const [id, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (msgLower.includes(word)) {
        const score = word.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = parseInt(id);
        }
      }
    }
  }

  return bestMatch ? db.prepare('SELECT * FROM symptoms WHERE id = ?').get(bestMatch) : null;
}

function getTriggerQuestion(symptom) {
  const triggers = {
    1: { question: 'What usually triggers your acidity?', suggestions: ['Spicy/oily food', 'Stress at work', 'Empty stomach', 'Eating late night', 'After tea/coffee'] },
    2: { question: 'What makes your back pain worse?', suggestions: ['Long sitting', 'Cold weather', 'After lifting heavy', 'Constant pain'] },
    3: { question: 'What keeps you awake?', suggestions: ['Racing thoughts', 'Body restlessness', 'Phone before bed', 'Just can\'t sleep'] },
    4: { question: 'What\'s the main source of your stress?', suggestions: ['Work pressure', 'Relationships', 'Health worries', 'No specific reason'] },
    5: { question: 'What might be causing it?', suggestions: ['Stress/lifestyle', 'Hormonal (thyroid/PCOS)', 'Poor diet', 'Recent illness', 'Not sure'] },
    6: { question: 'What triggers your headaches?', suggestions: ['Stress', 'Sun/heat', 'Hunger', 'Lack of sleep', 'Screen time'] },
    7: { question: 'How long since you had a normal bowel movement?', suggestions: ['1-2 days', '3-4 days', 'Weekly issue', 'Always irregular'] },
    8: { question: 'What is your lifestyle like?', suggestions: ['Sedentary (desk job)', 'Some exercise', 'Stress eater', 'Late dinners', 'Not sure'] },
    9: { question: 'Where is the joint pain mostly?', suggestions: ['Knees', 'Lower back', 'Multiple joints', 'Shoulders/elbows'] },
    10: { question: 'What kind of skin problem?', suggestions: ['Acne/pimples', 'Dry/itchy', 'Pigmentation', 'Eczema/rash'] },
    11: { question: 'What are your main symptoms?', suggestions: ['Blocked nose', 'Sore throat', 'Cough with phlegm', 'Dry cough', 'Body ache'] },
    12: { question: 'Are you currently on diabetes medication?', suggestions: ['Yes, on medication', 'Pre-diabetic', 'Diet controlled', 'Just diagnosed'] },
    13: { question: 'What are your main PCOS symptoms?', suggestions: ['Irregular periods', 'Weight gain', 'Acne/hair growth', 'Mood swings'] },
    14: { question: 'When do you feel most tired?', suggestions: ['All day long', 'After lunch', 'In the morning', 'After work'] },
    15: { question: 'How many hours daily on screens?', suggestions: ['Less than 4', '4-8 hours', '8-12 hours', 'More than 12'] }
  };
  return triggers[symptom?.id] || { question: 'What do you think triggers it?', suggestions: ['Stress', 'Food', 'Weather', 'Not sure'] };
}

function getExtraQuestion(symptom) {
  const extras = {
    1: { question: 'Any associated symptoms?', suggestions: ['Bloating/gas', 'Nausea', 'Headache too', 'Just acidity'] },
    3: { question: 'What time do you usually go to bed?', suggestions: ['Before 10 PM', '10 PM - 12 AM', 'After midnight'] },
    5: { question: 'How is your scalp condition?', suggestions: ['Dry/dandruff', 'Oily', 'Itchy', 'Normal'] },
    8: { question: 'Are you trying any diet currently?', suggestions: ['Intermittent fasting', 'Calorie counting', 'No specific diet', 'Vegetarian only'] }
  };
  return extras[symptom?.id] || null;
}

// ================ SCHEDULES ================
function buildLightSchedule(herbs, yoga, home) {
  return [
    { time: '6:30 AM', activity: 'Wake up + warm water with lemon', icon: '🌅' },
    { time: '7:00 AM', activity: `${yoga[0]?.name || 'Light yoga'} (${yoga[0]?.duration_minutes || 10} min)`, icon: '🧘' },
    { time: '7:30 AM', activity: `${home[0]?.title || 'Home remedy'}`, icon: '🌱' },
    { time: '8:00 AM', activity: 'Healthy breakfast', icon: '🍳' },
    { time: '1:00 PM', activity: 'Lunch (main meal)', icon: '🍽️' },
    { time: '7:00 PM', activity: 'Light dinner + 10 min walk', icon: '🚶' },
    { time: '10:00 PM', activity: 'Sleep', icon: '😴' }
  ];
}

function buildModerateSchedule(herbs, yoga, home) {
  return [
    { time: '6:00 AM', activity: 'Wake up + warm water', icon: '🌅' },
    { time: '6:30 AM', activity: `${yoga[0]?.name || 'Yoga'} (${yoga[0]?.duration_minutes || 15} min)`, icon: '🧘' },
    { time: '6:50 AM', activity: `${yoga[1]?.name || 'Pranayama'} (${yoga[1]?.duration_minutes || 5} min)`, icon: '🌬️' },
    { time: '7:30 AM', activity: `Take: ${herbs[0]?.title || 'Morning herb'}`, icon: '🌿' },
    { time: '8:00 AM', activity: 'Breakfast — warm and fresh', icon: '🍳' },
    { time: '12:30 PM', activity: 'Lunch (largest meal)', icon: '🍽️' },
    { time: '6:30 PM', activity: 'Evening walk (15-20 min)', icon: '🚶' },
    { time: '7:30 PM', activity: 'Light dinner', icon: '🥗' },
    { time: '9:00 PM', activity: `${herbs[1]?.title || herbs[0]?.title || 'Evening herb'} with warm milk`, icon: '🌿' },
    { time: '10:00 PM', activity: 'Sleep', icon: '😴' }
  ];
}

function buildIntensiveSchedule(herbs, yoga, home) {
  return [
    { time: '5:30 AM', activity: 'Wake up + oil pulling + warm water', icon: '🌅' },
    { time: '6:00 AM', activity: `${yoga[0]?.name || 'Asanas'} (15 min)`, icon: '🧘' },
    { time: '6:20 AM', activity: `${yoga[1]?.name || 'Pranayama'} (10 min)`, icon: '🌬️' },
    { time: '6:30 AM', activity: 'Meditation (10 min)', icon: '🧠' },
    { time: '7:00 AM', activity: `Morning herb: ${herbs[0]?.title || 'Herb 1'}`, icon: '🌿' },
    { time: '7:30 AM', activity: 'Warm nourishing breakfast', icon: '🍳' },
    { time: '10:00 AM', activity: `Mid-morning: ${herbs[1]?.title || 'Herb 2'}`, icon: '🌿' },
    { time: '12:30 PM', activity: 'Lunch — main meal, eat slowly', icon: '🍽️' },
    { time: '4:00 PM', activity: 'Herbal tea or warm water', icon: '☕' },
    { time: '5:30 PM', activity: 'Evening yoga/walk (20 min)', icon: '🚶' },
    { time: '7:00 PM', activity: 'Light dinner (soup/khichdi)', icon: '🥣' },
    { time: '8:30 PM', activity: `Night herb: ${herbs[2]?.title || herbs[0]?.title} with warm milk`, icon: '🌿' },
    { time: '9:00 PM', activity: 'Self oil massage (Abhyanga)', icon: '💆' },
    { time: '10:00 PM', activity: 'Sleep in dark, cool room', icon: '😴' }
  ];
}

function buildSummaryText(symptom, answers, herbs, yoga, diet, home, intensity) {
  let s = `\n📝 **SUMMARY — Your ${symptom.name} Healing Plan**\n\n`;
  s += `🎯 Condition: ${symptom.name} (${answers.severity}, ${answers.duration === 'chronic' ? 'long-standing' : answers.duration === 'recent' ? 'recent' : 'few months'})\n`;
  s += `⚡ Intensity: ${intensity}\n\n`;

  if (herbs.length > 0) {
    s += `🌿 Herbs: ${herbs.map(h => h.title).join(', ')}\n`;
  }
  if (yoga.length > 0) {
    s += `🧘 Yoga: ${yoga.map(y => `${y.name} (${y.duration_minutes}min)`).join(', ')}\n`;
  }
  if (diet.length > 0) {
    s += `🍽️ Diet: ${diet.map(d => d.title).join(', ')}\n`;
  }
  if (home.length > 0) {
    s += `🏠 Home Remedies: ${home.map(h => h.title).join(', ')}\n`;
  }

  s += `\n⏱️ Duration: ${intensity === 'intensive' ? '6-8 weeks' : intensity === 'light' ? '1-2 weeks' : '2-4 weeks'}\n`;
  s += `\n⚠️ Disclaimer: This is wellness guidance based on Ayurveda, not medical advice. Consult a doctor for serious conditions.\n`;
  s += `\nAsk me anything else — about a specific herb, yoga details, diet plan, or another health problem!`;
  return s;
}

module.exports = router;
