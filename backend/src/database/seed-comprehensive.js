function seedComprehensiveData(db) {
  const insertRemedy = db.prepare(`
    INSERT INTO remedies (symptom_id, type, title, title_hi, description, description_hi, how_to_use, precautions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // ACIDITY (1) - Additional remedies
  const acidityRemedies = [
    [1, 'herb', 'Avipattikar Churna', 'अविपत्तिकर चूर्ण', 'Classical Ayurvedic formula specifically for hyperacidity and GERD. Contains 14 herbs.', 'अम्लपित्त और GERD के लिए शास्त्रीय आयुर्वेदिक योग। 14 जड़ी-बूटियां।', 'Take 3-5g with warm water or milk after meals twice daily', 'Avoid in pregnancy. Reduce dose if loose stools occur.'],
    [1, 'herb', 'Shatavari', 'शतावरी', 'Soothes and heals inflamed stomach lining. Natural antacid with cooling properties.', 'सूजी हुई पेट की परत को शांत और ठीक करता है।', 'Take 1 tsp shatavari powder with cold milk twice daily before meals', 'Avoid if you have estrogen-sensitive conditions'],
    [1, 'herb', 'Praval Pishti (Coral Calcium)', 'प्रवाल पिष्टी', 'Ayurvedic calcium preparation that instantly neutralizes excess acid', 'आयुर्वेदिक कैल्शियम जो तुरंत अतिरिक्त एसिड को निष्क्रिय करता है', 'Take 250-500mg with honey or milk twice daily', 'Use only purified pharmaceutical grade'],
    [1, 'herb', 'Aloe Vera (Kumari)', 'एलोवेरा (कुमारी)', 'Heals stomach ulcers, reduces inflammation, cools pitta', 'पेट के अल्सर ठीक करता है, सूजन कम करता है, पित्त शांत करता है', 'Drink 30ml fresh aloe vera juice on empty stomach morning', 'Avoid during pregnancy. Buy food-grade aloe only.'],
    [1, 'diet', 'Pitta-Pacifying Foods', 'पित्त-शामक भोजन', 'Favor sweet, bitter, astringent tastes. Include ghee, rice, milk, coconut, coriander.', 'मीठा, कड़वा, कसैला स्वाद लें। घी, चावल, दूध, नारियल शामिल करें।', 'Start meals with a tsp of ghee. Drink buttermilk with lunch. Avoid eating after 8 PM.', 'Strictly avoid: spicy, sour, fermented, fried, alcohol, coffee'],
    [1, 'home_remedy', 'Fennel Seed Water', 'सौंफ का पानी', 'Fennel is a natural coolant that reduces acid production and soothes stomach', 'सौंफ प्राकृतिक शीतलक है जो एसिड उत्पादन कम करता है', 'Soak 1 tsp fennel seeds in water overnight. Strain and drink morning. Also chew after meals.', 'Safe for everyone including pregnant women'],
    [1, 'home_remedy', 'Banana and Cardamom', 'केला और इलायची', 'Banana coats stomach lining, cardamom aids digestion and reduces burning', 'केला पेट की परत को ढकता है, इलायची पाचन में सहायक', 'Eat a ripe banana with a pinch of cardamom powder when acidity strikes', 'Use ripe bananas only. Raw banana may worsen.'],
    [1, 'lifestyle', 'Stress Management', 'तनाव प्रबंधन', 'Stress directly increases acid production. Meditation and pranayama are essential.', 'तनाव सीधे एसिड उत्पादन बढ़ाता है। ध्यान और प्राणायाम आवश्यक हैं।', 'Practice 10 mins meditation daily. Do Sheetali pranayama. Avoid eating when stressed or angry.', 'Never eat in a hurry or while watching screens']
  ];

  // BACK PAIN (2) - Additional remedies
  const backPainRemedies = [
    [2, 'herb', 'Guggulu (Yogaraja Guggulu)', 'गुग्गुलु (योगराज गुग्गुलु)', 'Classical formula for musculoskeletal pain. Reduces inflammation and stiffness.', 'मांसपेशियों के दर्द के लिए शास्त्रीय योग। सूजन और अकड़न कम करता है।', 'Take 2 tablets of Yogaraja Guggulu twice daily after meals with warm water', 'Avoid in pregnancy. May interact with thyroid medication.'],
    [2, 'herb', 'Rasna (Pluchea lanceolata)', 'रास्ना', 'Powerful anti-inflammatory herb specifically for Vata-type pain and sciatica', 'वात-प्रकार के दर्द और साइटिका के लिए शक्तिशाली सूजन-रोधी जड़ी-बूटी', 'Take Rasnadi Kashayam or Rasna powder 3g with warm water twice daily', 'Consult practitioner for correct formulation'],
    [2, 'herb', 'Shallaki (Boswellia)', 'शल्लकी', 'Clinically proven anti-inflammatory. Reduces pain without side effects of painkillers.', 'चिकित्सकीय रूप से सिद्ध सूजन-रोधी। दर्दनिवारकों के दुष्प्रभाव के बिना।', 'Take 400-800mg Boswellia extract twice daily. Results in 2-4 weeks.', 'Very safe for long-term use. No known serious side effects.'],
    [2, 'herb', 'Mahanarayan Oil', 'महानारायण तेल', 'Classical medicated oil with 50+ herbs. Gold standard for external pain relief.', '50+ जड़ी-बूटियों वाला शास्त्रीय औषधीय तेल। बाहरी दर्द निवारण का स्वर्ण मानक।', 'Warm oil slightly. Massage on back for 15-20 mins. Follow with hot water bag. Daily.', 'External use only. Do patch test first.'],
    [2, 'lifestyle', 'Kati Basti Therapy', 'कटि बस्ती', 'Warm medicated oil pooled on lower back using dough ring. Professional Panchakarma therapy.', 'आटे की अंगूठी से पीठ पर गर्म औषधीय तेल। पंचकर्म चिकित्सा।', 'Visit Ayurvedic clinic for professional Kati Basti. 7-14 sessions recommended.', 'Must be done by trained therapist. Not a home remedy.'],
    [2, 'home_remedy', 'Ginger-Turmeric Paste', 'अदरक-हल्दी लेप', 'Anti-inflammatory paste for external application on painful area', 'दर्द वाले क्षेत्र पर बाहरी लगाने के लिए सूजन-रोधी लेप', 'Mix ginger powder + turmeric + warm sesame oil into paste. Apply on back. Cover with cloth. Leave 30 mins.', 'May stain clothes. Do patch test for skin sensitivity.'],
    [2, 'diet', 'Anti-Vata Diet', 'वात-शामक आहार', 'Warm, oily, nourishing foods. Avoid cold, dry, raw foods that aggravate Vata.', 'गर्म, तैलीय, पौष्टिक भोजन। ठंडे, सूखे, कच्चे भोजन से बचें।', 'Include ghee, warm soups, cooked vegetables, sesame seeds. Drink warm water throughout day.', 'Avoid: cold drinks, salads, beans, dry crackers, leftover food']
  ];

  const insertBatch = db.transaction((items) => {
    for (const item of items) { insertRemedy.run(...item); }
  });
  insertBatch(acidityRemedies);
  insertBatch(backPainRemedies);

  // INSOMNIA (3) - Additional remedies
  const insomniaRemedies = [
    [3, 'herb', 'Tagara (Indian Valerian)', 'तगर', 'Natural sedative that calms the nervous system without morning grogginess', 'प्राकृतिक शामक जो सुबह की सुस्ती के बिना तंत्रिका तंत्र को शांत करता है', 'Take 250-500mg tagara powder with warm milk 1 hour before bed', 'Start with low dose. May cause vivid dreams initially.'],
    [3, 'herb', 'Sarpagandha (Rauwolfia)', 'सर्पगंधा', 'Powerful sedative herb used for severe insomnia and hypertension', 'गंभीर अनिद्रा और उच्च रक्तचाप के लिए शक्तिशाली शामक जड़ी-बूटी', 'Take only under practitioner guidance. Usually 50-100mg at bedtime.', 'MUST consult Ayurvedic doctor. Can lower BP significantly. Not for self-medication.'],
    [3, 'herb', 'Saraswatarishta', 'सारस्वतारिष्ट', 'Classical Ayurvedic tonic for nervous system. Promotes deep restful sleep.', 'तंत्रिका तंत्र के लिए शास्त्रीय आयुर्वेदिक टॉनिक। गहरी नींद को बढ़ावा देता है।', 'Take 15-20ml with equal water after dinner', 'Contains self-generated alcohol. Safe and non-addictive.'],
    [3, 'herb', 'Nutmeg (Jaiphal)', 'जायफल', 'Warming spice with natural sedative properties. Promotes sleep onset.', 'प्राकृतिक शामक गुणों वाला गर्म मसाला। नींद आने में मदद करता है।', 'Add a pinch (1/4 tsp) of nutmeg powder to warm milk at bedtime', 'Never exceed 1/4 tsp. Large doses are toxic. Not for children.'],
    [3, 'lifestyle', 'Shirodhara Therapy', 'शिरोधारा', 'Warm oil poured in continuous stream on forehead. Most powerful therapy for insomnia.', 'माथे पर निरंतर धारा में गर्म तेल। अनिद्रा के लिए सबसे शक्तिशाली चिकित्सा।', 'Visit Ayurvedic clinic. 7-14 sessions of 30-45 mins each. Deeply relaxing.', 'Professional therapy only. Not a home remedy.'],
    [3, 'lifestyle', 'Sleep Hygiene (Nidra Swasthya)', 'नींद स्वच्छता', 'Fixed sleep schedule, dark room, no screens 1hr before bed, cool temperature', 'निश्चित नींद अनुसूची, अंधेरा कमरा, सोने से 1 घंटे पहले स्क्रीन नहीं', 'Sleep by 10 PM (Kapha time). Wake by 6 AM. Oil massage feet before bed. Lavender in room.', 'Avoid caffeine after 2 PM. No heavy dinner. No arguments before bed.'],
    [3, 'home_remedy', 'Warm Milk with Spices', 'मसाला दूध', 'Milk contains tryptophan. With nutmeg, cardamom, and ashwagandha it becomes a sleep tonic.', 'दूध में ट्रिप्टोफैन होता है। जायफल, इलायची, अश्वगंधा के साथ यह नींद टॉनिक बनता है।', 'Warm milk + pinch nutmeg + pinch cardamom + 1/2 tsp ashwagandha + honey. Drink 30 mins before bed.', 'Skip if lactose intolerant. Use almond milk as alternative.'],
    [3, 'home_remedy', 'Cherry and Banana Smoothie', 'चेरी-केला स्मूदी', 'Both contain natural melatonin and tryptophan that promote sleep', 'दोनों में प्राकृतिक मेलाटोनिन और ट्रिप्टोफैन होता है जो नींद को बढ़ावा देता है', 'Blend 1 banana + handful cherries + warm milk. Drink 1 hour before bed.', 'Avoid adding sugar. Natural sweetness is sufficient.']
  ];

  // STRESS & ANXIETY (4) - Additional remedies
  const stressRemedies = [
    [4, 'herb', 'Ashwagandha (KSM-66)', 'अश्वगंधा', 'Clinically proven to reduce cortisol by 27%. Most researched adaptogen.', 'कोर्टिसोल 27% कम करने के लिए चिकित्सकीय रूप से सिद्ध।', 'Take 300mg KSM-66 extract twice daily, or 1 tsp root powder with warm milk at night', 'Avoid in hyperthyroidism. May cause drowsiness initially.'],
    [4, 'herb', 'Brahmi (Bacopa)', 'ब्राह्मी', 'Reduces anxiety while improving cognitive function. Calms without sedating.', 'संज्ञानात्मक कार्य सुधारते हुए चिंता कम करता है। बिना सुस्ती के शांत करता है।', 'Take 300mg bacopa extract or 2-3g powder with ghee twice daily', 'Takes 4-8 weeks for full effect. Be patient.'],
    [4, 'herb', 'Gotu Kola (Mandukparni)', 'मंडूकपर्णी', 'Brain tonic that reduces anxiety, improves memory, and heals nervous exhaustion', 'मस्तिष्क टॉनिक जो चिंता कम करता है, स्मृति सुधारता है', 'Take 500mg extract or 1 tsp powder with warm water twice daily', 'May cause headache initially. Start with low dose.'],
    [4, 'herb', 'Vacha (Calamus)', 'वचा', 'Opens the mind channels, reduces mental fog, calms racing thoughts', 'मन के चैनल खोलता है, मानसिक धुंध कम करता है, दौड़ते विचारों को शांत करता है', 'Take 250mg powder with honey twice daily. Also used as nasya (nasal drops).', 'Use only purified Vacha. Avoid in pregnancy. Small doses only.'],
    [4, 'herb', 'Tulsi (Holy Basil)', 'तुलसी', 'Adaptogen that reduces cortisol and balances stress hormones naturally', 'एडाप्टोजेन जो कोर्टिसोल कम करता है और तनाव हार्मोन को संतुलित करता है', 'Drink 2-3 cups tulsi tea daily. Or take 500mg tulsi extract.', 'Very safe. Can be taken long-term.'],
    [4, 'diet', 'Sattvic Diet for Mental Peace', 'सात्विक आहार', 'Pure, fresh, light foods that calm the mind. Avoid rajasic (stimulating) and tamasic (heavy) foods.', 'शुद्ध, ताजा, हल्का भोजन जो मन को शांत करता है।', 'Eat fresh fruits, vegetables, whole grains, milk, ghee, nuts. Avoid onion, garlic, meat, alcohol, caffeine.', 'Transition gradually. Sudden change can be stressful itself.'],
    [4, 'lifestyle', 'Abhyanga (Self-Oil Massage)', 'अभ्यंग (स्व-तेल मालिश)', 'Daily warm oil massage calms Vata, nourishes nervous system, grounds the mind', 'दैनिक गर्म तेल मालिश वात शांत करती है, तंत्रिका तंत्र पोषित करती है', 'Warm sesame oil. Massage entire body for 10-15 mins before bath. Focus on head, feet, ears.', 'Use sesame oil for Vata, coconut for Pitta. Do before warm shower.'],
    [4, 'home_remedy', 'Rose Water and Brahmi', 'गुलाब जल और ब्राह्मी', 'Rose cools pitta-type anger/irritation. Brahmi calms vata-type anxiety.', 'गुलाब पित्त-प्रकार के क्रोध को शांत करता है। ब्राह्मी वात-प्रकार की चिंता शांत करती है।', 'Add 1 tsp rose water to a glass of water. Drink twice daily. Take brahmi separately.', 'Use food-grade rose water only.']
  ];

  insertBatch(insomniaRemedies);
  insertBatch(stressRemedies);

  // HAIR FALL (5) - Additional remedies
  const hairFallRemedies = [
    [5, 'herb', 'Amla Oil + Brahmi Oil', 'आंवला + ब्राह्मी तेल', 'Combination of two most powerful hair herbs. Strengthens roots and promotes growth.', 'दो सबसे शक्तिशाली बालों की जड़ी-बूटियों का संयोजन।', 'Mix equal parts amla and brahmi oil. Massage scalp 2-3 times/week. Leave 1-2 hours before wash.', 'Warm oil slightly for better absorption. Use consistently for 3 months.'],
    [5, 'herb', 'Hibiscus (Japa)', 'जपा (गुड़हल)', 'Rich in amino acids that nourish hair. Prevents premature graying and dandruff.', 'अमीनो एसिड से भरपूर जो बालों को पोषित करता है। समय से पहले सफेद होना रोकता है।', 'Grind fresh hibiscus flowers + leaves into paste. Apply on scalp. Leave 30 mins. Wash.', 'Use fresh flowers for best results. Can also boil in coconut oil.'],
    [5, 'herb', 'Narasimha Rasayanam', 'नरसिंह रसायनम', 'Classical Ayurvedic rejuvenative specifically for hair growth and skin health', 'बालों के विकास और त्वचा स्वास्थ्य के लिए शास्त्रीय आयुर्वेदिक रसायन', 'Take 1 tsp with warm milk twice daily on empty stomach', 'Long-term use needed (3-6 months). Very safe.'],
    [5, 'herb', 'Methi (Fenugreek) Seeds', 'मेथी दाना', 'Rich in proteins and nicotinic acid that strengthen hair shaft and prevent breakage', 'प्रोटीन और निकोटिनिक एसिड से भरपूर जो बालों को मजबूत करता है', 'Soak 2 tbsp methi overnight. Grind into paste. Apply on scalp 30 mins before wash. Also eat soaked seeds.', 'May have slight smell. Rinse well.'],
    [5, 'diet', 'Hair-Nourishing Diet', 'बाल-पोषक आहार', 'Hair needs protein, iron, zinc, biotin, omega-3. Include specific foods daily.', 'बालों को प्रोटीन, आयरन, जिंक, बायोटिन, ओमेगा-3 चाहिए।', 'Daily: soaked almonds (5), black sesame seeds (1 tsp), amla, spinach, eggs/lentils, walnuts, coconut.', 'Avoid crash diets — they cause massive hair fall. Eat adequate calories.'],
    [5, 'lifestyle', 'Scalp Care Routine', 'स्कैल्प केयर रूटीन', 'Weekly oiling, gentle washing, avoid heat styling, protect from sun and pollution', 'साप्ताहिक तेल, कोमल धुलाई, हीट स्टाइलिंग से बचें', 'Oil scalp 2-3x/week. Use mild herbal shampoo. Never comb wet hair. Air dry. Cover in sun/pollution.', 'Avoid tight hairstyles. Do not wash with very hot water.'],
    [5, 'home_remedy', 'Onion Juice', 'प्याज का रस', 'Rich in sulfur which boosts collagen production and regrowth. Clinically proven.', 'सल्फर से भरपूर जो कोलेजन उत्पादन और पुनर्विकास को बढ़ावा देता है।', 'Extract fresh onion juice. Apply on scalp. Leave 30-60 mins. Wash with mild shampoo.', 'Strong smell. Apply on weekends. Rinse with lemon water to reduce smell.'],
    [5, 'home_remedy', 'Curry Leaves + Coconut Oil', 'करी पत्ता + नारियल तेल', 'Curry leaves are rich in beta-carotene and proteins. Prevents graying and fall.', 'करी पत्ते बीटा-कैरोटीन और प्रोटीन से भरपूर। सफेद होना और झड़ना रोकता है।', 'Boil handful of curry leaves in coconut oil until leaves turn black. Strain. Use as hair oil.', 'Store in glass bottle. Use within 2 weeks.']
  ];

  // HEADACHE & MIGRAINE (6) - Additional remedies
  const headacheRemedies = [
    [6, 'herb', 'Shirashooladi Vajra Rasa', 'शिरःशूलादि वज्र रस', 'Classical Ayurvedic mineral preparation specifically for chronic headaches and migraine', 'पुराने सिरदर्द और माइग्रेन के लिए शास्त्रीय आयुर्वेदिक खनिज योग', 'Take as directed by Ayurvedic practitioner (usually 125-250mg with honey)', 'Must be prescribed by qualified practitioner. Not for self-medication.'],
    [6, 'herb', 'Godanti Bhasma', 'गोदंती भस्म', 'Ayurvedic calcium preparation from gypsum. Specific for pitta-type headaches.', 'जिप्सम से आयुर्वेदिक कैल्शियम। पित्त-प्रकार के सिरदर्द के लिए विशिष्ट।', 'Take 250-500mg with honey or milk twice daily during headache episodes', 'Safe for short-term use. Consult for chronic use.'],
    [6, 'herb', 'Pathyadi Kashayam', 'पथ्यादि कषायम', 'Classical decoction for all types of headaches. Contains Haritaki, Neem, Guduchi.', 'सभी प्रकार के सिरदर्द के लिए शास्त्रीय काढ़ा।', 'Take 15ml with equal warm water before meals twice daily', 'Bitter taste. Can add honey. Use for 2-4 weeks.'],
    [6, 'lifestyle', 'Nasya (Nasal Oil Therapy)', 'नस्य', 'Medicated oil drops in nostrils. Clears sinus, reduces migraine frequency.', 'नासिका में औषधीय तेल की बूंदें। साइनस साफ करता है, माइग्रेन कम करता है।', 'Lie down, tilt head back. Put 2 drops Anu Taila in each nostril morning. Sniff gently.', 'Do on empty stomach. Avoid in cold/flu. Not during menstruation.'],
    [6, 'home_remedy', 'Cinnamon Paste', 'दालचीनी लेप', 'Cinnamon improves blood circulation and relieves tension headaches', 'दालचीनी रक्त परिसंचरण सुधारती है और तनाव सिरदर्द से राहत देती है', 'Grind cinnamon sticks with water into paste. Apply on forehead and temples. Leave 20 mins.', 'Do patch test first. Avoid if skin is sensitive.'],
    [6, 'home_remedy', 'Clove and Salt', 'लौंग और नमक', 'Clove has eugenol — a natural painkiller. Combined with salt for quick relief.', 'लौंग में यूजेनॉल — प्राकृतिक दर्दनिवारक। नमक के साथ त्वरित राहत।', 'Crush 2 cloves. Mix with pinch of salt and 1 tsp coconut oil. Apply on forehead.', 'External use only. Avoid near eyes.']
  ];

  insertBatch(hairFallRemedies);
  insertBatch(headacheRemedies);

  // CONSTIPATION (7) - Additional remedies
  const constipationRemedies = [
    [7, 'herb', 'Haritaki (Harad)', 'हरीतकी (हरड़)', 'Called "King of Medicines" in Ayurveda. Gentle laxative that tones the colon.', 'आयुर्वेद में "औषधियों का राजा"। कोमल रेचक जो बड़ी आंत को टोन करता है।', 'Take 2-3g haritaki powder with warm water at bedtime. Or chew 1 haritaki fruit.', 'Avoid in pregnancy, severe dehydration, or diarrhea.'],
    [7, 'herb', 'Castor Oil (Eranda Taila)', 'अरंडी का तेल', 'Powerful purgative for stubborn constipation. Lubricates intestines.', 'जिद्दी कब्ज के लिए शक्तिशाली विरेचक। आंतों को चिकना करता है।', 'Take 1-2 tsp castor oil with warm milk at bedtime. Works within 6-8 hours.', 'Not for daily use. Use only for acute constipation. Avoid in pregnancy.'],
    [7, 'herb', 'Abhayarishta', 'अभयारिष्ट', 'Classical Ayurvedic tonic for chronic constipation. Gentle and non-habit forming.', 'पुरानी कब्ज के लिए शास्त्रीय आयुर्वेदिक टॉनिक। कोमल और आदत न बनाने वाला।', 'Take 15-20ml with equal water after meals twice daily', 'Safe for long-term use. Contains self-generated alcohol.'],
    [7, 'diet', 'Fiber-Rich Morning Routine', 'फाइबर-युक्त सुबह की दिनचर्या', 'Specific morning foods that stimulate bowel movement naturally', 'विशिष्ट सुबह के खाद्य पदार्थ जो प्राकृतिक रूप से मल त्याग को उत्तेजित करते हैं', 'Morning: warm water with lemon → soaked raisins (10) → papaya → walk 10 mins → try toilet', 'Increase water intake to 8-10 glasses daily. Fiber without water worsens constipation.'],
    [7, 'home_remedy', 'Ghee in Warm Milk', 'गर्म दूध में घी', 'Ghee lubricates intestines and promotes smooth bowel movement', 'घी आंतों को चिकना करता है और सुचारू मल त्याग को बढ़ावा देता है', 'Add 1-2 tsp pure cow ghee to a glass of warm milk. Drink at bedtime.', 'Very safe. Also nourishes body. Use daily.'],
    [7, 'home_remedy', 'Roasted Fennel + Flaxseed', 'भुनी सौंफ + अलसी', 'Fennel reduces bloating, flaxseed adds bulk and lubrication', 'सौंफ सूजन कम करती है, अलसी भारीपन और चिकनाई जोड़ती है', 'Roast 1 tsp fennel + 1 tsp flaxseed. Grind. Take with warm water after dinner.', 'Drink plenty of water. Flaxseed absorbs water.']
  ];

  // OBESITY (8) - Additional remedies
  const obesityRemedies = [
    [8, 'herb', 'Triphala', 'त्रिफला', 'Detoxifies, improves metabolism, reduces fat accumulation. Safe for long-term.', 'विषहरण करता है, चयापचय सुधारता है, वसा संचय कम करता है।', 'Take 1 tsp triphala powder with warm water at bedtime. Or 2 tablets.', 'May cause loose stools initially. Reduce dose.'],
    [8, 'herb', 'Medohar Guggulu', 'मेदोहर गुग्गुलु', 'Classical formula specifically for obesity. Burns fat, reduces cholesterol.', 'मोटापे के लिए विशेष शास्त्रीय योग। वसा जलाता है, कोलेस्ट्रॉल कम करता है।', 'Take 2 tablets twice daily after meals with warm water', 'Avoid in pregnancy and thyroid disorders.'],
    [8, 'herb', 'Vidanga (Embelia ribes)', 'विडंग', 'Reduces fat tissue, improves digestion, has anti-parasitic properties', 'वसा ऊतक कम करता है, पाचन सुधारता है', 'Take 1-2g vidanga powder with honey before meals', 'Avoid in pregnancy. Use for 2-3 months.'],
    [8, 'herb', 'Punarnava', 'पुनर्नवा', 'Reduces water retention, supports kidney function, reduces swelling', 'जल प्रतिधारण कम करता है, गुर्दे की कार्यप्रणाली का समर्थन करता है', 'Take 1 tsp punarnava powder with warm water twice daily', 'Very safe. Also good for kidney health.'],
    [8, 'diet', 'Intermittent Fasting (Langhana)', 'लंघन (उपवास)', 'Ayurveda recommends periodic fasting to reset digestion and burn stored fat', 'आयुर्वेद पाचन रीसेट करने और संग्रहित वसा जलाने के लिए आवधिक उपवास की सिफारिश करता है', 'Skip dinner once a week. Or eat only between 8 AM - 6 PM daily (10-hour window).', 'Not for diabetics on medication, pregnant women, or underweight people.'],
    [8, 'home_remedy', 'Honey-Lemon-Warm Water', 'शहद-नींबू-गर्म पानी', 'Kickstarts metabolism, alkalizes body, aids fat burning', 'चयापचय शुरू करता है, शरीर को क्षारीय बनाता है, वसा जलाने में सहायक', 'Mix 1 tsp honey + 1/2 lemon juice in warm water. Drink first thing morning empty stomach.', 'Never add honey to boiling water (becomes toxic per Ayurveda). Use warm only.'],
    [8, 'home_remedy', 'Ajwain Water (Carom Seeds)', 'अजवाइन का पानी', 'Boosts metabolism, reduces bloating, aids digestion of fats', 'चयापचय बढ़ाता है, सूजन कम करता है, वसा के पाचन में सहायक', 'Soak 1 tsp ajwain in water overnight. Strain and drink morning. Or boil and drink warm.', 'Avoid in acidity. Use in moderation.']
  ];

  // DIABETES (12) - Additional remedies
  const diabetesRemedies = [
    [12, 'herb', 'Karela (Bitter Gourd)', 'करेला', 'Contains plant insulin (polypeptide-p) that mimics human insulin action', 'पौधे का इंसुलिन (पॉलीपेप्टाइड-पी) जो मानव इंसुलिन की नकल करता है', 'Drink 30ml fresh karela juice morning empty stomach. Or eat cooked karela 3-4 times/week.', 'Very bitter. Can mix with amla juice. Monitor sugar levels.'],
    [12, 'herb', 'Vijaysar (Pterocarpus marsupium)', 'विजयसार', 'Wood extract that regenerates beta cells of pancreas. Unique property.', 'लकड़ी का अर्क जो अग्न्याशय की बीटा कोशिकाओं को पुनर्जीवित करता है।', 'Use vijaysar wooden tumbler — fill with water at night, drink morning. Or take extract.', 'One of few herbs that may actually regenerate insulin-producing cells.'],
    [12, 'herb', 'Amla (Indian Gooseberry)', 'आंवला', 'Rich in chromium which helps regulate carbohydrate metabolism and insulin response', 'क्रोमियम से भरपूर जो कार्बोहाइड्रेट चयापचय और इंसुलिन प्रतिक्रिया को नियंत्रित करता है', 'Take 1 tsp amla powder with warm water morning. Or eat 1-2 fresh amla daily.', 'Avoid sweetened amla products (murabba) for diabetes.'],
    [12, 'herb', 'Neem', 'नीम', 'Reduces blood sugar by improving insulin receptor sensitivity', 'इंसुलिन रिसेप्टर संवेदनशीलता सुधारकर रक्त शर्करा कम करता है', 'Take 2-3 neem capsules daily. Or chew 4-5 tender neem leaves morning.', 'Very bitter. Capsules are easier. Avoid in pregnancy.'],
    [12, 'herb', 'Fenugreek (Methi)', 'मेथी', 'Soluble fiber slows carbohydrate absorption. Clinically proven to reduce fasting sugar.', 'घुलनशील फाइबर कार्बोहाइड्रेट अवशोषण धीमा करता है। उपवास शर्करा कम करने के लिए सिद्ध।', 'Soak 1 tbsp methi seeds overnight. Eat seeds and drink water morning empty stomach.', 'May cause gas initially. Start with 1 tsp and increase.'],
    [12, 'diet', 'Low Glycemic Ayurvedic Diet', 'कम ग्लाइसेमिक आयुर्वेदिक आहार', 'Specific foods that release sugar slowly and dont spike insulin', 'विशिष्ट खाद्य पदार्थ जो धीरे-धीरे शर्करा छोड़ते हैं और इंसुलिन नहीं बढ़ाते', 'Eat: barley, bitter gourd, fenugreek, turmeric, jamun, amla. Avoid: white rice, potato, sugar, maida, fruits with high sugar.', 'Never skip meals. Eat small frequent meals. Largest meal at lunch.'],
    [12, 'lifestyle', 'Post-Meal Walking', 'भोजन के बाद चलना', 'Walking 15 mins after each meal reduces post-meal sugar spike by 30-40%', 'प्रत्येक भोजन के बाद 15 मिनट चलने से भोजन के बाद शर्करा 30-40% कम होती है', 'Walk at moderate pace for 15-20 mins after breakfast, lunch, and dinner', 'Most effective and free intervention for diabetes. Do consistently.']
  ];

  // PCOS (13) - Additional remedies
  const pcosRemedies = [
    [13, 'herb', 'Kanchanar Guggulu', 'कांचनार गुग्गुलु', 'Reduces cysts and growths. Balances thyroid. Specific for PCOS cysts.', 'सिस्ट और वृद्धि कम करता है। थायरॉइड संतुलित करता है। PCOS सिस्ट के लिए विशिष्ट।', 'Take 2 tablets twice daily before meals with warm water', 'Use for 3-6 months. Consult practitioner for dosage.'],
    [13, 'herb', 'Gokshura (Tribulus)', 'गोक्षुरा', 'Regulates hormones, reduces androgen levels, supports ovarian function', 'हार्मोन नियंत्रित करता है, एंड्रोजन स्तर कम करता है, डिम्बग्रंथि कार्य का समर्थन करता है', 'Take 500mg gokshura extract or 3g powder twice daily', 'Safe for long-term use. Also supports urinary health.'],
    [13, 'herb', 'Lodhra', 'लोध्र', 'Regulates menstrual cycle, reduces heavy bleeding, balances estrogen', 'मासिक चक्र नियमित करता है, भारी रक्तस्राव कम करता है, एस्ट्रोजन संतुलित करता है', 'Take 1-2g lodhra bark powder with warm water twice daily', 'Specific for female reproductive health. Use for 3 months.'],
    [13, 'herb', 'Guduchi (Giloy)', 'गुडूची (गिलोय)', 'Boosts immunity, reduces inflammation in ovaries, improves insulin sensitivity', 'प्रतिरक्षा बढ़ाता है, अंडाशय में सूजन कम करता है, इंसुलिन संवेदनशीलता सुधारता है', 'Take 1 tsp guduchi powder or 20ml juice twice daily', 'Safe for long-term use. Helps with insulin resistance in PCOS.'],
    [13, 'diet', 'PCOS-Specific Diet', 'PCOS-विशिष्ट आहार', 'Anti-inflammatory, low glycemic, hormone-balancing foods', 'सूजन-रोधी, कम ग्लाइसेमिक, हार्मोन-संतुलन करने वाले खाद्य पदार्थ', 'Include: flaxseeds (1 tbsp daily), spearmint tea, cinnamon, turmeric, leafy greens. Avoid: dairy, sugar, refined carbs, soy.', 'Flaxseeds must be ground for absorption. Spearmint tea reduces androgens.'],
    [13, 'home_remedy', 'Spearmint Tea', 'पुदीना चाय', 'Clinically proven to reduce androgen levels (testosterone) in PCOS women', 'PCOS महिलाओं में एंड्रोजन स्तर (टेस्टोस्टेरोन) कम करने के लिए चिकित्सकीय रूप से सिद्ध', 'Drink 2 cups spearmint tea daily for at least 30 days', 'Use spearmint specifically (not peppermint). Consistent use needed.'],
    [13, 'home_remedy', 'Cinnamon Water', 'दालचीनी पानी', 'Improves insulin sensitivity which is root cause of many PCOS symptoms', 'इंसुलिन संवेदनशीलता सुधारता है जो कई PCOS लक्षणों का मूल कारण है', 'Soak 1 cinnamon stick in water overnight. Drink morning. Or add 1/2 tsp powder to warm water.', 'Use Ceylon cinnamon (not Cassia) for long-term use. Cassia has coumarin.']
  ];

  insertBatch(constipationRemedies);
  insertBatch(obesityRemedies);
  insertBatch(diabetesRemedies);
  insertBatch(pcosRemedies);

  // JOINT PAIN (9) - Additional remedies
  const jointPainRemedies = [
    [9, 'herb', 'Guggulu (Simhanada Guggulu)', 'गुग्गुलु (सिंहनाद गुग्गुलु)', 'Classical formula for rheumatoid arthritis and gout. Reduces Ama (toxins) in joints.', 'रूमेटोइड गठिया और गाउट के लिए शास्त्रीय योग। जोड़ों में आम (विषाक्त पदार्थ) कम करता है।', 'Take 2 tablets twice daily after meals with warm water. Use for 2-3 months.', 'May cause loose stools initially (detox effect). Avoid in pregnancy.'],
    [9, 'herb', 'Rasna Saptak Kashayam', 'रास्ना सप्तक कषायम', 'Classical decoction of 7 herbs for all types of joint pain and inflammation', 'सभी प्रकार के जोड़ों के दर्द और सूजन के लिए 7 जड़ी-बूटियों का शास्त्रीय काढ़ा', 'Take 15ml with equal warm water before meals twice daily', 'Bitter taste. Can add honey. Use for 4-6 weeks.'],
    [9, 'herb', 'Dashmool (Ten Roots)', 'दशमूल', 'Combination of 10 roots that pacifies Vata and reduces pain and inflammation', '10 जड़ों का संयोजन जो वात शांत करता है और दर्द व सूजन कम करता है', 'Take Dashmool Kashayam 15ml or Dashmool powder 3g with warm water twice daily', 'Very effective for Vata-type pain. Safe for long-term.'],
    [9, 'lifestyle', 'Janu Basti (Knee Oil Therapy)', 'जानु बस्ती', 'Warm medicated oil pooled on knee joint using dough ring. Professional therapy.', 'आटे की अंगूठी से घुटने पर गर्म औषधीय तेल। पेशेवर चिकित्सा।', 'Visit Ayurvedic clinic. 7-14 sessions. Deeply nourishes knee cartilage.', 'Professional therapy. Excellent for knee osteoarthritis.'],
    [9, 'home_remedy', 'Ajwain Poultice', 'अजवाइन पुल्टिस', 'Ajwain has thymol — a natural anti-inflammatory and pain reliever', 'अजवाइन में थाइमोल — प्राकृतिक सूजन-रोधी और दर्द निवारक', 'Roast ajwain in a cloth. Apply warm poultice on painful joint for 15-20 mins.', 'Test temperature before applying. Should be warm, not burning.'],
    [9, 'home_remedy', 'Epsom Salt Soak', 'एप्सम सॉल्ट सोक', 'Magnesium sulfate reduces inflammation and relaxes muscles around joints', 'मैग्नीशियम सल्फेट सूजन कम करता है और जोड़ों के आसपास की मांसपेशियों को आराम देता है', 'Add 2 cups epsom salt to warm bath water. Soak affected joints for 20 mins.', 'Avoid if you have open wounds or skin infections.']
  ];

  // SKIN PROBLEMS (10) - Additional remedies
  const skinRemedies = [
    [10, 'herb', 'Khadira (Acacia catechu)', 'खदिर', 'Most powerful blood purifier for chronic skin diseases. Used in Mahamanjisthadi.', 'पुरानी त्वचा रोगों के लिए सबसे शक्तिशाली रक्त शोधक।', 'Take Khadirarishta 15-20ml with equal water after meals. Or khadira powder 1-2g.', 'Use for 2-3 months for chronic skin issues. Very safe.'],
    [10, 'herb', 'Sariva (Indian Sarsaparilla)', 'सारिवा', 'Blood purifier and skin detoxifier. Cools pitta and clears acne.', 'रक्त शोधक और त्वचा विषहरक। पित्त शांत करता है और मुंहासे साफ करता है।', 'Take 3-5g sariva powder with warm water. Or drink sariva water (soaked overnight).', 'Very safe. Can be used long-term. Good for summer.'],
    [10, 'herb', 'Kumkumadi Tailam', 'कुमकुमादि तैलम', 'Luxurious Ayurvedic face oil with saffron. Removes blemishes, evens skin tone.', 'केसर युक्त शानदार आयुर्वेदिक फेस ऑयल। दाग हटाता है, त्वचा टोन समान करता है।', 'Apply 3-4 drops on clean face at night. Massage gently upward. Leave overnight.', 'Expensive but very effective. Buy from reputed brand. Do patch test.'],
    [10, 'herb', 'Haridra Khand', 'हरिद्रा खंड', 'Classical turmeric preparation for allergic skin conditions and urticaria', 'एलर्जी त्वचा स्थितियों और पित्ती के लिए शास्त्रीय हल्दी योग', 'Take 1-2 tsp with warm milk twice daily', 'Sweet taste. Safe for children too. Use for 1-2 months.'],
    [10, 'diet', 'Skin-Healing Diet', 'त्वचा-उपचार आहार', 'Blood-purifying foods that clear skin from inside out', 'रक्त-शोधक खाद्य पदार्थ जो अंदर से बाहर त्वचा साफ करते हैं', 'Daily: aloe vera juice (30ml morning), neem leaves (4-5), turmeric milk (night), bitter gourd, cucumber, watermelon.', 'Avoid: dairy, sugar, fried food, processed food, alcohol for 30 days minimum.'],
    [10, 'home_remedy', 'Multani Mitti + Rose Water', 'मुल्तानी मिट्टी + गुलाब जल', 'Absorbs excess oil, tightens pores, cools inflammation', 'अतिरिक्त तेल सोखता है, रोमछिद्र कसता है, सूजन शांत करता है', 'Mix multani mitti + rose water + pinch turmeric into paste. Apply on face. Leave until dry. Wash with cool water.', 'Use 2-3 times/week. Do not use on active acne with pus.'],
    [10, 'home_remedy', 'Neem-Turmeric Face Pack', 'नीम-हल्दी फेस पैक', 'Antibacterial + anti-inflammatory combination for acne-prone skin', 'मुंहासे-प्रवण त्वचा के लिए जीवाणुरोधी + सूजन-रोधी संयोजन', 'Mix neem powder + turmeric + honey into paste. Apply on face 15 mins. Wash with lukewarm water.', 'Turmeric may temporarily stain. Use at night. Honey prevents staining.']
  ];

  // COLD & COUGH (11) - Additional remedies
  const coldRemedies = [
    [11, 'herb', 'Talisadi Churna', 'तालीसादि चूर्ण', 'Classical formula for productive cough with phlegm. Expectorant and bronchodilator.', 'बलगम वाली खांसी के लिए शास्त्रीय योग। कफ निकालने वाला।', 'Take 1-2g with honey 3-4 times daily after meals', 'Very safe. Can be given to children (half dose). Effective within 2-3 days.'],
    [11, 'herb', 'Kantakari (Solanum)', 'कंटकारी', 'Specific for dry cough and asthma. Opens airways and reduces bronchospasm.', 'सूखी खांसी और अस्थमा के लिए विशिष्ट। वायुमार्ग खोलता है।', 'Take Kantakari Avaleha 1 tsp or decoction 15ml twice daily', 'Very effective for chronic cough. Use for 2-4 weeks.'],
    [11, 'herb', 'Vasaka (Adhatoda)', 'वासा (अडूसा)', 'Most important herb for respiratory system. Bronchodilator and expectorant.', 'श्वसन तंत्र के लिए सबसे महत्वपूर्ण जड़ी-बूटी। ब्रोंकोडायलेटर।', 'Take Vasavaleha 1 tsp or fresh vasaka leaf juice 10ml with honey twice daily', 'Avoid in pregnancy. May cause nausea in high doses.'],
    [11, 'herb', 'Pippali (Long Pepper)', 'पिप्पली', 'Rejuvenates lungs, reduces Kapha, improves respiratory immunity', 'फेफड़ों को पुनर्जीवित करता है, कफ कम करता है, श्वसन प्रतिरक्षा सुधारता है', 'Take 1-2 pippali with honey twice daily. Or Pippali Rasayana for chronic issues.', 'Avoid in high pitta/acidity. Start with 1 pippali and increase.'],
    [11, 'home_remedy', 'Steam Inhalation with Ajwain', 'अजवाइन भाप', 'Ajwain steam opens blocked sinuses and kills bacteria in respiratory tract', 'अजवाइन भाप बंद साइनस खोलती है और श्वसन पथ में बैक्टीरिया मारती है', 'Boil water with 1 tbsp ajwain. Cover head with towel. Inhale steam 5-10 mins. 2-3 times daily.', 'Keep safe distance from hot water. Close eyes during steam.'],
    [11, 'home_remedy', 'Turmeric Milk (Haldi Doodh)', 'हल्दी दूध', 'Anti-inflammatory, immunity boosting, soothes sore throat', 'सूजन-रोधी, प्रतिरक्षा बढ़ाने वाला, गले की खराश शांत करता है', 'Boil milk with 1 tsp turmeric + pinch black pepper + pinch ginger. Drink warm at night.', 'Black pepper is essential for turmeric absorption. Add honey after cooling slightly.'],
    [11, 'lifestyle', 'Throat Gargle Routine', 'गले की गरारे', 'Salt water gargle + turmeric kills bacteria and reduces throat inflammation', 'नमक पानी गरारे + हल्दी बैक्टीरिया मारती है और गले की सूजन कम करती है', 'Gargle with warm salt water (1 tsp salt + pinch turmeric in glass of warm water) 3-4 times daily', 'Do not swallow. Spit out after gargling. Very effective for sore throat.']
  ];

  // LOW ENERGY (14) - Additional remedies
  const energyRemedies = [
    [14, 'herb', 'Chyawanprash', 'च्यवनप्राश', 'Ancient rejuvenative jam with 40+ herbs. Boosts immunity, energy, and vitality.', '40+ जड़ी-बूटियों वाला प्राचीन रसायन। प्रतिरक्षा, ऊर्जा और जीवन शक्ति बढ़ाता है।', 'Take 1-2 tsp with warm milk morning and evening', 'Safe for all ages. Diabetics should use sugar-free version.'],
    [14, 'herb', 'Safed Musli', 'सफेद मूसली', 'Powerful energy tonic. Improves stamina, strength, and vitality.', 'शक्तिशाली ऊर्जा टॉनिक। सहनशक्ति, ताकत और जीवन शक्ति सुधारता है।', 'Take 1-2g safed musli powder with warm milk twice daily', 'Safe for long-term use. Results in 2-4 weeks.'],
    [14, 'herb', 'Shatavari', 'शतावरी', 'Nourishes all body tissues, reduces fatigue, especially good for women', 'सभी शरीर ऊतकों को पोषित करता है, थकान कम करता है, महिलाओं के लिए विशेष', 'Take 1 tsp shatavari powder with warm milk and ghee twice daily', 'May increase Kapha. Avoid if overweight.'],
    [14, 'diet', 'Energy-Dense Ayurvedic Foods', 'ऊर्जा-घन आयुर्वेदिक भोजन', 'Specific foods that build Ojas (vital energy) according to Ayurveda', 'विशिष्ट खाद्य पदार्थ जो आयुर्वेद के अनुसार ओजस (जीवन ऊर्जा) बनाते हैं', 'Daily: soaked almonds (5-7), dates (2-3), ghee (2 tsp), milk, honey, saffron, fresh fruits', 'Eat fresh, warm, cooked food. Avoid stale, processed, microwaved food.'],
    [14, 'lifestyle', 'Dinacharya (Daily Routine)', 'दिनचर्या', 'Following natural circadian rhythm is the #1 energy hack in Ayurveda', 'प्राकृतिक सर्कैडियन लय का पालन आयुर्वेद में #1 ऊर्जा हैक है', 'Wake 5:30-6 AM. Exercise morning. Largest meal at noon. Light dinner by 7 PM. Sleep by 10 PM.', 'Sleeping late and waking late is the biggest energy killer per Ayurveda.'],
    [14, 'home_remedy', 'Dates + Milk + Saffron', 'खजूर + दूध + केसर', 'Instant energy tonic. Dates are iron-rich, milk nourishes, saffron uplifts mood.', 'तत्काल ऊर्जा टॉनिक। खजूर आयरन-युक्त, दूध पोषक, केसर मूड उत्थान।', 'Boil 2-3 dates in milk with 2-3 saffron strands. Drink warm morning.', 'Very nourishing. Good for post-illness recovery too.']
  ];

  // EYE STRAIN (15) - Additional remedies
  const eyeRemedies = [
    [15, 'herb', 'Triphala Ghrita', 'त्रिफला घृत', 'Medicated ghee with triphala. Most powerful Ayurvedic eye tonic taken internally.', 'त्रिफला युक्त औषधीय घी। आंतरिक रूप से लिया जाने वाला सबसे शक्तिशाली नेत्र टॉनिक।', 'Take 1 tsp triphala ghrita with warm milk at bedtime', 'Use for 2-3 months. Very safe and nourishing for eyes.'],
    [15, 'herb', 'Amalaki (Amla)', 'आमलकी (आंवला)', 'Richest source of Vitamin C. Strengthens eye muscles and improves vision.', 'विटामिन C का सबसे समृद्ध स्रोत। आंख की मांसपेशियों को मजबूत करता है।', 'Eat 1-2 fresh amla daily. Or take 1 tsp amla powder with honey morning.', 'Very safe. Also improves overall health.'],
    [15, 'lifestyle', 'Netra Tarpana', 'नेत्र तर्पण', 'Medicated ghee pooled over eyes using dough ring. Professional Panchakarma therapy.', 'आटे की अंगूठी से आंखों पर औषधीय घी। पेशेवर पंचकर्म चिकित्सा।', 'Visit Ayurvedic clinic. 7 sessions recommended. Eyes bathed in warm medicated ghee.', 'Professional therapy only. Excellent for computer professionals.'],
    [15, 'home_remedy', 'Rose Water Eye Drops', 'गुलाब जल आई ड्रॉप्स', 'Natural coolant that soothes tired, dry, irritated eyes instantly', 'प्राकृतिक शीतलक जो तुरंत थकी, सूखी, चिड़चिड़ी आंखों को शांत करता है', 'Put 2-3 drops of pure rose water in each eye. Lie down 5 mins. Use 2-3 times daily.', 'Use only pure, preservative-free rose water. Not cosmetic grade.'],
    [15, 'home_remedy', 'Cucumber Slices', 'खीरे के टुकड़े', 'Cooling, hydrating, reduces puffiness and dark circles around eyes', 'ठंडा, हाइड्रेटिंग, आंखों के आसपास सूजन और काले घेरे कम करता है', 'Place chilled cucumber slices on closed eyes for 10-15 mins. Do twice daily.', 'Refrigerate cucumbers. Replace slices when they warm up.'],
    [15, 'diet', 'Eye-Nourishing Foods', 'नेत्र-पोषक भोजन', 'Foods rich in Vitamin A, lutein, zeaxanthin, omega-3 for eye health', 'विटामिन A, ल्यूटिन, ज़ेक्सैन्थिन, ओमेगा-3 से भरपूर खाद्य पदार्थ', 'Daily: carrots, spinach, sweet potato, eggs, almonds, walnuts, ghee, amla, papaya', 'Ghee is considered the best eye food in Ayurveda. Include 1-2 tsp daily.']
  ];

  insertBatch(jointPainRemedies);
  insertBatch(skinRemedies);
  insertBatch(coldRemedies);
  insertBatch(energyRemedies);
  insertBatch(eyeRemedies);

  // Additional herbs for the encyclopedia
  const insertHerb = db.prepare(`
    INSERT OR IGNORE INTO herbs (name, name_hi, sanskrit_name, botanical_name, family, category, description, properties, taste, potency, dosha_effect, parts_used, main_uses, how_to_use, dosage, side_effects, contraindications, available_forms, season)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const newHerbs = [
    ['Karela (Bitter Gourd)', 'करेला', 'Karavellaka', 'Momordica charantia', 'Cucurbitaceae', 'Metabolic',
      'Contains polypeptide-p (plant insulin) that mimics human insulin. One of the most effective natural remedies for diabetes. Also purifies blood and improves skin.',
      'Deepana (digestive), Krimighna (antiparasitic), Raktashodhaka (blood purifier), Pramehaghna (anti-diabetic)',
      'Bitter (Tikta)', 'Cold (Sheeta)', 'Balances Pitta and Kapha. May aggravate Vata.',
      'Fruit, Juice, Seeds', 'Diabetes, blood purification, skin diseases, obesity, liver disorders, parasites',
      'Fresh juice 30ml morning. Cooked vegetable 3-4 times/week. Powder capsules.',
      'Juice: 30ml morning empty stomach. Cooked: regular meals. Powder: 1-2g twice daily.',
      'Very bitter taste. May cause stomach upset in excess. Can lower blood sugar too much.',
      'Pregnancy (can cause contractions), G6PD deficiency, hypoglycemia, children under 5',
      'Fresh vegetable, Juice, Powder, Capsules, Dried chips', 'Summer (seasonal vegetable)'],

    ['Vijaysar', 'विजयसार', 'Vijayasara', 'Pterocarpus marsupium', 'Fabaceae', 'Metabolic',
      'Unique herb that can regenerate beta cells of pancreas — the only known natural substance with this property. Used traditionally as a wooden tumbler for diabetes.',
      'Pramehaghna (anti-diabetic), Raktastambhana (hemostatic), Varnya (complexion), Medohara (fat reducing)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Cold (Sheeta)', 'Balances Kapha and Pitta',
      'Heartwood, Bark, Gum', 'Diabetes (primary), obesity, skin diseases, bleeding disorders, diarrhea',
      'Vijaysar tumbler: fill with water at night, drink morning (water turns brown). Extract capsules.',
      'Tumbler water: 1 glass morning. Extract: 500mg-1g twice daily before meals.',
      'Very safe. Tumbler needs replacement every 2-3 months when water stops changing color.',
      'Very few contraindications. Avoid if blood sugar is already very low.',
      'Wooden tumbler, Powder, Capsules, Bark decoction', 'Year-round (tree)'],

    ['Gokshura (Tribulus)', 'गोक्षुरा', 'Gokshura', 'Tribulus terrestris', 'Zygophyllaceae', 'Urinary & Hormonal',
      'Excellent for urinary tract health, kidney stones, and hormonal balance. Used for both male and female reproductive health.',
      'Mutrala (diuretic), Vrishya (aphrodisiac), Brimhana (nourishing), Ashmarighna (stone-breaking)',
      'Sweet (Madhura)', 'Cold (Sheeta)', 'Balances all three doshas (Tridoshic)',
      'Fruit, Root', 'Kidney stones, UTI, PCOS, low libido, prostate health, muscle strength, hormonal balance',
      'Powder with warm water or milk. Capsules. Decoction for kidney stones.',
      'Powder: 3-6g daily. Capsule: 500mg twice daily. Decoction: 50ml twice daily.',
      'Very safe. May cause mild stomach upset in some. May increase urination.',
      'Pregnancy, hormone-sensitive cancers (theoretical)',
      'Powder, Capsules, Tablets, Decoction', 'Rainy season (grows wild)'],

    ['Punarnava', 'पुनर्नवा', 'Punarnava', 'Boerhavia diffusa', 'Nyctaginaceae', 'Kidney & Liver',
      'Name means "one that renews the body." Excellent diuretic that reduces swelling without depleting minerals. Protects liver and kidneys.',
      'Mutrala (diuretic), Shothaghna (anti-edema), Rasayana (rejuvenative), Yakritottejaka (liver stimulant)',
      'Bitter, Sweet, Astringent', 'Hot (Ushna)', 'Balances all three doshas',
      'Whole plant, Root', 'Edema, kidney disorders, liver disorders, obesity, anemia, joint pain, eye diseases',
      'Powder with warm water. Fresh juice. Punarnava Mandur for anemia.',
      'Powder: 3-5g twice daily. Juice: 10-20ml. Punarnava Mandur: 2 tablets twice daily.',
      'Very safe. May increase urination. Rarely causes stomach upset.',
      'Pregnancy (in high doses), severe dehydration',
      'Powder, Juice, Tablets (Punarnava Mandur), Capsules', 'Rainy season (grows abundantly)'],

    ['Haritaki (Harad)', 'हरीतकी (हरड़)', 'Haritaki', 'Terminalia chebula', 'Combretaceae', 'Digestive & Rejuvenative',
      'Called "King of Medicines" in Tibetan medicine and "Mother" in Ayurveda. One of the three fruits in Triphala. Balances all doshas and treats almost every disease.',
      'Anulomana (carminative), Rasayana (rejuvenative), Medhya (brain tonic), Chakshushya (eye tonic)',
      'All five tastes except Salty', 'Hot (Ushna)', 'Balances all three doshas (Tridoshic)',
      'Fruit', 'Constipation, digestive disorders, cough, skin diseases, eye problems, diabetes, obesity, piles',
      'Powder with warm water at bedtime for constipation. With honey for cough. With ghee for rejuvenation.',
      'Powder: 2-4g at bedtime. Chew 1 fruit after meals for digestion.',
      'Generally very safe. May cause loose stools in excess.',
      'Pregnancy, severe dehydration, extreme weakness, children under 3',
      'Whole fruit, Powder, Tablets, Part of Triphala', 'Winter (harvested)'],

    ['Guduchi (Giloy)', 'गुडूची (गिलोय)', 'Guduchi', 'Tinospora cordifolia', 'Menispermaceae', 'Immunity & Fever',
      'Called "Amrita" (nectar of immortality). The ultimate immunity herb that also detoxifies liver, reduces fever, and manages autoimmune conditions.',
      'Rasayana (rejuvenative), Jwaraghna (antipyretic), Medhya (brain tonic), Tridoshahara (balances all doshas)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Hot (Ushna)', 'Balances all three doshas',
      'Stem (mainly), Root, Leaves', 'Fever, immunity, dengue, diabetes, arthritis, liver disorders, allergies, gout, chronic fatigue',
      'Fresh stem juice. Giloy satva (starch). Tablets. Kadha with other herbs.',
      'Juice: 20-30ml twice daily. Satva: 500mg-1g with honey. Tablets: 2 twice daily.',
      'Generally safe. May lower blood sugar. May cause constipation in some.',
      'Autoimmune diseases (may overstimulate immunity), before surgery, pregnancy',
      'Fresh stem, Juice, Satva (starch), Tablets, Capsules, Kadha', 'Year-round (climber)'],

    ['Vacha (Calamus)', 'वचा', 'Vacha', 'Acorus calamus', 'Acoraceae', 'Brain & Speech',
      'Opens the channels of the mind. Used for speech disorders, memory loss, epilepsy, and mental clarity. One of the most important Medhya (brain) herbs.',
      'Medhya (brain tonic), Vak Shuddhi (speech purifier), Deepana (digestive), Krimighna (antiparasitic)',
      'Pungent, Bitter (Katu, Tikta)', 'Hot (Ushna)', 'Balances Kapha and Vata. May increase Pitta.',
      'Rhizome (root)', 'Memory loss, speech disorders, epilepsy, anxiety, digestive issues, sinusitis, obesity',
      'Powder with honey. Nasya (nasal drops). External paste on forehead.',
      'Powder: 250-500mg with honey twice daily. Nasya: 2 drops in each nostril.',
      'Use only purified Vacha. High doses can cause vomiting (used therapeutically in Panchakarma).',
      'Pregnancy, bleeding disorders, children (without supervision), high Pitta',
      'Powder, Nasya oil, Tablets, Part of many brain formulations', 'Year-round'],

    ['Lodhra', 'लोध्र', 'Lodhra', 'Symplocos racemosa', 'Symplocaceae', 'Womens Health',
      'Premier herb for female reproductive health. Regulates menstruation, reduces excessive bleeding, and supports uterine health.',
      'Grahi (absorbent), Stambhana (hemostatic), Varnya (complexion), Garbhashaya Balya (uterine tonic)',
      'Astringent (Kashaya)', 'Cold (Sheeta)', 'Balances Kapha and Pitta',
      'Bark', 'PCOS, heavy periods, leucorrhea, infertility, acne, diarrhea, bleeding disorders',
      'Powder with warm water or honey. Part of Pushyanuga Churna and other formulations.',
      'Powder: 1-3g twice daily with warm water. Decoction: 30-50ml.',
      'Very safe. May cause constipation in excess due to astringent nature.',
      'Pregnancy (may affect hormones), very dry constitution',
      'Powder, Bark pieces, Part of classical formulations', 'Year-round (tree bark)'],

    ['Kantakari (Solanum)', 'कंटकारी', 'Kantakari', 'Solanum surattense', 'Solanaceae', 'Respiratory',
      'One of the Dashmool herbs. Specific for respiratory system — opens airways, reduces cough, and clears phlegm. Used in asthma and chronic bronchitis.',
      'Kasa-Shwasahara (anti-cough, anti-asthma), Deepana (digestive), Krimighna (antiparasitic)',
      'Pungent, Bitter (Katu, Tikta)', 'Hot (Ushna)', 'Balances Kapha and Vata',
      'Whole plant, Fruit, Root', 'Cough, asthma, bronchitis, sinusitis, fever, worms, urinary stones',
      'Decoction of fruit/root. Kantakari Avaleha (jam). Smoke of dried plant for asthma.',
      'Decoction: 30-50ml twice daily. Avaleha: 1 tsp twice daily with honey.',
      'Safe in recommended doses. May cause throat irritation in excess.',
      'Pregnancy, gastric ulcers',
      'Powder, Decoction, Avaleha (medicated jam), Part of Dashmool', 'Rainy season (grows wild)'],

    ['Tagar (Indian Valerian)', 'तगर', 'Tagara', 'Valeriana wallichii', 'Caprifoliaceae', 'Nervine & Sleep',
      'Indian equivalent of Valerian. Powerful natural sedative without morning grogginess. Used for insomnia, anxiety, and nervous disorders.',
      'Nidrajanana (sleep-inducing), Vedanasthapana (analgesic), Hridya (cardiac tonic)',
      'Bitter, Pungent (Tikta, Katu)', 'Hot (Ushna)', 'Balances Vata and Kapha',
      'Root, Rhizome', 'Insomnia, anxiety, hysteria, epilepsy, nerve pain, palpitations, restlessness',
      'Powder with warm milk at bedtime. Capsules. Often combined with Jatamansi.',
      'Powder: 1-3g at bedtime. Capsule: 250-500mg. Start low.',
      'May cause vivid dreams. Excessive use can cause headache. Strong smell.',
      'Pregnancy, depression (may worsen), liver disease, children',
      'Powder, Capsules, Tablets, Oil, Part of sleep formulations', 'Grows in Himalayas']
  ];

  const insertHerbs = db.transaction((items) => {
    for (const item of items) { insertHerb.run(...item); }
  });
  insertHerbs(newHerbs);

  // Additional herb-symptom mappings
  const insertMap = db.prepare(`
    INSERT OR IGNORE INTO herb_symptom_map (herb_id, symptom_id, effectiveness, notes)
    VALUES (?, ?, ?, ?)
  `);

  // Get herb IDs dynamically
  const getHerbId = db.prepare('SELECT id FROM herbs WHERE name = ?');

  const mapHerb = (herbName, symptomId, effectiveness, notes) => {
    const herb = getHerbId.get(herbName);
    if (herb) insertMap.run(herb.id, symptomId, effectiveness, notes);
  };

  mapHerb('Karela (Bitter Gourd)', 12, 'high', 'Contains plant insulin');
  mapHerb('Karela (Bitter Gourd)', 10, 'medium', 'Blood purifier for skin');
  mapHerb('Vijaysar', 12, 'high', 'Regenerates pancreatic beta cells');
  mapHerb('Gokshura (Tribulus)', 13, 'high', 'Regulates hormones in PCOS');
  mapHerb('Punarnava', 8, 'medium', 'Reduces water retention');
  mapHerb('Punarnava', 9, 'medium', 'Reduces joint swelling');
  mapHerb('Haritaki (Harad)', 7, 'high', 'Best single herb for constipation');
  mapHerb('Haritaki (Harad)', 15, 'medium', 'Part of Triphala eye wash');
  mapHerb('Guduchi (Giloy)', 11, 'high', 'Powerful immunity and fever reducer');
  mapHerb('Guduchi (Giloy)', 12, 'medium', 'Helps regulate blood sugar');
  mapHerb('Vacha (Calamus)', 4, 'high', 'Opens mind channels, reduces anxiety');
  mapHerb('Lodhra', 13, 'high', 'Regulates menstrual cycle');
  mapHerb('Kantakari (Solanum)', 11, 'high', 'Specific for cough and asthma');
  mapHerb('Tagar (Indian Valerian)', 3, 'high', 'Natural sedative for insomnia');
  mapHerb('Tagar (Indian Valerian)', 4, 'medium', 'Calms anxiety and restlessness');

  const totalRemedies = acidityRemedies.length + backPainRemedies.length + insomniaRemedies.length +
    stressRemedies.length + hairFallRemedies.length + headacheRemedies.length + constipationRemedies.length +
    obesityRemedies.length + diabetesRemedies.length + pcosRemedies.length + jointPainRemedies.length +
    skinRemedies.length + coldRemedies.length + energyRemedies.length + eyeRemedies.length;

  console.log(`  Comprehensive: ${totalRemedies} additional remedies, ${newHerbs.length} new herbs added`);
}

module.exports = { seedComprehensiveData };
