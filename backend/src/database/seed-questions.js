function seedAssessmentQuestions(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessment_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symptom_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      question_hi TEXT,
      question_order INTEGER NOT NULL,
      options TEXT NOT NULL,
      category TEXT NOT NULL,
      FOREIGN KEY (symptom_id) REFERENCES symptoms(id)
    );
  `);

  const insert = db.prepare(`
    INSERT INTO assessment_questions (symptom_id, question, question_hi, question_order, options, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Options are JSON: [{value, label, label_hi, dosha_hint}]
  const questions = [
    // ACIDITY (1)
    [1, 'How severe is your acidity?', 'आपकी एसिडिटी कितनी गंभीर है?', 1,
      JSON.stringify([
        {value: 'mild', label: 'Mild — occasional discomfort after meals', label_hi: 'हल्की — भोजन के बाद कभी-कभी असुविधा'},
        {value: 'moderate', label: 'Moderate — burning sensation daily', label_hi: 'मध्यम — रोज जलन'},
        {value: 'severe', label: 'Severe — constant pain, acid reflux, can\'t sleep', label_hi: 'गंभीर — लगातार दर्द, एसिड रिफ्लक्स, नींद नहीं'}
      ]), 'severity'],
    [1, 'When does it get worse?', 'यह कब बिगड़ता है?', 2,
      JSON.stringify([
        {value: 'empty_stomach', label: 'On empty stomach / morning', label_hi: 'खाली पेट / सुबह'},
        {value: 'after_food', label: 'After eating / at night', label_hi: 'खाने के बाद / रात को'},
        {value: 'stress', label: 'During stress or anger', label_hi: 'तनाव या गुस्से के दौरान'},
        {value: 'spicy', label: 'After spicy/oily food', label_hi: 'मसालेदार/तैलीय भोजन के बाद'}
      ]), 'trigger'],
    [1, 'How long have you had this problem?', 'यह समस्या कितने समय से है?', 3,
      JSON.stringify([
        {value: 'recent', label: 'Less than 2 weeks', label_hi: '2 सप्ताह से कम'},
        {value: 'months', label: '1-6 months', label_hi: '1-6 महीने'},
        {value: 'chronic', label: 'More than 6 months', label_hi: '6 महीने से अधिक'}
      ]), 'duration'],
    [1, 'Do you have any of these associated symptoms?', 'क्या आपको इनमें से कोई संबंधित लक्षण है?', 4,
      JSON.stringify([
        {value: 'bloating', label: 'Bloating and gas', label_hi: 'पेट फूलना और गैस'},
        {value: 'nausea', label: 'Nausea or vomiting', label_hi: 'मतली या उल्टी'},
        {value: 'headache', label: 'Headache with acidity', label_hi: 'एसिडिटी के साथ सिरदर्द'},
        {value: 'none', label: 'No other symptoms', label_hi: 'कोई अन्य लक्षण नहीं'}
      ]), 'associated'],

    // BACK PAIN (2)
    [2, 'Where exactly is the pain?', 'दर्द ठीक कहाँ है?', 1,
      JSON.stringify([
        {value: 'lower', label: 'Lower back (lumbar)', label_hi: 'कमर के नीचे (लम्बर)'},
        {value: 'upper', label: 'Upper back (between shoulders)', label_hi: 'ऊपरी पीठ (कंधों के बीच)'},
        {value: 'sciatica', label: 'Radiating to legs (sciatica)', label_hi: 'पैरों तक जाता है (साइटिका)'},
        {value: 'neck', label: 'Neck and shoulders', label_hi: 'गर्दन और कंधे'}
      ]), 'location'],
    [2, 'What makes it worse?', 'क्या इसे बदतर बनाता है?', 2,
      JSON.stringify([
        {value: 'sitting', label: 'Long sitting (desk job)', label_hi: 'लंबे समय तक बैठना (डेस्क जॉब)'},
        {value: 'morning', label: 'Worse in morning / cold weather', label_hi: 'सुबह / ठंड में बदतर'},
        {value: 'lifting', label: 'After lifting heavy objects', label_hi: 'भारी वस्तु उठाने के बाद'},
        {value: 'always', label: 'Constant pain regardless', label_hi: 'लगातार दर्द'}
      ]), 'trigger'],
    [2, 'How long have you had this?', 'यह कितने समय से है?', 3,
      JSON.stringify([
        {value: 'acute', label: 'Less than 2 weeks (acute)', label_hi: '2 सप्ताह से कम (तीव्र)'},
        {value: 'subacute', label: '2 weeks to 3 months', label_hi: '2 सप्ताह से 3 महीने'},
        {value: 'chronic', label: 'More than 3 months (chronic)', label_hi: '3 महीने से अधिक (पुराना)'}
      ]), 'duration'],
    [2, 'What is the nature of pain?', 'दर्द की प्रकृति क्या है?', 4,
      JSON.stringify([
        {value: 'stiff', label: 'Stiffness and dull ache (Vata)', label_hi: 'अकड़न और हल्का दर्द (वात)'},
        {value: 'burning', label: 'Burning or inflamed (Pitta)', label_hi: 'जलन या सूजन (पित्त)'},
        {value: 'heavy', label: 'Heavy and swollen (Kapha)', label_hi: 'भारीपन और सूजन (कफ)'}
      ]), 'dosha_type'],

    // INSOMNIA (3)
    [3, 'What type of sleep problem do you have?', 'आपको किस प्रकार की नींद की समस्या है?', 1,
      JSON.stringify([
        {value: 'onset', label: 'Can\'t fall asleep (takes >30 mins)', label_hi: 'नींद नहीं आती (30 मिनट से अधिक)'},
        {value: 'maintenance', label: 'Wake up in middle of night', label_hi: 'रात में बीच में जाग जाते हैं'},
        {value: 'early', label: 'Wake up too early (3-4 AM)', label_hi: 'बहुत जल्दी जाग जाते हैं (3-4 बजे)'},
        {value: 'quality', label: 'Sleep but don\'t feel rested', label_hi: 'सोते हैं पर आराम नहीं मिलता'}
      ]), 'type'],
    [3, 'What keeps you awake?', 'क्या आपको जगाए रखता है?', 2,
      JSON.stringify([
        {value: 'thoughts', label: 'Racing thoughts / anxiety', label_hi: 'दौड़ते विचार / चिंता'},
        {value: 'body', label: 'Body pain or restlessness', label_hi: 'शरीर दर्द या बेचैनी'},
        {value: 'screen', label: 'Phone/screen before bed', label_hi: 'सोने से पहले फोन/स्क्रीन'},
        {value: 'unknown', label: 'Don\'t know — just can\'t sleep', label_hi: 'पता नहीं — बस नींद नहीं आती'}
      ]), 'cause'],
    [3, 'What time do you usually go to bed?', 'आप आमतौर पर कितने बजे सोते हैं?', 3,
      JSON.stringify([
        {value: 'before10', label: 'Before 10 PM', label_hi: 'रात 10 बजे से पहले'},
        {value: '10to12', label: '10 PM - 12 AM', label_hi: 'रात 10-12 बजे'},
        {value: 'after12', label: 'After midnight', label_hi: 'आधी रात के बाद'}
      ]), 'timing'],

    // STRESS & ANXIETY (4)
    [4, 'How does your stress manifest?', 'आपका तनाव कैसे प्रकट होता है?', 1,
      JSON.stringify([
        {value: 'mental', label: 'Racing thoughts, worry, can\'t relax', label_hi: 'दौड़ते विचार, चिंता, आराम नहीं'},
        {value: 'physical', label: 'Muscle tension, headache, fatigue', label_hi: 'मांसपेशी तनाव, सिरदर्द, थकान'},
        {value: 'emotional', label: 'Irritability, anger, mood swings', label_hi: 'चिड़चिड़ापन, गुस्सा, मूड स्विंग'},
        {value: 'sleep', label: 'Insomnia, nightmares, restless sleep', label_hi: 'अनिद्रा, बुरे सपने, बेचैन नींद'}
      ]), 'manifestation'],
    [4, 'What is the main source of stress?', 'तनाव का मुख्य स्रोत क्या है?', 2,
      JSON.stringify([
        {value: 'work', label: 'Work / career pressure', label_hi: 'काम / करियर का दबाव'},
        {value: 'relationship', label: 'Relationships / family', label_hi: 'रिश्ते / परिवार'},
        {value: 'health', label: 'Health concerns', label_hi: 'स्वास्थ्य चिंताएं'},
        {value: 'general', label: 'General anxiety / no specific cause', label_hi: 'सामान्य चिंता / कोई विशिष्ट कारण नहीं'}
      ]), 'source'],
    [4, 'How long have you been feeling this way?', 'आप कितने समय से ऐसा महसूस कर रहे हैं?', 3,
      JSON.stringify([
        {value: 'recent', label: 'Less than a month', label_hi: 'एक महीने से कम'},
        {value: 'months', label: '1-6 months', label_hi: '1-6 महीने'},
        {value: 'chronic', label: 'More than 6 months', label_hi: '6 महीने से अधिक'}
      ]), 'duration'],

    // HAIR FALL (5)
    [5, 'What type of hair fall are you experiencing?', 'आपको किस प्रकार का बाल झड़ना है?', 1,
      JSON.stringify([
        {value: 'diffuse', label: 'Overall thinning from all over', label_hi: 'पूरे सिर से पतले हो रहे'},
        {value: 'patches', label: 'Patches / bald spots', label_hi: 'जगह-जगह / गंजे धब्बे'},
        {value: 'hairline', label: 'Receding hairline / temples', label_hi: 'हेयरलाइन पीछे हट रही'},
        {value: 'breakage', label: 'Hair breaking from middle (not roots)', label_hi: 'बाल बीच से टूट रहे (जड़ से नहीं)'}
      ]), 'type'],
    [5, 'What do you think is the cause?', 'आपको क्या लगता है कारण क्या है?', 2,
      JSON.stringify([
        {value: 'stress', label: 'Stress / lifestyle', label_hi: 'तनाव / जीवनशैली'},
        {value: 'hormonal', label: 'Hormonal (thyroid, PCOS, postpartum)', label_hi: 'हार्मोनल (थायरॉइड, PCOS, प्रसव के बाद)'},
        {value: 'diet', label: 'Poor diet / nutritional deficiency', label_hi: 'खराब आहार / पोषण की कमी'},
        {value: 'unknown', label: 'Don\'t know', label_hi: 'पता नहीं'}
      ]), 'cause'],
    [5, 'How is your scalp condition?', 'आपकी स्कैल्प की स्थिति कैसी है?', 3,
      JSON.stringify([
        {value: 'dry', label: 'Dry and flaky (dandruff)', label_hi: 'सूखी और पपड़ीदार (रूसी)'},
        {value: 'oily', label: 'Very oily / greasy', label_hi: 'बहुत तैलीय'},
        {value: 'itchy', label: 'Itchy and irritated', label_hi: 'खुजली और जलन'},
        {value: 'normal', label: 'Normal scalp', label_hi: 'सामान्य स्कैल्प'}
      ]), 'scalp']
  ];

  const insertBatch = db.transaction((items) => {
    for (const item of items) { insert.run(...item); }
  });
  insertBatch(questions);

  console.log(`  Assessment: ${questions.length} personalization questions added`);
}

module.exports = { seedAssessmentQuestions };
