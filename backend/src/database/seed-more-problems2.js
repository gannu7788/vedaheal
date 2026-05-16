function seedMoreProblems2(db) {
  const insertSymptom = db.prepare(`
    INSERT OR IGNORE INTO symptoms (name, name_hi, category, description, dosha_association)
    VALUES (?, ?, ?, ?, ?)
  `);

  const symptoms = [
    ['Migraine', 'माइग्रेन', 'Neurological', 'Severe one-sided headache with nausea, light sensitivity, and visual disturbances', 'Pitta'],
    ['Gastritis', 'गैस्ट्राइटिस', 'Digestive', 'Inflammation of stomach lining causing burning, nausea, and upper abdominal pain', 'Pitta'],
    ['Sciatica', 'साइटिका', 'Musculoskeletal', 'Sharp pain radiating from lower back through hip and down the leg', 'Vata'],
    ['Cervical Spondylosis', 'सर्वाइकल', 'Musculoskeletal', 'Neck pain and stiffness due to wear of cervical spine discs', 'Vata'],
    ['Premature Graying', 'असमय बाल सफेद होना', 'Hair & Skin', 'Hair turning white/gray before age 30-35 due to melanin loss', 'Pitta'],
    ['Dandruff', 'रूसी', 'Hair & Skin', 'Flaky scalp with itching caused by fungal overgrowth or dry skin', 'Kapha'],
    ['Mouth Ulcers', 'मुंह के छाले', 'Digestive', 'Painful sores inside mouth on tongue, cheeks, or gums', 'Pitta'],
    ['Bloating & Gas', 'पेट फूलना और गैस', 'Digestive', 'Abdominal distension, excessive gas, and discomfort after eating', 'Vata'],
    ['Weak Immunity', 'कमजोर प्रतिरक्षा', 'General', 'Frequent infections, slow recovery, catching cold easily', 'Kapha'],
    ['Memory & Focus', 'याददाश्त और एकाग्रता', 'Neurological', 'Poor concentration, forgetfulness, brain fog, difficulty learning', 'Vata'],
    ['Male Infertility', 'पुरुष बांझपन', 'Reproductive', 'Low sperm count, poor motility, erectile dysfunction', 'Vata'],
    ['Female Infertility', 'महिला बांझपन', 'Reproductive', 'Difficulty conceiving due to hormonal, ovulatory, or uterine issues', 'Kapha'],
    ['Menstrual Pain', 'मासिक दर्द', 'Reproductive', 'Severe cramps during periods (dysmenorrhea) with back pain and nausea', 'Vata'],
    ['Acid Reflux (GERD)', 'एसिड रिफ्लक्स', 'Digestive', 'Chronic acid flowing back into esophagus causing heartburn and chest pain', 'Pitta'],
    ['Tonsillitis', 'टॉन्सिलाइटिस', 'Respiratory', 'Swollen, infected tonsils causing sore throat, difficulty swallowing, fever', 'Kapha']
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) { insertSymptom.run(...item); }
  });
  insertMany(symptoms);

  // Add remedies for key new problems
  const insertRemedy = db.prepare(`
    INSERT INTO remedies (symptom_id, type, title, title_hi, description, description_hi, how_to_use, precautions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const getSymId = (name) => db.prepare('SELECT id FROM symptoms WHERE name = ?').get(name)?.id;

  const bloating = getSymId('Bloating & Gas');
  const immunity = getSymId('Weak Immunity');
  const memory = getSymId('Memory & Focus');
  const menstrual = getSymId('Menstrual Pain');
  const dandruff = getSymId('Dandruff');

  const remedies = [];

  if (bloating) {
    remedies.push(
      [bloating, 'herb', 'Hingvastak Churna', 'हिंग्वाष्टक चूर्ण', 'Classical formula with hing, jeera, ajwain for gas and bloating', 'गैस और पेट फूलने के लिए शास्त्रीय योग', 'Take 1-2g with first morsel of food or with warm water before meals', 'Avoid in pregnancy and high Pitta'],
      [bloating, 'herb', 'Ajwain + Hing + Black Salt', 'अजवाइन + हींग + काला नमक', 'Instant gas relief combination used in every Indian household', 'हर भारतीय घर में गैस से तुरंत राहत का संयोजन', 'Mix 1/2 tsp ajwain + pinch hing + pinch black salt. Chew with warm water after meals.', 'Very safe. Can use daily.'],
      [bloating, 'lifestyle', 'Vajrasana After Meals', 'भोजन के बाद वज्रासन', 'Only yoga pose recommended AFTER eating. Improves digestion and reduces gas.', 'खाने के बाद एकमात्र योग मुद्रा। पाचन सुधारता है।', 'Sit in Vajrasana for 5-10 minutes immediately after every meal.', 'Avoid if you have severe knee pain.'],
      [bloating, 'home_remedy', 'Warm Water + Lemon + Ginger', 'गर्म पानी + नींबू + अदरक', 'Stimulates Agni, expels gas, reduces bloating within minutes', 'अग्नि उत्तेजित करता है, गैस निकालता है, मिनटों में सूजन कम करता है', 'Grate 1 inch ginger in warm water + squeeze half lemon. Drink before meals.', 'Avoid lemon if you have mouth ulcers.']
    );
  }

  if (immunity) {
    remedies.push(
      [immunity, 'herb', 'Chyawanprash', 'च्यवनप्राश', 'Supreme Rasayana with 48 herbs. Boosts immunity, energy, and longevity.', 'सर्वोच्च रसायन। प्रतिरक्षा, ऊर्जा और दीर्घायु बढ़ाता है।', 'Take 1-2 tsp with warm milk morning and evening. Year-round.', 'Diabetics use sugar-free version. Safe for all ages.'],
      [immunity, 'herb', 'Guduchi (Giloy)', 'गुडूची (गिलोय)', 'Called Amrita (nectar). Most powerful immunity herb in Ayurveda.', 'अमृत कहलाती है। आयुर्वेद में सबसे शक्तिशाली प्रतिरक्षा जड़ी-बूटी।', 'Take 1 tsp giloy powder or 20ml juice twice daily. Or Giloy Satva 500mg with honey.', 'Avoid in autoimmune diseases. Safe for most people.'],
      [immunity, 'herb', 'Tulsi + Giloy + Ashwagandha', 'तुलसी + गिलोय + अश्वगंधा', 'Triple immunity formula. Covers antiviral, adaptogenic, and rejuvenative action.', 'तिहरा प्रतिरक्षा सूत्र। एंटीवायरल, एडाप्टोजेनिक और कायाकल्प।', 'Take each herb 500mg or combined formula twice daily with warm water', 'Very safe combination. Can take for 2-3 months continuously.'],
      [immunity, 'diet', 'Immunity-Boosting Diet', 'प्रतिरक्षा-बढ़ाने वाला आहार', 'Specific foods that strengthen Ojas (vital immunity essence)', 'विशिष्ट खाद्य पदार्थ जो ओजस (प्रतिरक्षा सार) मजबूत करते हैं', 'Daily: turmeric milk, amla, dates, almonds, ghee, honey (unheated), seasonal fruits. Avoid: sugar, processed food, cold drinks.', 'Sugar is the #1 immunity killer. Eliminate it.']
    );
  }

  if (memory) {
    remedies.push(
      [memory, 'herb', 'Brahmi (Bacopa)', 'ब्राह्मी', 'The #1 brain herb. Enhances memory, learning, and concentration. Clinically proven.', '#1 मस्तिष्क जड़ी-बूटी। स्मृति, सीखने और एकाग्रता बढ़ाता है।', 'Take 300mg Bacopa extract or 2-3g powder with ghee twice daily. Takes 4-8 weeks for full effect.', 'Very safe long-term. May cause mild nausea initially.'],
      [memory, 'herb', 'Shankhpushpi', 'शंखपुष्पी', 'Medhya Rasayana — enhances all cognitive functions. Used by Vedic scholars.', 'मेध्य रसायन — सभी संज्ञानात्मक कार्य बढ़ाता है।', 'Take 2-4 tsp Shankhpushpi syrup or 3g powder with milk twice daily', 'Very safe. One of the safest brain herbs. Good for students.'],
      [memory, 'herb', 'Jyotishmati Oil', 'ज्योतिष्मती तेल', 'Called "intellect oil." Illuminates the mind. Used for memorization.', '"बुद्धि तेल" कहलाता है। मन को प्रकाशित करता है।', 'Start with 1 drop in milk, increase by 1 daily up to 10-15 drops. Graduated dosing essential.', 'MUST use graduated dosing. Never start with full dose. May cause nausea.'],
      [memory, 'lifestyle', 'Meditation + Trataka', 'ध्यान + त्राटक', 'Meditation improves focus. Trataka (candle gazing) sharpens concentration dramatically.', 'ध्यान एकाग्रता सुधारता है। त्राटक एकाग्रता तेज करता है।', 'Meditate 10 min morning. Trataka: gaze at candle flame without blinking, 5 min before bed.', 'Remove contact lenses for Trataka. Do in draft-free room.']
    );
  }

  if (menstrual) {
    remedies.push(
      [menstrual, 'herb', 'Dashmool Kashayam', 'दशमूल कषायम', 'Classical decoction of 10 roots. Best for Vata-type menstrual cramps.', '10 जड़ों का शास्त्रीय काढ़ा। वात-प्रकार के मासिक ऐंठन के लिए सर्वश्रेष्ठ।', 'Take 15-30ml with warm water twice daily during periods (day 1-3)', 'Very safe. Start 1-2 days before expected period for prevention.'],
      [menstrual, 'herb', 'Ashoka + Shatavari', 'अशोक + शतावरी', 'Ashoka regulates flow, Shatavari balances hormones. Classic combination.', 'अशोक प्रवाह नियंत्रित करता है, शतावरी हार्मोन संतुलित करती है।', 'Ashokarishta 15-20ml + Shatavari 1 tsp with warm milk. Throughout cycle.', 'Safe for long-term use. Results in 2-3 cycles.'],
      [menstrual, 'home_remedy', 'Ginger + Jaggery Tea', 'अदरक + गुड़ चाय', 'Ginger is anti-spasmodic, jaggery provides iron lost during periods', 'अदरक ऐंठन-रोधी है, गुड़ मासिक में खोया आयरन देता है', 'Boil 1 inch ginger in water 5 min. Add 1 tsp jaggery. Drink 2-3 cups during periods.', 'Very safe. Also helps with nausea during periods.'],
      [menstrual, 'lifestyle', 'Warm Compress + Rest', 'गर्म सिकाई + आराम', 'Heat relaxes uterine muscles. Rest reduces Vata which causes cramps.', 'गर्मी गर्भाशय की मांसपेशियों को आराम देती है।', 'Hot water bag on lower abdomen. Gentle yoga (Balasana, Supta Baddha Konasana). Avoid strenuous exercise.', 'Avoid cold food/drinks during periods. Stay warm.']
    );
  }

  if (dandruff) {
    remedies.push(
      [dandruff, 'herb', 'Neem + Tea Tree', 'नीम + टी ट्री', 'Neem is antifungal, tea tree kills Malassezia fungus causing dandruff', 'नीम एंटीफंगल है, टी ट्री रूसी पैदा करने वाले फंगस को मारता है', 'Add 5 drops tea tree oil to neem oil. Massage scalp. Leave 30 min. Wash with mild shampoo.', 'Do patch test for tea tree oil. Never apply undiluted.'],
      [dandruff, 'herb', 'Khadir (Acacia)', 'खदिर', 'Best blood purifier for scalp conditions. Reduces itching and flaking.', 'स्कैल्प स्थितियों के लिए सर्वश्रेष्ठ रक्त शोधक।', 'Take Khadirarishta 15-20ml after meals. Also apply khadir decoction on scalp.', 'Safe for long-term use. Internal + external approach works best.'],
      [dandruff, 'home_remedy', 'Curd + Lemon Scalp Pack', 'दही + नींबू स्कैल्प पैक', 'Curd has probiotics that fight fungus. Lemon is antifungal and removes flakes.', 'दही में प्रोबायोटिक्स फंगस से लड़ते हैं। नींबू एंटीफंगल है।', 'Mix 3 tbsp curd + 1 tbsp lemon juice. Apply on scalp. Leave 30 min. Wash.', 'May lighten hair color slightly with repeated use. Use 2x/week.'],
      [dandruff, 'lifestyle', 'Scalp Hygiene', 'स्कैल्प स्वच्छता', 'Wash hair 2-3x/week. Never sleep with wet hair. Avoid sharing combs.', 'सप्ताह में 2-3 बार बाल धोएं। गीले बालों के साथ न सोएं।', 'Use mild herbal shampoo. Dry scalp completely after wash. Oil 2x/week. Change pillow cover weekly.', 'Avoid very hot water on scalp. Lukewarm is best.']
    );
  }

  if (remedies.length > 0) {
    const insertRemedies = db.transaction((items) => {
      for (const item of items) { insertRemedy.run(...item); }
    });
    insertRemedies(remedies);
  }

  console.log(`  More Problems 2: ${symptoms.length} new problems + ${remedies.length} remedies added`);
}

module.exports = { seedMoreProblems2 };
