function seedData(db) {
  // Seed symptoms
  const insertSymptom = db.prepare(`
    INSERT INTO symptoms (name, name_hi, category, description, dosha_association)
    VALUES (?, ?, ?, ?, ?)
  `);

  const symptoms = [
    ['Acidity', 'एसिडिटी', 'Digestive', 'Burning sensation in stomach, acid reflux, heartburn', 'Pitta'],
    ['Back Pain', 'कमर दर्द', 'Musculoskeletal', 'Pain in lower or upper back region', 'Vata'],
    ['Insomnia', 'अनिद्रा', 'Sleep', 'Difficulty falling or staying asleep', 'Vata'],
    ['Stress & Anxiety', 'तनाव और चिंता', 'Mental Health', 'Excessive worry, tension, restlessness', 'Vata'],
    ['Hair Fall', 'बालों का झड़ना', 'Hair & Skin', 'Excessive hair loss and thinning', 'Pitta'],
    ['Headache & Migraine', 'सिरदर्द और माइग्रेन', 'Neurological', 'Recurring head pain, sensitivity to light', 'Pitta'],
    ['Constipation', 'कब्ज', 'Digestive', 'Difficulty in bowel movements, hard stools', 'Vata'],
    ['Obesity', 'मोटापा', 'Metabolic', 'Excess body weight, slow metabolism', 'Kapha'],
    ['Joint Pain', 'जोड़ों का दर्द', 'Musculoskeletal', 'Pain and stiffness in joints', 'Vata'],
    ['Skin Problems', 'त्वचा की समस्या', 'Hair & Skin', 'Acne, eczema, dryness, rashes', 'Pitta'],
    ['Cold & Cough', 'सर्दी और खांसी', 'Respiratory', 'Nasal congestion, sore throat, coughing', 'Kapha'],
    ['Diabetes Management', 'मधुमेह प्रबंधन', 'Metabolic', 'High blood sugar, insulin resistance', 'Kapha'],
    ['PCOS', 'पीसीओएस', 'Hormonal', 'Irregular periods, hormonal imbalance', 'Kapha'],
    ['Low Energy', 'कम ऊर्जा', 'General', 'Fatigue, tiredness, lack of motivation', 'Kapha'],
    ['Eye Strain', 'आंखों की थकान', 'Neurological', 'Tired eyes, dryness, blurred vision from screens', 'Pitta']
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertSymptom.run(...item);
    }
  });
  insertMany(symptoms);

  // Seed remedies for Acidity (symptom_id = 1)
  const insertRemedy = db.prepare(`
    INSERT INTO remedies (symptom_id, type, title, title_hi, description, description_hi, how_to_use, precautions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const remedies = [
    [1, 'herb', 'Amla (Indian Gooseberry)', 'आंवला', 'Natural antacid that balances stomach acid production', 'प्राकृतिक एंटासिड जो पेट के एसिड को संतुलित करता है', 'Take 1 tsp amla powder with water before meals, or eat fresh amla daily', 'Avoid if you have diarrhea'],
    [1, 'herb', 'Mulethi (Licorice)', 'मुलेठी', 'Soothes stomach lining and reduces acid secretion', 'पेट की परत को शांत करता है और एसिड स्राव कम करता है', 'Chew a small piece of mulethi after meals or drink mulethi tea', 'Avoid in high BP patients'],
    [1, 'diet', 'Cooling Foods', 'ठंडे खाद्य पदार्थ', 'Include coconut water, cucumber, fennel seeds, and cold milk', 'नारियल पानी, खीरा, सौंफ और ठंडा दूध शामिल करें', 'Drink coconut water daily. Chew fennel seeds after meals.', 'Avoid spicy, fried, and sour foods'],
    [1, 'lifestyle', 'Meal Timing', 'भोजन का समय', 'Eat meals at fixed times. Never skip meals or overeat.', 'निश्चित समय पर भोजन करें। भोजन न छोड़ें।', 'Eat dinner 2-3 hours before sleep. Eat slowly and chew well.', 'Avoid lying down immediately after eating'],
    [1, 'home_remedy', 'Cold Milk with Mishri', 'ठंडा दूध और मिश्री', 'Instant relief from acidity and heartburn', 'एसिडिटी और जलन से तुरंत राहत', 'Drink a glass of cold milk with 1 tsp mishri (rock sugar) when acidity strikes', 'Skip if lactose intolerant'],
    [2, 'herb', 'Ashwagandha', 'अश्वगंधा', 'Reduces inflammation and strengthens back muscles', 'सूजन कम करता है और पीठ की मांसपेशियों को मजबूत करता है', 'Take 1 tsp ashwagandha powder with warm milk at night', 'Consult doctor if pregnant'],
    [2, 'herb', 'Nirgundi Oil', 'निर्गुंडी तेल', 'Anti-inflammatory oil for external application on back', 'पीठ पर लगाने के लिए सूजन-रोधी तेल', 'Warm the oil slightly and massage on affected area for 10 mins', 'Do not apply on broken skin'],
    [2, 'lifestyle', 'Warm Compress', 'गर्म सिकाई', 'Apply warm compress to relax tight muscles', 'तंग मांसपेशियों को आराम देने के लिए गर्म सिकाई करें', 'Use hot water bag on back for 15-20 mins, twice daily', 'Avoid if area is swollen or inflamed'],
    [3, 'herb', 'Brahmi', 'ब्राह्मी', 'Calms the nervous system and promotes deep sleep', 'तंत्रिका तंत्र को शांत करता है और गहरी नींद को बढ़ावा देता है', 'Take brahmi powder with warm milk 30 mins before bed', 'May cause drowsiness during day if taken in excess'],
    [3, 'herb', 'Ashwagandha', 'अश्वगंधा', 'Reduces cortisol and promotes relaxation', 'कोर्टिसोल कम करता है और विश्राम को बढ़ावा देता है', 'Take 1/2 tsp with warm milk at bedtime', 'Avoid in hyperthyroidism'],
    [3, 'lifestyle', 'Abhyanga (Oil Massage)', 'अभ्यंग (तेल मालिश)', 'Warm sesame oil foot massage before sleep', 'सोने से पहले गर्म तिल के तेल से पैरों की मालिश', 'Massage warm sesame oil on soles of feet for 5 mins before bed', 'Use old socks after to avoid staining'],
    [4, 'herb', 'Jatamansi', 'जटामांसी', 'Powerful nervine tonic that calms the mind', 'शक्तिशाली नर्वाइन टॉनिक जो मन को शांत करता है', 'Take 1/4 tsp powder with honey twice daily', 'Avoid during pregnancy'],
    [4, 'herb', 'Shankhpushpi', 'शंखपुष्पी', 'Reduces anxiety and improves mental clarity', 'चिंता कम करता है और मानसिक स्पष्टता बढ़ाता है', 'Take 2 tsp shankhpushpi syrup or 1 tsp powder with water', 'Safe for long-term use'],
    [5, 'herb', 'Bhringraj', 'भृंगराज', 'King of herbs for hair — strengthens roots and prevents fall', 'बालों के लिए जड़ी-बूटियों का राजा — जड़ों को मजबूत करता है', 'Apply bhringraj oil on scalp 2-3 times a week. Leave for 1 hour before wash.', 'Do patch test first'],
    [5, 'diet', 'Iron & Protein Rich Foods', 'आयरन और प्रोटीन युक्त भोजन', 'Include sesame seeds, spinach, lentils, and amla in diet', 'तिल, पालक, दाल और आंवला शामिल करें', 'Eat soaked black sesame seeds (1 tsp) every morning', 'Balance with vitamin C for absorption']
  ];

  const insertRemedies = db.transaction((items) => {
    for (const item of items) {
      insertRemedy.run(...item);
    }
  });
  insertRemedies(remedies);

  // Seed yoga exercises
  const insertYoga = db.prepare(`
    INSERT INTO yoga_exercises (symptom_id, name, name_hi, sanskrit_name, type, difficulty, duration_minutes, steps, benefits, precautions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const yogaExercises = [
    [1, 'Vajrasana (Thunderbolt Pose)', 'वज्रासन', 'Vajrasana', 'asana', 'beginner', 10, 'Kneel on the floor. Sit back on your heels with toes together. Keep spine straight. Place hands on thighs. Breathe deeply for 5-10 minutes.', 'Improves digestion, reduces acidity, strengthens pelvic muscles', 'Avoid if you have knee injury'],
    [1, 'Paschimottanasana (Seated Forward Bend)', 'पश्चिमोत्तानासन', 'Paschimottanasana', 'asana', 'beginner', 5, 'Sit with legs extended. Inhale and raise arms. Exhale and bend forward from hips. Hold toes or ankles. Hold for 30-60 seconds.', 'Massages abdominal organs, reduces acid reflux, calms the mind', 'Avoid if you have slipped disc or sciatica'],
    [1, 'Sheetali Pranayama (Cooling Breath)', 'शीतली प्राणायाम', 'Sheetali', 'pranayama', 'beginner', 5, 'Sit comfortably. Roll tongue into a tube. Inhale through the rolled tongue. Close mouth and exhale through nose. Repeat 15-20 times.', 'Cools the body, reduces pitta, relieves acidity and heartburn', 'Avoid in cold weather or if you have asthma'],
    [2, 'Bhujangasana (Cobra Pose)', 'भुजंगासन', 'Bhujangasana', 'asana', 'beginner', 5, 'Lie face down. Place palms near shoulders. Inhale and lift chest off floor. Keep elbows slightly bent. Hold for 15-30 seconds. Repeat 3 times.', 'Strengthens spine, relieves back stiffness, improves flexibility', 'Avoid if pregnant or have severe back injury'],
    [2, 'Marjariasana (Cat-Cow Pose)', 'मार्जरीआसन', 'Marjariasana', 'asana', 'beginner', 5, 'Come to all fours. Inhale — drop belly, lift head (cow). Exhale — round spine, tuck chin (cat). Repeat 10-15 times slowly.', 'Releases back tension, improves spinal flexibility, relieves pain', 'Move gently, do not force the stretch'],
    [2, 'Shalabhasana (Locust Pose)', 'शलभासन', 'Shalabhasana', 'asana', 'intermediate', 5, 'Lie face down, arms by sides. Inhale and lift legs, chest, and arms off floor. Hold for 10-20 seconds. Release and repeat 3 times.', 'Strengthens lower back muscles, improves posture', 'Avoid if you have spinal injury or hernia'],
    [3, 'Shavasana (Corpse Pose)', 'शवासन', 'Shavasana', 'asana', 'beginner', 15, 'Lie flat on back. Arms slightly away from body, palms up. Close eyes. Relax every body part from toes to head. Focus on breath. Stay for 10-15 mins.', 'Deep relaxation, reduces insomnia, calms nervous system', 'Use a thin pillow if neck is uncomfortable'],
    [3, 'Viparita Karani (Legs Up the Wall)', 'विपरीत करणी', 'Viparita Karani', 'asana', 'beginner', 10, 'Sit sideways near a wall. Swing legs up the wall as you lie back. Arms out to sides. Close eyes and breathe deeply for 5-10 mins.', 'Calms the mind, improves blood circulation, promotes sleep', 'Avoid during menstruation or if you have glaucoma'],
    [3, 'Bhramari Pranayama (Bee Breath)', 'भ्रामरी प्राणायाम', 'Bhramari', 'pranayama', 'beginner', 5, 'Sit comfortably. Close eyes. Place index fingers on ear cartilage. Inhale deeply. Exhale making a humming sound like a bee. Repeat 7-10 times.', 'Instantly calms the mind, reduces anxiety, promotes sleep', 'Do not press ear too hard. Avoid if you have ear infection.'],
    [4, 'Balasana (Child Pose)', 'बालासन', 'Balasana', 'asana', 'beginner', 5, 'Kneel and sit on heels. Bend forward, forehead to floor. Arms extended forward or by sides. Breathe deeply for 1-3 minutes.', 'Relieves stress, calms the brain, gently stretches back', 'Avoid if you have knee injury or are pregnant (modify)'],
    [4, 'Anulom Vilom (Alternate Nostril Breathing)', 'अनुलोम विलोम', 'Anulom Vilom', 'pranayama', 'beginner', 10, 'Sit comfortably. Close right nostril with thumb. Inhale through left. Close left nostril with ring finger. Exhale through right. Inhale right. Exhale left. This is one cycle. Do 10-15 cycles.', 'Balances nervous system, reduces anxiety, improves focus', 'Do not hold breath if you have heart problems'],
    [5, 'Adho Mukha Svanasana (Downward Dog)', 'अधो मुख श्वानासन', 'Adho Mukha Svanasana', 'asana', 'beginner', 5, 'Start on all fours. Lift hips up and back. Straighten legs and arms. Head between arms. Hold for 30-60 seconds.', 'Increases blood flow to scalp, strengthens hair roots', 'Avoid if you have high BP or wrist injury'],
    [5, 'Sarvangasana (Shoulder Stand)', 'सर्वांगासन', 'Sarvangasana', 'asana', 'intermediate', 5, 'Lie on back. Lift legs and hips up. Support back with hands. Body vertical. Hold for 30 seconds to 2 minutes.', 'Improves blood circulation to head, nourishes hair follicles', 'Avoid if you have neck injury, high BP, or during menstruation']
  ];

  const insertYogaMany = db.transaction((items) => {
    for (const item of items) {
      insertYoga.run(...item);
    }
  });
  insertYogaMany(yogaExercises);

  // Seed dosha questions
  const insertQuestion = db.prepare(`
    INSERT INTO dosha_questions (question, question_hi, category, option_vata, option_pitta, option_kapha)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const questions = [
    ['What is your body frame?', 'आपका शरीर कैसा है?', 'Physical', 'Thin, light, hard to gain weight', 'Medium, athletic build', 'Large, heavy, gains weight easily'],
    ['How is your skin?', 'आपकी त्वचा कैसी है?', 'Physical', 'Dry, rough, thin', 'Warm, oily, prone to rashes', 'Thick, smooth, cool, oily'],
    ['How is your appetite?', 'आपकी भूख कैसी है?', 'Digestive', 'Irregular, sometimes forget to eat', 'Strong, get irritable if I miss meals', 'Steady, can skip meals easily'],
    ['How do you sleep?', 'आपकी नींद कैसी है?', 'Sleep', 'Light sleeper, wake up easily', 'Moderate, need 6-7 hours', 'Deep and heavy, hard to wake up'],
    ['How do you handle stress?', 'आप तनाव कैसे संभालते हैं?', 'Mental', 'Get anxious and worried', 'Get angry and frustrated', 'Withdraw and become quiet'],
    ['What is your energy pattern?', 'आपकी ऊर्जा का पैटर्न क्या है?', 'Energy', 'Bursts of energy, tire quickly', 'Moderate and focused energy', 'Steady but slow to start'],
    ['How is your digestion?', 'आपका पाचन कैसा है?', 'Digestive', 'Irregular, bloating, gas', 'Fast, prone to acidity', 'Slow but steady, feel heavy after meals'],
    ['What weather do you dislike?', 'आपको कौन सा मौसम पसंद नहीं?', 'Preference', 'Cold and windy', 'Hot and humid', 'Cold and damp'],
    ['How is your memory?', 'आपकी याददाश्त कैसी है?', 'Mental', 'Quick to learn, quick to forget', 'Sharp and focused', 'Slow to learn, never forget'],
    ['How do you speak?', 'आप कैसे बोलते हैं?', 'Behavioral', 'Fast, talkative, jump topics', 'Clear, precise, argumentative', 'Slow, calm, thoughtful']
  ];

  const insertQuestions = db.transaction((items) => {
    for (const item of items) {
      insertQuestion.run(...item);
    }
  });
  insertQuestions(questions);

  console.log(`  Seeded: ${symptoms.length} symptoms, ${remedies.length} remedies, ${yogaExercises.length} yoga exercises, ${questions.length} dosha questions`);
}

module.exports = { seedData };
