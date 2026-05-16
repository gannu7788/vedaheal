function seedExtendedData(db) {
  // Additional remedies for remaining symptoms (6-15)
  const insertRemedy = db.prepare(`
    INSERT INTO remedies (symptom_id, type, title, title_hi, description, description_hi, how_to_use, precautions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const remedies = [
    // Headache & Migraine (6)
    [6, 'herb', 'Peppermint Oil', 'पुदीना तेल', 'Natural analgesic that relieves headache by improving blood flow', 'प्राकृतिक दर्दनिवारक जो रक्त प्रवाह सुधारकर सिरदर्द से राहत देता है', 'Apply diluted peppermint oil on temples and forehead. Massage gently for 2-3 mins.', 'Do not apply near eyes. Dilute with coconut oil for sensitive skin.'],
    [6, 'herb', 'Brahmi', 'ब्राह्मी', 'Cools the brain, reduces pitta-related headaches', 'मस्तिष्क को ठंडा करता है, पित्त-संबंधी सिरदर्द कम करता है', 'Take 1 tsp brahmi powder with warm water twice daily', 'Safe for long-term use'],
    [6, 'diet', 'Anti-Migraine Diet', 'माइग्रेन-रोधी आहार', 'Avoid cheese, chocolate, caffeine, alcohol. Include magnesium-rich foods.', 'पनीर, चॉकलेट, कैफीन से बचें। मैग्नीशियम युक्त भोजन लें।', 'Eat almonds, spinach, bananas daily. Stay hydrated with warm water.', 'Identify and avoid your personal trigger foods'],
    [6, 'home_remedy', 'Ginger-Lemon Tea', 'अदरक-नींबू चाय', 'Ginger reduces inflammation, lemon balances pH', 'अदरक सूजन कम करता है, नींबू pH संतुलित करता है', 'Boil fresh ginger slices in water for 5 mins. Add lemon juice. Drink at onset of headache.', 'Avoid excess if you have acidity'],

    // Constipation (7)
    [7, 'herb', 'Triphala', 'त्रिफला', 'The most effective Ayurvedic remedy for constipation — cleanses and tones the colon', 'कब्ज के लिए सबसे प्रभावी आयुर्वेदिक उपाय — बड़ी आंत को साफ करता है', 'Take 1 tsp triphala powder with warm water before bed', 'Reduce dose if stools become too loose'],
    [7, 'herb', 'Isabgol (Psyllium Husk)', 'ईसबगोल', 'Natural fiber that adds bulk to stool and eases passage', 'प्राकृतिक फाइबर जो मल में भारीपन जोड़ता है', 'Mix 2 tsp in a glass of warm milk or water at bedtime', 'Drink plenty of water throughout the day'],
    [7, 'diet', 'High Fiber Diet', 'उच्च फाइबर आहार', 'Include papaya, prunes, flaxseeds, whole grains, and leafy greens', 'पपीता, अलसी, साबुत अनाज और हरी सब्जियां शामिल करें', 'Start day with soaked raisins (10-12) and warm water. Eat papaya before lunch.', 'Increase fiber gradually to avoid bloating'],
    [7, 'lifestyle', 'Morning Routine', 'सुबह की दिनचर्या', 'Wake early, drink warm water, and establish regular toilet timing', 'जल्दी उठें, गर्म पानी पिएं, नियमित शौच का समय बनाएं', 'Drink 2 glasses warm water immediately after waking. Walk for 10 mins. Try toilet at same time daily.', 'Never suppress the urge to go'],

    // Obesity (8)
    [8, 'herb', 'Guggulu', 'गुग्गुलु', 'Boosts metabolism, helps burn fat, reduces cholesterol', 'चयापचय बढ़ाता है, वसा जलाता है, कोलेस्ट्रॉल कम करता है', 'Take Triphala Guggulu tablets as directed (usually 2 tablets twice daily)', 'Avoid during pregnancy. Consult practitioner for dosage.'],
    [8, 'herb', 'Garcinia Cambogia (Vrikshamla)', 'वृक्षाम्ल', 'Suppresses appetite and blocks fat production', 'भूख कम करता है और वसा उत्पादन रोकता है', 'Take 500mg extract 30 mins before meals', 'Avoid if you have liver issues'],
    [8, 'diet', 'Kapha-Reducing Diet', 'कफ-शामक आहार', 'Favor warm, light, spicy foods. Avoid heavy, oily, sweet foods.', 'गर्म, हल्का, मसालेदार भोजन लें। भारी, तैलीय, मीठे से बचें।', 'Eat largest meal at lunch. Dinner should be light and before 7 PM. Add ginger, black pepper to meals.', 'Do not skip meals — it slows metabolism'],
    [8, 'lifestyle', 'Active Lifestyle', 'सक्रिय जीवनशैली', 'Exercise daily for minimum 45 mins. Avoid daytime sleeping.', 'रोज कम से कम 45 मिनट व्यायाम करें। दिन में न सोएं।', 'Brisk walk, swimming, or cycling. Never sleep after meals. Wake before 6 AM.', 'Start gradually if you are sedentary'],

    // Joint Pain (9)
    [9, 'herb', 'Shallaki (Boswellia)', 'शल्लकी', 'Powerful anti-inflammatory that reduces joint swelling and pain', 'शक्तिशाली सूजन-रोधी जो जोड़ों की सूजन और दर्द कम करता है', 'Take 400mg Boswellia extract twice daily with meals', 'Safe for long-term use. Results visible in 2-4 weeks.'],
    [9, 'herb', 'Nirgundi', 'निर्गुंडी', 'Reduces pain and inflammation in joints, especially knees', 'जोड़ों, विशेषकर घुटनों में दर्द और सूजन कम करता है', 'Apply nirgundi oil externally. Also take nirgundi leaf decoction.', 'External use is very safe. For internal use, consult practitioner.'],
    [9, 'home_remedy', 'Turmeric Milk (Golden Milk)', 'हल्दी दूध', 'Curcumin in turmeric is a natural anti-inflammatory', 'हल्दी में करक्यूमिन प्राकृतिक सूजन-रोधी है', 'Boil 1 tsp turmeric + pinch of black pepper in milk. Drink warm at night.', 'Black pepper increases turmeric absorption by 2000%'],
    [9, 'lifestyle', 'Joint-Friendly Habits', 'जोड़ों के अनुकूल आदतें', 'Maintain healthy weight, avoid sitting cross-legged for long, use warm compress', 'स्वस्थ वजन बनाएं, लंबे समय तक पालथी न मारें, गर्म सिकाई करें', 'Apply warm sesame oil and massage joints for 10 mins daily. Use hot water bag in winters.', 'Avoid cold foods and cold water on joints'],

    // Skin Problems (10)
    [10, 'herb', 'Neem', 'नीम', 'Blood purifier, antibacterial, antifungal — the ultimate skin herb', 'रक्त शोधक, जीवाणुरोधी — त्वचा की सर्वोत्तम जड़ी-बूटी', 'Take neem capsules internally. Apply neem paste on affected areas externally.', 'Very bitter taste. Can be taken as capsules. Avoid in pregnancy.'],
    [10, 'herb', 'Manjistha', 'मंजिष्ठा', 'Best blood purifier in Ayurveda — clears skin from inside', 'आयुर्वेद में सर्वश्रेष्ठ रक्त शोधक — अंदर से त्वचा साफ करता है', 'Take 1/2 tsp manjistha powder with warm water twice daily', 'Results take 4-6 weeks. Be patient.'],
    [10, 'diet', 'Pitta-Cooling Diet', 'पित्त-शामक आहार', 'Avoid spicy, fried, fermented foods. Include cooling foods.', 'मसालेदार, तले, खमीरी भोजन से बचें। ठंडे खाद्य पदार्थ लें।', 'Drink aloe vera juice (30ml) morning empty stomach. Eat cucumber, watermelon, coconut.', 'Avoid tomatoes, citrus, and vinegar if skin is inflamed'],

    // Cold & Cough (11)
    [11, 'herb', 'Tulsi (Holy Basil)', 'तुलसी', 'Immunity booster, expectorant, relieves congestion', 'प्रतिरक्षा बढ़ाने वाला, कफ निकालने वाला, जमाव से राहत', 'Boil 8-10 tulsi leaves in water. Add honey. Drink 2-3 times daily.', 'Safe for all ages. Can chew raw leaves too.'],
    [11, 'herb', 'Sitopaladi Churna', 'सितोपलादि चूर्ण', 'Classical Ayurvedic formula for cough, cold, and respiratory issues', 'खांसी, सर्दी और श्वसन समस्याओं के लिए शास्त्रीय आयुर्वेदिक योग', 'Take 1/2 tsp with honey 3 times daily after meals', 'Very safe. Can be given to children in smaller doses.'],
    [11, 'home_remedy', 'Kadha (Immunity Drink)', 'काढ़ा', 'Traditional immunity-boosting decoction with multiple spices', 'पारंपरिक प्रतिरक्षा-बढ़ाने वाला काढ़ा', 'Boil tulsi, ginger, black pepper, clove, cinnamon in 2 cups water. Reduce to 1 cup. Add honey. Drink warm.', 'Avoid excess if you have acidity. Reduce spices for children.'],

    // Diabetes Management (12)
    [12, 'herb', 'Jamun (Indian Blackberry)', 'जामुन', 'Seeds reduce blood sugar levels naturally', 'बीज रक्त शर्करा को प्राकृतिक रूप से कम करते हैं', 'Take 1 tsp jamun seed powder with water before meals twice daily', 'Supplement to medication, not replacement. Monitor sugar levels.'],
    [12, 'herb', 'Gurmar (Gymnema)', 'गुड़मार', 'Literally means "sugar destroyer" — reduces sugar cravings and absorption', 'शाब्दिक अर्थ "शक्कर नाशक" — मीठे की लालसा और अवशोषण कम करता है', 'Take 400mg gymnema extract before meals', 'May enhance effect of diabetes medication. Monitor levels closely.'],
    [12, 'diet', 'Diabetic-Friendly Diet', 'मधुमेह-अनुकूल आहार', 'Low glycemic foods, bitter vegetables, fenugreek seeds', 'कम ग्लाइसेमिक भोजन, कड़वी सब्जियां, मेथी दाना', 'Soak 1 tsp fenugreek seeds overnight. Eat morning empty stomach. Include bitter gourd, amla daily.', 'Never stop prescribed medication without doctor advice'],

    // PCOS (13)
    [13, 'herb', 'Shatavari', 'शतावरी', 'Balances female hormones, regulates menstrual cycle', 'महिला हार्मोन संतुलित करता है, मासिक चक्र नियमित करता है', 'Take 1 tsp shatavari powder with warm milk twice daily', 'Avoid if you have estrogen-sensitive conditions'],
    [13, 'herb', 'Ashoka', 'अशोक', 'Regulates periods, reduces heavy bleeding, balances hormones', 'मासिक धर्म नियमित करता है, अधिक रक्तस्राव कम करता है', 'Take Ashokarishta (liquid) 15-20ml with equal water after meals', 'Consult practitioner for correct formulation'],
    [13, 'lifestyle', 'PCOS Lifestyle', 'पीसीओएस जीवनशैली', 'Regular exercise, stress management, adequate sleep, weight management', 'नियमित व्यायाम, तनाव प्रबंधन, पर्याप्त नींद, वजन प्रबंधन', 'Exercise 45 mins daily. Sleep by 10 PM. Practice yoga and meditation. Avoid processed foods.', 'Consistency is key — results take 3-6 months'],

    // Low Energy (14)
    [14, 'herb', 'Ashwagandha', 'अश्वगंधा', 'Adaptogen that boosts energy, reduces fatigue, improves stamina', 'ऊर्जा बढ़ाता है, थकान कम करता है, सहनशक्ति सुधारता है', 'Take 1 tsp ashwagandha powder with warm milk at night', 'Avoid in hyperthyroidism'],
    [14, 'herb', 'Shilajit', 'शिलाजीत', 'Mineral-rich substance that revitalizes body and mind', 'खनिज-समृद्ध पदार्थ जो शरीर और मन को पुनर्जीवित करता है', 'Dissolve pea-sized shilajit in warm milk. Take morning empty stomach.', 'Buy only purified shilajit from trusted source'],
    [14, 'diet', 'Energy-Boosting Diet', 'ऊर्जा-बढ़ाने वाला आहार', 'Include dates, almonds, ghee, honey, seasonal fruits', 'खजूर, बादाम, घी, शहद, मौसमी फल शामिल करें', 'Eat 2-3 soaked almonds + 2 dates every morning. Add ghee to meals. Drink warm water.', 'Avoid excess sugar — it causes energy crashes'],

    // Eye Strain (15)
    [15, 'herb', 'Triphala Eye Wash', 'त्रिफला नेत्र धावन', 'Triphala water cleanses and strengthens eyes', 'त्रिफला जल आंखों को साफ और मजबूत करता है', 'Soak 1 tsp triphala in water overnight. Strain through clean cloth. Use as eye wash morning.', 'Ensure water is well-filtered. Discontinue if irritation occurs.'],
    [15, 'herb', 'Saptamrit Lauh', 'सप्तामृत लौह', 'Classical Ayurvedic eye tonic with iron and triphala', 'लौह और त्रिफला युक्त शास्त्रीय आयुर्वेदिक नेत्र टॉनिक', 'Take as directed by practitioner (usually 250mg twice daily with honey)', 'Consult Ayurvedic doctor for correct dosage'],
    [15, 'lifestyle', '20-20-20 Rule + Palming', '20-20-20 नियम + पामिंग', 'Every 20 mins, look 20 feet away for 20 seconds. Then do palming.', 'हर 20 मिनट में 20 फीट दूर 20 सेकंड देखें। फिर पामिंग करें।', 'Rub palms together until warm. Cup over closed eyes for 1-2 mins. Repeat 3-4 times daily.', 'Reduce screen brightness. Use night mode after sunset.']
  ];

  const insertRemedies = db.transaction((items) => {
    for (const item of items) {
      insertRemedy.run(...item);
    }
  });
  insertRemedies(remedies);

  // Additional yoga exercises for remaining symptoms
  const insertYoga = db.prepare(`
    INSERT INTO yoga_exercises (symptom_id, name, name_hi, sanskrit_name, type, difficulty, duration_minutes, steps, benefits, precautions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const yogaExercises = [
    // Headache (6)
    [6, 'Hastapadasana (Standing Forward Bend)', 'हस्तपादासन', 'Hastapadasana', 'asana', 'beginner', 5, 'Stand straight. Inhale, raise arms. Exhale, bend forward from hips. Touch toes or floor. Keep knees soft. Hold 30 seconds. Rise slowly.', 'Increases blood supply to brain, relieves tension headache', 'Avoid if you have severe back problems or vertigo'],
    [6, 'Setu Bandhasana (Bridge Pose)', 'सेतु बंधासन', 'Setu Bandhasana', 'asana', 'beginner', 5, 'Lie on back. Bend knees, feet flat on floor. Lift hips up. Clasp hands under back. Hold 30-60 seconds. Lower slowly.', 'Calms the brain, reduces anxiety-related headaches', 'Avoid in neck injury. Use a blanket under shoulders if needed.'],
    [6, 'Sheetali Pranayama (Cooling Breath)', 'शीतली प्राणायाम', 'Sheetali', 'pranayama', 'beginner', 5, 'Sit comfortably. Roll tongue into tube. Inhale through tongue. Close mouth, exhale through nose. Repeat 15-20 times.', 'Cools pitta, reduces heat-related headaches and migraines', 'Avoid in cold weather or respiratory infections'],

    // Constipation (7)
    [7, 'Pavanamuktasana (Wind-Relieving Pose)', 'पवनमुक्तासन', 'Pavanamuktasana', 'asana', 'beginner', 5, 'Lie on back. Bring right knee to chest. Hold with both hands. Press thigh against abdomen. Hold 30 sec. Repeat left side. Then both knees.', 'Massages intestines, releases trapped gas, stimulates bowel movement', 'Avoid after meals. Do on empty stomach.'],
    [7, 'Malasana (Garland/Squat Pose)', 'मालासन', 'Malasana', 'asana', 'beginner', 3, 'Stand with feet wider than hips. Squat down fully. Bring palms together at chest. Use elbows to push knees apart. Hold 1-3 minutes.', 'Opens hips, stimulates digestion, natural position for elimination', 'Use a block under heels if they lift off floor'],
    [7, 'Kapalabhati (Skull-Shining Breath)', 'कपालभाति', 'Kapalabhati', 'pranayama', 'intermediate', 10, 'Sit straight. Take a deep breath. Exhale forcefully through nose by contracting abdomen. Inhale passively. Start with 30 strokes, build to 120.', 'Stimulates abdominal organs, improves digestion and elimination', 'Avoid during periods, pregnancy, high BP, or hernia'],

    // Obesity (8)
    [8, 'Surya Namaskar (Sun Salutation)', 'सूर्य नमस्कार', 'Surya Namaskar', 'asana', 'intermediate', 20, '12-pose sequence: Prayer → Raised arms → Forward bend → Lunge → Plank → 8-point → Cobra → Downward dog → Lunge → Forward bend → Raised arms → Prayer. Do 6-12 rounds.', 'Full body workout, burns calories, boosts metabolism, tones muscles', 'Start with 4 rounds. Increase gradually. Avoid if you have severe back/knee issues.'],
    [8, 'Navasana (Boat Pose)', 'नावासन', 'Navasana', 'asana', 'intermediate', 5, 'Sit with knees bent. Lean back slightly. Lift feet off floor. Straighten legs to 45 degrees. Arms parallel to floor. Hold 20-30 seconds. Repeat 3-5 times.', 'Strengthens core, burns belly fat, improves digestion', 'Avoid if you have lower back pain or hernia'],
    [8, 'Kapalabhati (Skull-Shining Breath)', 'कपालभाति', 'Kapalabhati', 'pranayama', 'intermediate', 10, 'Sit straight. Exhale forcefully through nose by pulling navel in. Inhale passively. Do 3 rounds of 60-120 strokes with rest between rounds.', 'Burns abdominal fat, increases metabolic rate, energizes body', 'Avoid in high BP, heart disease, pregnancy, hernia'],

    // Joint Pain (9)
    [9, 'Trikonasana (Triangle Pose)', 'त्रिकोणासन', 'Trikonasana', 'asana', 'beginner', 5, 'Stand with feet wide apart. Turn right foot out. Extend arms. Bend right, touch right ankle. Left arm points up. Look up. Hold 30 sec. Repeat other side.', 'Strengthens knees and ankles, stretches joints, improves flexibility', 'Use a block if you cannot reach the floor. Do not lock knees.'],
    [9, 'Virabhadrasana (Warrior Pose)', 'वीरभद्रासन', 'Virabhadrasana', 'asana', 'beginner', 5, 'Stand with feet wide. Turn right foot out. Bend right knee to 90 degrees. Arms up or out to sides. Hold 30 seconds. Repeat other side.', 'Strengthens legs and joints, improves balance and stability', 'Keep knee aligned over ankle. Do not push beyond comfort.'],
    [9, 'Sukshma Vyayama (Joint Rotations)', 'सूक्ष्म व्यायाम', 'Sukshma Vyayama', 'asana', 'beginner', 10, 'Rotate each joint slowly: neck (5 circles each way), shoulders, wrists, hips, knees, ankles. Move gently and mindfully.', 'Lubricates joints, reduces stiffness, improves range of motion', 'Move slowly. Never force a joint. Skip any joint that has acute pain.'],

    // Skin Problems (10)
    [10, 'Sarvangasana (Shoulder Stand)', 'सर्वांगासन', 'Sarvangasana', 'asana', 'intermediate', 5, 'Lie on back. Lift legs and hips. Support back with hands. Body vertical. Hold 1-3 minutes. Come down slowly.', 'Improves blood flow to face, nourishes skin, balances hormones', 'Avoid during periods, neck injury, high BP, or glaucoma'],
    [10, 'Matsyasana (Fish Pose)', 'मत्स्यासन', 'Matsyasana', 'asana', 'beginner', 5, 'Lie on back. Place hands under hips. Lift chest, arch back. Top of head touches floor. Hold 30-60 seconds.', 'Opens chest, improves skin glow, balances thyroid', 'Avoid if you have neck problems or migraine'],
    [10, 'Nadi Shodhana (Channel Cleansing)', 'नाड़ी शोधन', 'Nadi Shodhana', 'pranayama', 'beginner', 10, 'Sit comfortably. Use right hand. Close right nostril, inhale left (4 counts). Close both, hold (4 counts). Open right, exhale (8 counts). Inhale right. Exhale left. 10 rounds.', 'Purifies blood, balances hormones, gives natural glow to skin', 'Do not hold breath if you have heart problems'],

    // Cold & Cough (11)
    [11, 'Bhujangasana (Cobra Pose)', 'भुजंगासन', 'Bhujangasana', 'asana', 'beginner', 5, 'Lie face down. Place palms near shoulders. Inhale, lift chest. Open chest wide. Hold 15-30 seconds. Repeat 3 times.', 'Opens chest and lungs, relieves congestion, improves breathing', 'Avoid if you have severe back pain'],
    [11, 'Simhasana (Lion Pose)', 'सिंहासन', 'Simhasana', 'asana', 'beginner', 3, 'Kneel and sit on heels. Place palms on knees. Inhale deeply. Exhale forcefully — open mouth wide, stick tongue out, roar "HAAA". Eyes wide. Repeat 5-6 times.', 'Relieves sore throat, clears respiratory tract, boosts immunity', 'Safe for all. Great for children too.'],
    [11, 'Bhastrika Pranayama (Bellows Breath)', 'भस्त्रिका प्राणायाम', 'Bhastrika', 'pranayama', 'intermediate', 5, 'Sit straight. Inhale forcefully expanding chest. Exhale forcefully contracting abdomen. Equal force in and out. Do 20 strokes, rest. 3 rounds.', 'Clears nasal passages, warms body, boosts immunity', 'Avoid in high BP, heart disease, or during fever'],

    // Diabetes (12)
    [12, 'Mandukasana (Frog Pose)', 'मंडूकासन', 'Mandukasana', 'asana', 'beginner', 5, 'Sit in vajrasana. Make fists, place on navel. Exhale and bend forward pressing fists into abdomen. Hold 20-30 seconds. Repeat 3-5 times.', 'Stimulates pancreas, improves insulin production', 'Avoid if you have peptic ulcer or recent abdominal surgery'],
    [12, 'Ardha Matsyendrasana (Half Spinal Twist)', 'अर्ध मत्स्येन्द्रासन', 'Ardha Matsyendrasana', 'asana', 'intermediate', 5, 'Sit with legs extended. Bend right knee, place foot outside left knee. Twist torso right. Left elbow outside right knee. Hold 30 sec. Repeat other side.', 'Massages pancreas and liver, improves digestion, regulates blood sugar', 'Twist gently. Do not force. Avoid in spinal injuries.'],
    [12, 'Kapalabhati (Skull-Shining Breath)', 'कपालभाति', 'Kapalabhati', 'pranayama', 'intermediate', 10, 'Sit straight. Forceful exhales through nose, passive inhales. 3 rounds of 60 strokes. Rest between rounds.', 'Stimulates abdominal organs including pancreas, improves metabolism', 'Avoid in high BP, heart disease, hernia'],

    // PCOS (13)
    [13, 'Baddha Konasana (Butterfly Pose)', 'बद्ध कोणासन', 'Baddha Konasana', 'asana', 'beginner', 5, 'Sit with soles of feet together. Hold feet with hands. Gently flap knees up and down like butterfly wings. Then hold still and bend forward. Hold 1-2 mins.', 'Opens pelvis, stimulates ovaries, improves reproductive health', 'Avoid if you have groin injury'],
    [13, 'Supta Baddha Konasana (Reclining Butterfly)', 'सुप्त बद्ध कोणासन', 'Supta Baddha Konasana', 'asana', 'beginner', 10, 'Lie on back. Bring soles of feet together. Let knees fall open. Arms relaxed by sides. Stay 5-10 minutes. Use pillows under knees if needed.', 'Deep relaxation for reproductive organs, reduces stress hormones', 'Use support under knees if hips are tight'],
    [13, 'Bhramari Pranayama (Bee Breath)', 'भ्रामरी प्राणायाम', 'Bhramari', 'pranayama', 'beginner', 5, 'Sit comfortably. Close eyes. Place fingers on ear cartilage. Inhale deeply. Exhale with humming sound. Repeat 7-11 times.', 'Reduces stress and cortisol (major PCOS trigger), calms nervous system', 'Do not press ears too hard'],

    // Low Energy (14)
    [14, 'Surya Namaskar (Sun Salutation)', 'सूर्य नमस्कार', 'Surya Namaskar', 'asana', 'intermediate', 15, '12-pose flow sequence done facing the sun. Start with 4 rounds, build to 12. Move with breath — inhale to extend, exhale to fold.', 'Energizes entire body, improves circulation, boosts mood', 'Do on empty stomach. Start slow if you are a beginner.'],
    [14, 'Ustrasana (Camel Pose)', 'उष्ट्रासन', 'Ustrasana', 'asana', 'intermediate', 5, 'Kneel with knees hip-width. Place hands on lower back. Inhale, lift chest. Lean back, reach for heels. Open chest. Hold 20-30 seconds.', 'Opens chest, boosts energy, fights fatigue, improves posture', 'Avoid if you have neck or back injury. Go only as far as comfortable.'],
    [14, 'Bhastrika Pranayama (Bellows Breath)', 'भस्त्रिका प्राणायाम', 'Bhastrika', 'pranayama', 'intermediate', 5, 'Sit straight. Forceful inhale AND exhale through nose. Equal force both ways. 20 breaths per round. 3 rounds with rest.', 'Instantly energizes, increases oxygen supply, removes lethargy', 'Avoid in high BP, heart disease, pregnancy, or epilepsy'],

    // Eye Strain (15)
    [15, 'Trataka (Candle Gazing)', 'त्राटक', 'Trataka', 'meditation', 'beginner', 10, 'Place a candle at eye level, 2 feet away. Gaze at flame without blinking as long as possible. When eyes water, close them. Visualize the flame. Repeat 3 times.', 'Strengthens eye muscles, improves focus, reduces strain', 'Remove contact lenses. Do in a draft-free room.'],
    [15, 'Eye Yoga Exercises', 'नेत्र योग', 'Netra Vyayama', 'asana', 'beginner', 5, 'Sit straight. Without moving head: Look up-down (10x). Look left-right (10x). Diagonal both ways (10x). Circles clockwise and anti-clockwise (5x each). Palming for 1 min.', 'Strengthens all eye muscles, reduces fatigue, improves vision', 'Move eyes slowly. Stop if you feel dizzy.'],
    [15, 'Bhramari with Shanmukhi Mudra', 'भ्रामरी शन्मुखी मुद्रा', 'Bhramari', 'pranayama', 'beginner', 5, 'Sit comfortably. Close ears with thumbs, eyes with index fingers, nose sides with middle fingers, upper lip with ring fingers. Inhale. Exhale with humming. 7-11 rounds.', 'Deeply relaxes eyes and facial muscles, reduces eye pressure', 'Press very gently. Do not press eyeballs.']
  ];

  const insertYogaMany = db.transaction((items) => {
    for (const item of items) {
      insertYoga.run(...item);
    }
  });
  insertYogaMany(yogaExercises);

  console.log(`  Extended: ${remedies.length} remedies, ${yogaExercises.length} yoga exercises added`);
}

module.exports = { seedExtendedData };
