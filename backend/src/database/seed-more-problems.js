function seedMoreProblems(db) {
  const insertSymptom = db.prepare(`
    INSERT OR IGNORE INTO symptoms (name, name_hi, category, description, dosha_association)
    VALUES (?, ?, ?, ?, ?)
  `);

  const symptoms = [
    ['High Blood Pressure', 'उच्च रक्तचाप', 'Cardiovascular', 'Elevated blood pressure that can damage heart, kidneys, and blood vessels over time', 'Pitta'],
    ['Low Blood Pressure', 'निम्न रक्तचाप', 'Cardiovascular', 'Blood pressure below normal causing dizziness, fatigue, and fainting', 'Vata'],
    ['Thyroid Disorders', 'थायरॉइड विकार', 'Hormonal', 'Hypothyroidism (low thyroid) or hyperthyroidism (overactive thyroid) affecting metabolism', 'Kapha'],
    ['Piles (Hemorrhoids)', 'बवासीर', 'Digestive', 'Swollen veins in rectum causing pain, bleeding, and itching during bowel movements', 'Vata'],
    ['Asthma', 'दमा', 'Respiratory', 'Chronic respiratory condition with wheezing, breathlessness, and chest tightness', 'Kapha'],
    ['Urinary Tract Infection', 'मूत्र मार्ग संक्रमण', 'Urinary', 'Burning urination, frequent urge, pain in lower abdomen', 'Pitta'],
    ['Kidney Stones', 'गुर्दे की पथरी', 'Urinary', 'Hard mineral deposits in kidneys causing severe pain, blood in urine', 'Kapha'],
    ['Liver Disorders', 'यकृत विकार', 'Digestive', 'Fatty liver, hepatitis, jaundice, or liver weakness affecting digestion and detox', 'Pitta'],
    ['Gastric Ulcer', 'पेट का अल्सर', 'Digestive', 'Sores in stomach lining causing burning pain, nausea, especially on empty stomach', 'Pitta'],
    ['IBS (Irritable Bowel)', 'आईबीएस', 'Digestive', 'Alternating constipation and diarrhea with bloating, cramps, and gas', 'Vata'],
    ['Allergies & Sinusitis', 'एलर्जी और साइनस', 'Respiratory', 'Nasal congestion, sneezing, itchy eyes, sinus headache from allergens', 'Kapha'],
    ['Anemia', 'एनीमिया (खून की कमी)', 'Blood', 'Low hemoglobin causing fatigue, pale skin, breathlessness, dizziness', 'Vata'],
    ['High Cholesterol', 'उच्च कोलेस्ट्रॉल', 'Cardiovascular', 'Elevated LDL cholesterol increasing risk of heart disease and stroke', 'Kapha'],
    ['Prostate Problems', 'प्रोस्टेट समस्या', 'Urinary', 'Enlarged prostate causing frequent urination, weak stream, incomplete emptying', 'Kapha'],
    ['Varicose Veins', 'वैरिकोज वेन्स', 'Cardiovascular', 'Swollen, twisted veins in legs causing pain, heaviness, and cramping', 'Vata']
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) { insertSymptom.run(...item); }
  });
  insertMany(symptoms);

  // Add remedies for new problems
  const insertRemedy = db.prepare(`
    INSERT INTO remedies (symptom_id, type, title, title_hi, description, description_hi, how_to_use, precautions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Get IDs for new symptoms (they start at 16)
  const getSymId = (name) => db.prepare('SELECT id FROM symptoms WHERE name = ?').get(name)?.id;

  const hbp = getSymId('High Blood Pressure');
  const thyroid = getSymId('Thyroid Disorders');
  const piles = getSymId('Piles (Hemorrhoids)');
  const asthma = getSymId('Asthma');
  const uti = getSymId('Urinary Tract Infection');
  const kidney = getSymId('Kidney Stones');
  const liver = getSymId('Liver Disorders');
  const ulcer = getSymId('Gastric Ulcer');
  const ibs = getSymId('IBS (Irritable Bowel)');
  const allergy = getSymId('Allergies & Sinusitis');
  const anemia = getSymId('Anemia');
  const cholesterol = getSymId('High Cholesterol');
  const prostate = getSymId('Prostate Problems');

  const remedies = [
    // HIGH BP
    [hbp, 'herb', 'Arjuna', 'अर्जुन', 'Strengthens heart muscle, reduces BP naturally, lowers cholesterol', 'हृदय की मांसपेशी मजबूत करता है, बीपी कम करता है', 'Arjuna bark powder 3-5g boiled in milk (Ksheer Pak) morning. Or Arjunarishta 15-20ml.', 'Monitor BP regularly. May need to adjust medication.'],
    [hbp, 'herb', 'Sarpagandha', 'सर्पगंधा', 'Most powerful Ayurvedic antihypertensive. Contains reserpine.', 'सबसे शक्तिशाली आयुर्वेदिक रक्तचाप-रोधी', 'ONLY under practitioner supervision. Sarpagandha Vati 1-2 tablets at bedtime.', 'MUST consult doctor. Can cause depression, excessive BP drop. Not for self-medication.'],
    [hbp, 'herb', 'Jatamansi', 'जटामांसी', 'Calms nervous system, reduces stress-induced hypertension', 'तंत्रिका तंत्र शांत करता है, तनाव-जनित उच्च रक्तचाप कम करता है', 'Take 250-500mg powder with honey twice daily', 'Safe for mild-moderate BP. Not sufficient alone for severe hypertension.'],
    [hbp, 'diet', 'DASH-Ayurvedic Diet', 'डैश-आयुर्वेदिक आहार', 'Low sodium, high potassium foods. Garlic, amla, watermelon, banana, coconut water.', 'कम नमक, अधिक पोटैशियम। लहसुन, आंवला, तरबूज, केला, नारियल पानी।', 'Eat 2-3 raw garlic cloves morning. Drink coconut water daily. Reduce salt to minimum.', 'Replace regular salt with Sendha Namak (rock salt). Avoid pickles, papad, processed food.'],
    [hbp, 'lifestyle', 'Pranayama for BP', 'बीपी के लिए प्राणायाम', 'Slow breathing reduces BP by 10-15 mmHg. Proven in clinical studies.', 'धीमी श्वास बीपी 10-15 mmHg कम करती है।', 'Practice Anulom Vilom 15 mins + Bhramari 5 mins daily. Avoid Kapalabhati and Bhastrika.', 'AVOID forceful breathing (Kapalabhati, Bhastrika). Only slow, gentle pranayama.'],

    // THYROID
    [thyroid, 'herb', 'Kanchanar Guggulu', 'कांचनार गुग्गुलु', 'Primary Ayurvedic medicine for thyroid. Reduces goiter, balances T3/T4.', 'थायरॉइड के लिए प्राथमिक आयुर्वेदिक दवा। गोइटर कम करता है।', 'Take 2 tablets twice daily before meals with warm water. Use for 3-6 months.', 'Works for both hypo and hyper thyroid. Consult practitioner for dosage adjustment.'],
    [thyroid, 'herb', 'Ashwagandha', 'अश्वगंधा', 'Stimulates thyroid hormone production. Proven to increase T4 levels.', 'थायरॉइड हार्मोन उत्पादन उत्तेजित करता है। T4 बढ़ाने के लिए सिद्ध।', 'Take 600mg KSM-66 extract or 3-5g powder with milk daily', 'For HYPOTHYROID mainly. Avoid in hyperthyroid (may overstimulate).'],
    [thyroid, 'herb', 'Guggulu (Shuddha)', 'शुद्ध गुग्गुलु', 'Stimulates thyroid function, improves T3/T4 conversion, reduces cholesterol', 'थायरॉइड कार्य उत्तेजित करता है, T3/T4 रूपांतरण सुधारता है', 'Take Kanchanar Guggulu or Triphala Guggulu 2 tablets twice daily', 'May interact with thyroid medication. Inform your doctor.'],
    [thyroid, 'diet', 'Thyroid-Supporting Foods', 'थायरॉइड-सहायक भोजन', 'Iodine-rich foods for hypo, avoid goitrogens. Selenium and zinc important.', 'हाइपो के लिए आयोडीन-युक्त भोजन। सेलेनियम और जिंक महत्वपूर्ण।', 'Include: coconut oil, fish, eggs, Brazil nuts (selenium), pumpkin seeds (zinc). Avoid: raw cabbage, soy, cauliflower (goitrogens).', 'Cook cruciferous vegetables (destroys goitrogens). Avoid soy products.'],

    // PILES
    [piles, 'herb', 'Arshoghni Vati', 'अर्शोघ्नी वटी', 'Classical formula specifically for piles. Reduces swelling and bleeding.', 'बवासीर के लिए शास्त्रीय योग। सूजन और रक्तस्राव कम करता है।', 'Take 2 tablets twice daily after meals with buttermilk', 'For both bleeding and non-bleeding piles. Use for 4-8 weeks.'],
    [piles, 'herb', 'Triphala', 'त्रिफला', 'Prevents constipation (root cause of piles), heals rectal tissue', 'कब्ज रोकता है (बवासीर का मूल कारण), मलाशय ऊतक ठीक करता है', 'Take 1 tsp triphala with warm water at bedtime daily', 'Essential — constipation must be resolved first for piles to heal.'],
    [piles, 'home_remedy', 'Sitz Bath with Triphala', 'त्रिफला सिट्ज़ बाथ', 'Warm water soak reduces pain, swelling, and promotes healing', 'गर्म पानी में बैठना दर्द, सूजन कम करता है', 'Boil triphala in water. Cool to warm. Sit in it for 15-20 mins twice daily.', 'Water should be warm, not hot. Pat dry gently after.'],
    [piles, 'lifestyle', 'Fiber + Hydration', 'फाइबर + हाइड्रेशन', 'Soft stools are essential. High fiber + 8-10 glasses water daily.', 'मुलायम मल आवश्यक है। उच्च फाइबर + 8-10 गिलास पानी।', 'Isabgol 1 tsp at bedtime. Papaya morning. Never strain during bowel movement. Squat position.', 'Never suppress urge. Use Indian toilet (squat) if possible. Avoid sitting for long hours.'],

    // ASTHMA
    [asthma, 'herb', 'Vasaka (Adhatoda)', 'वासा (अडूसा)', 'Best bronchodilator in Ayurveda. Opens airways, reduces bronchospasm.', 'आयुर्वेद में सर्वश्रेष्ठ ब्रोंकोडायलेटर। वायुमार्ग खोलता है।', 'Vasavaleha 1-2 tsp twice daily. Or fresh leaf juice 10ml with honey.', 'Supplement to inhaler, not replacement. Avoid in pregnancy.'],
    [asthma, 'herb', 'Kantakari', 'कंटकारी', 'Specific for bronchial asthma. Reduces Kapha in lungs.', 'ब्रोन्कियल अस्थमा के लिए विशिष्ट। फेफड़ों में कफ कम करता है।', 'Kantakari Avaleha 1 tsp or decoction 30ml twice daily', 'Very effective for Kapha-type asthma with phlegm.'],
    [asthma, 'herb', 'Pippali (Long Pepper)', 'पिप्पली', 'Rejuvenates lungs. Vardhamana Pippali protocol is specific for asthma.', 'फेफड़ों को पुनर्जीवित करता है। वर्धमान पिप्पली अस्थमा के लिए विशिष्ट।', 'Vardhamana: start 1 pippali/day, increase by 1 daily to 10, then decrease. With honey.', 'Graduated dosing is important. Avoid in high Pitta/acidity.'],

    // UTI
    [uti, 'herb', 'Gokshura', 'गोक्षुरा', 'Best herb for urinary tract. Soothes inflammation, fights infection.', 'मूत्र मार्ग के लिए सर्वश्रेष्ठ जड़ी-बूटी। सूजन शांत करता है।', 'Take 3-5g powder with warm water twice daily. Or Gokshuradi Guggulu 2 tablets.', 'Very safe. Increases urination (desired effect). Drink plenty of water.'],
    [uti, 'herb', 'Punarnava', 'पुनर्नवा', 'Natural diuretic that flushes bacteria. Anti-inflammatory for urinary tract.', 'प्राकृतिक मूत्रवर्धक जो बैक्टीरिया बाहर निकालता है।', 'Take 3-5g powder or 20ml juice twice daily', 'Very safe. Excellent for recurrent UTIs.'],
    [uti, 'herb', 'Chandraprabha Vati', 'चंद्रप्रभा वटी', 'Classical formula for all urinary disorders. Anti-infective and tonic.', 'सभी मूत्र विकारों के लिए शास्त्रीय योग।', 'Take 2 tablets twice daily with warm water after meals', 'Safe for long-term use. Also helps in diabetes and reproductive health.'],
    [uti, 'home_remedy', 'Coriander Seed Water', 'धनिया बीज पानी', 'Cooling, anti-inflammatory, flushes urinary tract naturally', 'ठंडा, सूजन-रोधी, मूत्र मार्ग को प्राकृतिक रूप से साफ करता है', 'Soak 2 tsp coriander seeds in water overnight. Strain and drink morning. Repeat 3x daily.', 'Very safe. Also helps with burning urination.'],

    // KIDNEY STONES
    [kidney, 'herb', 'Varuna (Crataeva)', 'वरुण', 'Primary stone-breaking herb. Prevents new stone formation.', 'प्राथमिक पथरी-तोड़ने वाली जड़ी-बूटी। नई पथरी बनने से रोकता है।', 'Varunadi Kashayam 15-30ml twice daily. Or bark powder 3-5g. Use for 2-3 months.', 'Works best for stones <10mm. Larger stones may need medical intervention.'],
    [kidney, 'herb', 'Pashanbhed (Bergenia)', 'पाषाणभेद', 'Name literally means "stone breaker." Dissolves calcium oxalate stones.', 'नाम का शाब्दिक अर्थ "पत्थर तोड़ने वाला।" कैल्शियम ऑक्सालेट पथरी घोलता है।', 'Take 3-5g powder with warm water twice daily. Or decoction 30-50ml.', 'Use for 2-3 months. Get ultrasound to monitor stone size.'],
    [kidney, 'herb', 'Bhumyamalaki (Phyllanthus)', 'भूम्यामलकी', 'Called "stone breaker" worldwide. Dissolves and prevents kidney stones.', 'दुनिया भर में "पत्थर तोड़ने वाला" कहा जाता है।', 'Take 3-5g powder or 20ml juice twice daily for 2-3 months', 'Very safe. Also protects liver. Clinically proven for stones.'],
    [kidney, 'home_remedy', 'Lemon + Olive Oil', 'नींबू + जैतून तेल', 'Citrate in lemon prevents stone formation. Oil lubricates passage.', 'नींबू में साइट्रेट पथरी बनने से रोकता है।', 'Mix juice of 1 lemon + 1 tbsp olive oil + warm water. Drink morning empty stomach.', 'Drink 3-4 liters water daily. This is the most important thing for kidney stones.'],

    // LIVER
    [liver, 'herb', 'Kutki (Picrorhiza)', 'कुटकी', 'Most powerful liver protector in Ayurveda. Regenerates liver cells.', 'आयुर्वेद में सबसे शक्तिशाली यकृत रक्षक। यकृत कोशिकाओं को पुनर्जीवित करता है।', 'Arogyavardhini Vati 2 tablets twice daily. Or Kutki powder 500mg-1g with honey.', 'Very bitter. Use Arogyavardhini Vati (tablet form) for convenience.'],
    [liver, 'herb', 'Bhumyamalaki', 'भूम्यामलकी', 'Proven hepatoprotective. Used in hepatitis, jaundice, fatty liver.', 'सिद्ध यकृत-रक्षक। हेपेटाइटिस, पीलिया, फैटी लिवर में उपयोग।', 'Take 3-5g powder or 20ml juice twice daily', 'Very safe. Can be used long-term for fatty liver.'],
    [liver, 'herb', 'Kalmegh (Andrographis)', 'कालमेघ', 'King of Bitters. Powerful liver cleanser and protector.', 'कड़वाहट का राजा। शक्तिशाली यकृत शोधक और रक्षक।', 'Kalmegh tablets 2 twice daily. Or powder 1-2g with honey (very bitter).', 'Very bitter taste. Tablets are easier. Avoid in pregnancy.'],
    [liver, 'diet', 'Liver-Cleansing Diet', 'यकृत-शोधन आहार', 'Bitter foods cleanse liver. Avoid alcohol, fried food, sugar completely.', 'कड़वे खाद्य पदार्थ यकृत साफ करते हैं। शराब, तला भोजन, चीनी पूरी तरह बंद करें।', 'Include: bitter gourd, turmeric, amla, aloe vera juice, green leafy vegetables. Avoid: alcohol, fried, processed, sugar, maida.', 'Alcohol is the #1 liver enemy. Complete abstinence needed for liver healing.'],

    // ANEMIA
    [anemia, 'herb', 'Punarnava Mandur', 'पुनर्नवा मंडूर', 'Classical iron preparation with Punarnava. Best Ayurvedic treatment for anemia.', 'पुनर्नवा के साथ शास्त्रीय लौह योग। एनीमिया का सर्वश्रेष्ठ आयुर्वेदिक उपचार।', 'Take 2 tablets twice daily after meals with warm water or orange juice (Vitamin C helps absorption)', 'Use for 2-3 months. Get hemoglobin tested monthly.'],
    [anemia, 'herb', 'Loha Bhasma (Iron Ash)', 'लौह भस्म', 'Ayurvedic nano-iron preparation. Better absorbed than regular iron supplements.', 'आयुर्वेदिक नैनो-आयरन। सामान्य आयरन सप्लीमेंट से बेहतर अवशोषित।', 'Take as directed by practitioner (usually 125-250mg with honey and ghee)', 'MUST be prescribed by qualified practitioner. Self-medication not recommended.'],
    [anemia, 'diet', 'Iron-Rich Ayurvedic Diet', 'आयरन-युक्त आयुर्वेदिक आहार', 'Specific foods that boost hemoglobin naturally', 'विशिष्ट खाद्य पदार्थ जो प्राकृतिक रूप से हीमोग्लोबिन बढ़ाते हैं', 'Daily: black sesame 1 tsp, dates 3-4, pomegranate juice, beetroot, jaggery, spinach, amla. Take with Vitamin C for absorption.', 'Avoid tea/coffee with meals (blocks iron absorption). Take iron foods with lemon/amla.'],

    // HIGH CHOLESTEROL
    [cholesterol, 'herb', 'Arjuna', 'अर्जुन', 'Reduces LDL and triglycerides, increases HDL. Proven in clinical trials.', 'LDL और ट्राइग्लिसराइड्स कम करता है, HDL बढ़ाता है।', 'Arjuna bark powder 3-5g with warm water twice daily. Or Arjunarishta 15-20ml.', 'Takes 2-3 months for significant cholesterol reduction.'],
    [cholesterol, 'herb', 'Guggulu (Medohar)', 'गुग्गुलु (मेदोहर)', 'Contains guggulsterones — proven to lower cholesterol by 20-25%.', 'गुग्गुलस्टेरोन — कोलेस्ट्रॉल 20-25% कम करने के लिए सिद्ध।', 'Medohar Guggulu or Triphala Guggulu 2 tablets twice daily after meals', 'May interact with thyroid medication and blood thinners.'],
    [cholesterol, 'herb', 'Garlic (Lahsun)', 'लहसुन', 'Allicin reduces cholesterol synthesis. 2-3 raw cloves daily proven effective.', 'एलिसिन कोलेस्ट्रॉल संश्लेषण कम करता है। 2-3 कच्ची कलियां प्रभावी।', 'Eat 2-3 raw garlic cloves morning empty stomach with warm water', 'Raw garlic causes bad breath. Take with honey if taste is too strong.'],
    [cholesterol, 'diet', 'Cholesterol-Lowering Diet', 'कोलेस्ट्रॉल-कम करने वाला आहार', 'Fiber, omega-3, and plant sterols reduce cholesterol naturally', 'फाइबर, ओमेगा-3, और प्लांट स्टेरोल प्राकृतिक रूप से कोलेस्ट्रॉल कम करते हैं', 'Include: oats, flaxseeds, walnuts, garlic, fenugreek, amla, turmeric. Avoid: ghee excess, fried food, red meat, full-fat dairy.', 'Moderate ghee (1 tsp) is fine. Excess is harmful. Cook in mustard oil.']
  ];

  const insertRemedies = db.transaction((items) => {
    for (const item of items) { insertRemedy.run(...item); }
  });
  insertRemedies(remedies);

  console.log(`  More Problems: ${symptoms.length} new health problems + ${remedies.length} remedies added`);
}

module.exports = { seedMoreProblems };
