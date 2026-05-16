function seedExpandedHerbs(db) {
  const insertHerb = db.prepare(`
    INSERT OR IGNORE INTO herbs (name, name_hi, sanskrit_name, botanical_name, family, category, description, properties, taste, potency, dosha_effect, parts_used, main_uses, how_to_use, dosage, side_effects, contraindications, available_forms, season)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const herbs = [
    // ===== DIGESTIVE HERBS =====
    ['Ajwain (Carom Seeds)', 'अजवाइन', 'Yavani', 'Trachyspermum ammi', 'Apiaceae', 'Digestive',
      'One of the best digestive herbs in Ayurveda. Contains thymol which is a powerful antimicrobial. Referenced in Bhavaprakash Nighantu as supreme for Agni (digestive fire) and Vata disorders.',
      'Deepana (appetizer), Pachana (digestive), Shoolahara (pain reliever), Krimighna (antiparasitic), Vatahara (Vata pacifying)',
      'Pungent (Katu)', 'Hot (Ushna)', 'Balances Vata and Kapha. May increase Pitta in excess.',
      'Seeds, Oil', 'Indigestion, bloating, gas, colic, acidity, cold, cough, asthma, kidney stones, menstrual pain',
      'Chew 1/2 tsp seeds with warm water after meals. Ajwain water for babies. Poultice for joint pain.',
      'Seeds: 1-3g after meals. Water: soak 1 tsp overnight, drink morning. Oil: 1-2 drops externally.',
      'Very safe in culinary amounts. Excess may cause acidity or mouth ulcers.',
      'Pregnancy (in large medicinal doses), peptic ulcers, bleeding disorders',
      'Whole seeds, Powder, Ajwain water, Essential oil, Part of Hingvastak Churna', 'Year-round'],

    ['Jeera (Cumin)', 'जीरा', 'Jeeraka', 'Cuminum cyminum', 'Apiaceae', 'Digestive',
      'Called "Jeeraka" in Sanskrit meaning "that which helps digestion." Charaka Samhita lists it as one of the best Deepaniya (appetite-stimulating) herbs. Essential in every Indian kitchen as both spice and medicine.',
      'Deepana (appetizer), Pachana (digestive), Grahi (absorbent), Garbhashaya Shuddhi (uterine cleanser), Stanyajanana (galactagogue)',
      'Pungent (Katu)', 'Cold (Sheeta) — unique among pungent spices', 'Balances all three doshas (Tridoshic)',
      'Seeds', 'Indigestion, diarrhea, bloating, anemia, post-delivery recovery, lactation, skin glow, immunity',
      'Roasted cumin powder in buttermilk. Jeera water morning. Cumin-coriander-fennel tea (CCF tea).',
      'Seeds: 1-3g. Jeera water: 1 tsp soaked overnight. CCF tea: equal parts, 1 tsp boiled.',
      'Extremely safe. One of the safest spices. No known side effects in normal doses.',
      'Very few. Avoid excess if you have heavy menstrual bleeding.',
      'Whole seeds, Powder, Roasted powder, Jeera water, CCF tea blend', 'Year-round'],

    ['Saunf (Fennel)', 'सौंफ', 'Shatapushpa', 'Foeniculum vulgare', 'Apiaceae', 'Digestive',
      'Called "Shatapushpa" (hundred flowers) in Ayurveda. Mentioned in Charaka Samhita as best Shoolahara (pain reliever) for abdomen. Natural mouth freshener and digestive used after every meal in India.',
      'Deepana (appetizer), Anulomana (carminative), Mutrala (diuretic), Shoolahara (pain reliever), Chakshushya (eye tonic)',
      'Sweet, Pungent (Madhura, Katu)', 'Cold (Sheeta)', 'Balances all three doshas. Especially good for Pitta.',
      'Seeds, Root', 'Bloating, gas, acidity, colic in babies, eye health, bad breath, menstrual cramps, lactation',
      'Chew 1 tsp after meals. Fennel water for babies. Fennel tea for acidity. Eye wash with fennel water.',
      'Seeds: 1-3g after meals. Tea: 1 tsp crushed in hot water. Baby: 1/4 tsp boiled water.',
      'Very safe for all ages including infants. No significant side effects.',
      'Estrogen-sensitive conditions in very high doses (theoretical). Otherwise extremely safe.',
      'Whole seeds, Powder, Tea, Fennel water, Sugar-coated (mukhwas), Essential oil', 'Year-round'],

    ['Hing (Asafoetida)', 'हींग', 'Hingu', 'Ferula assa-foetida', 'Apiaceae', 'Digestive',
      'Called "Devil\'s Dung" in English but "Food of the Gods" in Ayurveda. Bhavaprakash describes it as the best Vatanulomana (gas expeller). Tiny pinch transforms digestion. Used as onion-garlic substitute in Jain/Sattvic cooking.',
      'Deepana (appetizer), Pachana (digestive), Vatanulomana (carminative), Krimighna (antiparasitic), Shoolahara (colic reliever)',
      'Pungent (Katu)', 'Hot (Ushna)', 'Strongly balances Vata and Kapha. Increases Pitta.',
      'Gum resin', 'Bloating, gas, colic, IBS, intestinal worms, asthma, whooping cough, menstrual pain, ear pain',
      'Pinch in cooking (always cook in ghee/oil first). Hing water for babies. Paste on navel for colic.',
      'Cooking: tiny pinch. Medicinal: 125-500mg with warm water. External: paste with water.',
      'Very safe in cooking amounts. Raw hing can cause nausea. Strong smell.',
      'Pregnancy (may cause uterine contractions), bleeding disorders, high Pitta, infants (only externally)',
      'Compounded powder (with starch), Raw resin, Tablets, Hing water', 'Year-round (imported resin)'],

    ['Kutaja (Holarrhena)', 'कुटज', 'Kutaja', 'Holarrhena antidysenterica', 'Apocynaceae', 'Digestive',
      'The name "antidysenterica" says it all. Charaka Samhita classifies it as the best herb for Atisara (diarrhea) and Pravahika (dysentery). Contains conessine alkaloid with proven anti-amoebic action.',
      'Grahi (absorbent), Deepana (digestive), Krimighna (antiparasitic), Atisarahara (anti-diarrheal)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Cold (Sheeta)', 'Balances Pitta and Kapha',
      'Bark, Seeds', 'Diarrhea, dysentery, IBS, amoebic infections, piles, skin diseases, fever',
      'Kutajarishta (fermented preparation). Kutaja Ghana Vati (tablets). Bark decoction.',
      'Kutajarishta: 15-20ml with water. Tablets: 2 twice daily. Decoction: 30-50ml.',
      'Safe in recommended doses. May cause constipation if overused.',
      'Pregnancy, severe constipation',
      'Kutajarishta (liquid), Ghana Vati (tablets), Bark powder, Decoction', 'Year-round (tree bark)']
  ];

  const insertBatch = db.transaction((items) => {
    for (const item of items) { insertHerb.run(...item); }
  });
  insertBatch(herbs);

  // ===== RESPIRATORY & IMMUNITY HERBS =====
  const respiratoryHerbs = [
    ['Pippali (Long Pepper)', 'पिप्पली', 'Pippali', 'Piper longum', 'Piperaceae', 'Respiratory',
      'One of the Trikatu (three pungents). Charaka Samhita calls it the best Rasayana for lungs. Unique property: it is hot but has sweet Vipaka (post-digestive effect), making it safe for long-term use unlike black pepper.',
      'Rasayana (rejuvenative), Deepana (digestive), Kasa-Shwasahara (anti-cough/asthma), Vrushya (aphrodisiac)',
      'Pungent (Katu)', 'Hot (Ushna) but Sweet post-digestive (Madhura Vipaka)', 'Balances Vata and Kapha. Unique — does not aggravate Pitta long-term.',
      'Fruit, Root', 'Chronic cough, asthma, bronchitis, low immunity, poor digestion, anemia, liver disorders, rejuvenation',
      'Vardhamana Pippali (graduated dosing). With honey for cough. Trikatu combination. Pippali Rasayana.',
      'Start with 1 pippali, increase by 1 daily up to 10, then decrease. Or 1-2g powder with honey.',
      'Safe in recommended doses. May cause burning sensation initially.',
      'Acute fever, high Pitta conditions, gastric ulcers, pregnancy',
      'Whole dried fruit, Powder, Trikatu blend, Pippali Rasayana, Sitopaladi Churna', 'Year-round'],

    ['Vasaka (Malabar Nut)', 'वासा (अडूसा)', 'Vasa', 'Adhatoda vasica', 'Acanthaceae', 'Respiratory',
      'The most important respiratory herb in Ayurveda. Sushruta Samhita describes it as supreme for Raktapitta (bleeding disorders) and Kasa (cough). Contains vasicine — the compound that inspired the drug bromhexine.',
      'Kasa-Shwasahara (anti-cough/asthma), Raktastambhana (hemostatic), Jwaraghna (antipyretic), Chedana (expectorant)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Cold (Sheeta)', 'Balances Pitta and Kapha',
      'Leaves, Flowers, Root', 'Cough (all types), asthma, bronchitis, tuberculosis, bleeding disorders, fever, jaundice',
      'Fresh leaf juice with honey. Vasavaleha (medicated jam). Decoction. Dried leaf powder.',
      'Juice: 10-20ml with honey. Vasavaleha: 1-2 tsp. Powder: 1-3g. Decoction: 30-50ml.',
      'May cause nausea in high doses. Bitter taste.',
      'Pregnancy (has uterine stimulant action), bleeding tendency with anticoagulants',
      'Fresh juice, Vasavaleha, Powder, Syrup, Decoction, Part of many cough formulations', 'Year-round (evergreen shrub)'],

    ['Yashtimadhu (Licorice)', 'यष्टिमधु', 'Yashtimadhu', 'Glycyrrhiza glabra', 'Fabaceae', 'Respiratory',
      'Means "sweet stick" in Sanskrit. Charaka lists it in multiple categories — Kanthya (throat), Varnya (complexion), Sandhaniya (healing). One of the most used herbs in classical formulations. Soothes every mucous membrane.',
      'Kanthya (throat soothing), Varnya (complexion), Chedana (expectorant), Vranashodhana (wound healing), Medhya (brain tonic)',
      'Sweet (Madhura)', 'Cold (Sheeta)', 'Balances Vata and Pitta. May increase Kapha in excess.',
      'Root', 'Sore throat, cough, voice problems, acidity, ulcers, skin lightening, adrenal fatigue, liver protection',
      'Chew root stick. Powder with honey for cough. Tea for throat. Paste for skin. Part of many formulations.',
      'Root: chew small piece. Powder: 1-3g with honey. Tea: 1-2 cups daily. Max 6 weeks continuous.',
      'Safe short-term. Long-term excess can raise blood pressure and lower potassium (hypokalemia).',
      'Hypertension, heart failure, kidney disease, pregnancy, hypokalemia, edema. Max 6 weeks continuous use.',
      'Root sticks, Powder, Tea, Capsules, Syrup, Part of Sitopaladi/Talisadi', 'Year-round'],

    ['Guduchi (Tinospora)', 'गुडूची', 'Guduchi', 'Tinospora cordifolia', 'Menispermaceae', 'Immunity',
      'Called "Amrita" (nectar of immortality) in Ashtanga Hridaya. Charaka classifies it in Vayasthapana (anti-aging), Jwaraghna (antipyretic), Triptighna (appetite), and Dahaprashamana (burning sensation). One of the most versatile herbs.',
      'Rasayana (rejuvenative), Jwaraghna (antipyretic), Medhya (brain tonic), Tridoshahara (balances all), Vayasthapana (anti-aging)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Hot (Ushna)', 'Balances all three doshas — truly Tridoshic',
      'Stem (mainly), Root, Starch (Satva)', 'Chronic fever, immunity, dengue, chikungunya, diabetes, gout, arthritis, liver disorders, allergies, cancer support',
      'Fresh stem juice. Guduchi Satva (starch). Amritarishta (fermented). Tablets. Kadha.',
      'Juice: 20-30ml. Satva: 500mg-1g with honey. Amritarishta: 15-20ml. Tablets: 2 twice daily.',
      'Generally safe. May lower blood sugar (monitor). May cause constipation. Rare: liver concerns with prolonged high doses.',
      'Autoimmune diseases (may overstimulate immunity), before surgery, pregnancy, scheduled for organ transplant',
      'Fresh stem, Juice, Satva, Amritarishta, Tablets, Capsules, Kadha', 'Year-round (climber, grows on neem tree ideally)']
  ];
  insertBatch(respiratoryHerbs);

  // ===== NERVINE & MENTAL HEALTH HERBS =====
  const nervineHerbs = [
    ['Shankhpushpi', 'शंखपुष्पी', 'Shankhpushpi', 'Convolvulus pluricaulis', 'Convolvulaceae', 'Brain Tonic',
      'One of the four Medhya Rasayanas described by Charaka. Named after its conch-shaped flowers. Enhances all aspects of cognition — memory, concentration, learning, and recall. Used for centuries by Vedic scholars.',
      'Medhya (brain tonic), Nidrajanana (sleep-inducing), Hridya (cardiac tonic), Ayushya (longevity), Manasrogahara (mental disorder)',
      'Astringent (Kashaya)', 'Cold (Sheeta)', 'Balances all three doshas, especially Pitta',
      'Whole plant', 'Memory loss, anxiety, insomnia, ADHD, epilepsy, mental fatigue, hypertension, thyroid disorders',
      'Fresh juice with milk. Syrup (Shankhpushpi syrup). Powder with ghee. Brahmi-Shankhpushpi combination.',
      'Juice: 10-20ml. Syrup: 2-4 tsp. Powder: 3-6g with milk/ghee. Children: half dose.',
      'Very safe. One of the safest brain herbs. No significant side effects reported.',
      'May interact with thyroid medication (consult doctor). Pregnancy (insufficient data).',
      'Syrup, Powder, Juice, Tablets, Combined with Brahmi', 'Rainy season (grows wild in fields)'],

    ['Mandukparni (Gotu Kola)', 'मंडूकपर्णी', 'Mandukparni', 'Centella asiatica', 'Apiaceae', 'Brain Tonic',
      'The second Medhya Rasayana of Charaka. Name means "frog-leaf" due to leaf shape. Used in both Ayurveda and Traditional Chinese Medicine. Enhances cerebral circulation and nerve regeneration.',
      'Medhya (brain tonic), Rasayana (rejuvenative), Vranashodhana (wound healing), Kushtaghna (anti-dermatosis)',
      'Bitter (Tikta)', 'Cold (Sheeta)', 'Balances all three doshas, especially Pitta and Kapha',
      'Whole plant, Leaves', 'Memory, anxiety, wound healing, varicose veins, skin diseases, epilepsy, venous insufficiency',
      'Fresh leaf juice. Powder with warm water. Capsules. External paste for wounds.',
      'Juice: 10-20ml. Powder: 1-3g. Capsule: 500mg twice daily. Fresh leaves: 4-5 daily.',
      'Generally safe. May cause headache, nausea, or dizziness in some initially.',
      'Pregnancy, liver disease, scheduled surgery (may affect healing), sedative medications',
      'Fresh leaves, Juice, Powder, Capsules, Oil (Brahmi oil often contains this)', 'Rainy season (grows near water)'],

    ['Jyotishmati (Celastrus)', 'ज्योतिष्मती', 'Jyotishmati', 'Celastrus paniculatus', 'Celastraceae', 'Brain Tonic',
      'Name means "luminous" — it illuminates the mind. Bhavaprakash describes it as supreme for Buddhi (intellect) and Smriti (memory). The oil is called "intellect oil." Used by students during Vedic times for memorization.',
      'Medhya (brain tonic), Deepana (digestive), Vatahara (Vata pacifying), Rasayana (rejuvenative)',
      'Pungent, Bitter (Katu, Tikta)', 'Hot (Ushna)', 'Balances Vata and Kapha',
      'Seeds, Oil', 'Memory loss, poor concentration, depression, paralysis, facial palsy, joint pain, abdominal disorders',
      'Seed oil: start with 1 drop, increase by 1 daily up to 15 drops, with milk. External: massage on scalp.',
      'Oil: 5-15 drops with milk (graduated dosing). Seeds: 1-2g. External: scalp massage.',
      'May cause nausea or loose stools initially. Start with very low dose.',
      'Pregnancy, diarrhea, high Pitta. Always use graduated dosing — never start with full dose.',
      'Seed oil (Malkangni oil), Seeds, Capsules', 'Seeds harvested in winter'],

    ['Tagar (Indian Valerian)', 'तगर', 'Tagara', 'Valeriana wallichii', 'Caprifoliaceae', 'Nervine',
      'Indian equivalent of European Valerian but considered more potent. Sharangdhara Samhita recommends it for Anidra (insomnia) and Unmada (psychosis). Acts on GABA receptors naturally.',
      'Nidrajanana (sleep-inducing), Vedanasthapana (analgesic), Hridya (cardiac tonic), Vatahara (Vata pacifying)',
      'Bitter, Pungent (Tikta, Katu)', 'Hot (Ushna)', 'Balances Vata and Kapha',
      'Rhizome, Root', 'Insomnia, anxiety, hysteria, epilepsy, nerve pain, palpitations, restlessness, migraine',
      'Powder with warm milk at bedtime. Often combined with Jatamansi. Capsules.',
      'Powder: 1-3g at bedtime. Capsule: 250-500mg. Start low and increase.',
      'May cause vivid dreams, morning drowsiness. Strong unpleasant smell. Start low.',
      'Pregnancy, depression (may worsen), liver disease, driving after taking, children without supervision',
      'Powder, Capsules, Tablets, Oil, Combined formulations', 'Grows in Himalayas (3000-5000m)'],

    ['Sarpagandha (Rauwolfia)', 'सर्पगंधा', 'Sarpagandha', 'Rauwolfia serpentina', 'Apocynaceae', 'Nervine',
      'One of the most powerful sedative herbs. Contains reserpine — the first modern antihypertensive drug was derived from this plant. Sushruta used it for snake bites and insanity. Now endangered due to overharvesting.',
      'Nidrajanana (powerful sedative), Raktachapaghna (antihypertensive), Unmadahara (anti-psychotic)',
      'Bitter (Tikta)', 'Cold (Sheeta)', 'Strongly reduces Vata and Pitta',
      'Root', 'Severe insomnia, hypertension, anxiety, psychosis, epilepsy, snake bite (traditional)',
      'ONLY under practitioner supervision. Usually as Sarpagandha Vati or standardized extract.',
      'Tablets: 50-200mg at bedtime. NEVER self-medicate. Requires monitoring.',
      'Can cause severe hypotension, depression, nasal congestion, drowsiness. Potent herb.',
      'Pregnancy, depression, peptic ulcer, Parkinson disease, before surgery. MUST have practitioner guidance.',
      'Sarpagandha Vati (tablets), Standardized extract, Root powder (restricted)', 'Endangered — cultivated only']
  ];
  insertBatch(nervineHerbs);

  // ===== MUSCULOSKELETAL & PAIN HERBS =====
  const painHerbs = [
    ['Guggulu (Indian Bdellium)', 'गुग्गुलु', 'Guggulu', 'Commiphora mukul', 'Burseraceae', 'Anti-inflammatory',
      'One of the most important herbs in Ayurveda for Medoroga (obesity) and Amavata (rheumatoid arthritis). Sushruta describes 5 types. Contains guggulsterones that lower cholesterol. Base of 50+ classical formulations.',
      'Medohara (fat reducing), Shothaghna (anti-inflammatory), Vedanasthapana (analgesic), Lekhana (scraping), Yogavahi (enhances other herbs)',
      'Bitter, Pungent, Astringent', 'Hot (Ushna)', 'Balances all three doshas due to Yogavahi property',
      'Gum resin', 'Arthritis, obesity, high cholesterol, thyroid, skin diseases, fistula, tumors, sciatica',
      'Always used in combination formulas: Yogaraja Guggulu (joints), Kaishore Guggulu (gout), Triphala Guggulu (obesity), Kanchanar Guggulu (thyroid/cysts).',
      'Tablets: 2-4 tablets twice daily after meals. Duration: 2-3 months typically.',
      'May cause skin rash, diarrhea, or headache initially (detox). Interacts with thyroid medication.',
      'Pregnancy, thyroid medication (adjust dose), bleeding disorders, liver disease, diarrhea',
      'Purified resin (Shuddha Guggulu), Various Guggulu formulations (tablets)', 'Year-round (tree resin)'],

    ['Rasna (Pluchea)', 'रास्ना', 'Rasna', 'Pluchea lanceolata', 'Asteraceae', 'Anti-inflammatory',
      'Charaka Samhita classifies it as the best Vatahara (Vata-pacifying) herb. Specifically indicated for Amavata (rheumatoid arthritis) and Gridhrasi (sciatica). Often combined with Dashmool.',
      'Vatahara (Vata pacifying), Shothahara (anti-inflammatory), Vedanasthapana (analgesic), Deepana (digestive)',
      'Bitter (Tikta)', 'Hot (Ushna)', 'Strongly balances Vata. Neutral on Pitta and Kapha.',
      'Leaves, Root', 'Rheumatoid arthritis, sciatica, lower back pain, gout, facial palsy, respiratory disorders',
      'Rasnadi Kashayam (decoction). Rasnadi Guggulu (tablets). Powder with warm water.',
      'Kashayam: 15ml with warm water. Tablets: 2 twice daily. Powder: 3-5g.',
      'Safe in recommended doses. May cause mild gastric irritation.',
      'Pregnancy, severe gastritis',
      'Rasnadi Kashayam, Rasnadi Guggulu, Powder, Part of Dashmool', 'Year-round'],

    ['Eranda (Castor)', 'एरंड', 'Eranda', 'Ricinus communis', 'Euphorbiaceae', 'Musculoskeletal',
      'Ashtanga Hridaya calls it "Vatari" — enemy of Vata. The root, oil, and leaves all have different uses. Castor oil is the base of Virechana (purgation therapy) in Panchakarma. Externally supreme for pain.',
      'Vatahara (Vata pacifying), Virechana (purgative), Shothahara (anti-inflammatory), Vedanasthapana (analgesic)',
      'Sweet, Pungent (Madhura, Katu)', 'Hot (Ushna)', 'Strongly balances Vata. May increase Pitta.',
      'Root, Oil, Leaves', 'Constipation, joint pain, sciatica, lower back pain, rheumatism, abdominal tumors, skin diseases',
      'Oil internally for constipation. Oil externally for pain (massage). Root decoction for arthritis. Leaf poultice.',
      'Oil internal: 1-2 tsp at bedtime with milk. External: warm oil massage. Root: 3-5g decoction.',
      'Internal oil causes strong purgation. External use very safe. Seeds are TOXIC — never consume.',
      'Pregnancy (strong purgative), intestinal obstruction, appendicitis. NEVER eat castor seeds (ricin poison).',
      'Castor oil (internal/external), Root powder, Leaf (external poultice)', 'Year-round'],

    ['Nirgundi (Five-leaved Chaste)', 'निर्गुंडी', 'Nirgundi', 'Vitex negundo', 'Lamiaceae', 'Anti-inflammatory',
      'Bhavaprakash calls it "Nirgundi" meaning "which protects the body from diseases." One of the best external pain-relieving herbs. The oil is used in almost every Ayurvedic pain management protocol.',
      'Shothahara (anti-inflammatory), Vedanasthapana (analgesic), Krimighna (antiparasitic), Vatahara (Vata pacifying)',
      'Pungent, Bitter (Katu, Tikta)', 'Hot (Ushna)', 'Balances Vata and Kapha',
      'Leaves, Root, Seeds, Oil', 'Joint pain, muscle pain, headache, sinusitis, worm infestation, skin diseases, hair problems',
      'Nirgundi oil for external massage. Leaf decoction for steam/fomentation. Leaf paste for swelling.',
      'Oil: massage on affected area. Decoction: 30-50ml. Steam: boil leaves, inhale. Paste: apply externally.',
      'Very safe externally. Internal use may cause mild nausea.',
      'Pregnancy, internal use in children without supervision',
      'Nirgundi oil, Fresh/dried leaves, Decoction, Nirgundi Ghana Vati (tablets)', 'Year-round (common shrub)'],

    ['Dashmool (Ten Roots)', 'दशमूल', 'Dashamula', 'Combination of 10 roots', 'Multiple', 'Musculoskeletal',
      'A classical combination of 10 roots — 5 large trees (Bilva, Agnimantha, Shyonaka, Patala, Gambhari) and 5 small plants (Shalaparni, Prishnaparni, Brihati, Kantakari, Gokshura). Charaka\'s supreme Vatahara formula.',
      'Vatahara (Vata pacifying), Shothahara (anti-inflammatory), Jwaraghna (antipyretic), Balya (strengthening)',
      'Bitter, Sweet, Astringent', 'Hot (Ushna)', 'Primarily balances Vata. Also helps Kapha.',
      'Roots of 10 plants', 'All Vata disorders, post-delivery care, body pain, fever, inflammation, respiratory issues, weakness',
      'Dashmool Kashayam (decoction). Dashmool Kwath (powder for decoction). Dhanwantaram Tailam (oil).',
      'Kashayam: 15-30ml with warm water. Kwath: 5g boiled in water. Oil: external massage.',
      'Very safe. Well-tolerated. Mild and balanced formula.',
      'Pregnancy (some components may stimulate uterus). Otherwise very safe.',
      'Kashayam, Kwath powder, Dashmool oil, Dhanwantaram Tailam, Part of many formulations', 'Year-round']
  ];
  insertBatch(painHerbs);

  // ===== SKIN & BEAUTY HERBS =====
  const skinHerbs = [
    ['Kumkumadi (Saffron Formula)', 'कुमकुमादि', 'Kumkumadi', 'Saffron-based oil blend', 'Multiple', 'Skin & Beauty',
      'The most luxurious Ayurvedic skin preparation. Contains saffron (Kumkuma) as the primary ingredient along with 20+ herbs in sesame oil base. Described in Ashtanga Hridaya for Varnya (complexion enhancement).',
      'Varnya (complexion enhancer), Vranashodhana (wound healing), Tvakprasadana (skin nourishing), Kanti (glow)',
      'Multiple tastes (complex formula)', 'Cold (Sheeta)', 'Balances Pitta (primary skin dosha)',
      'Oil preparation (external)', 'Dark spots, pigmentation, acne scars, uneven skin tone, wrinkles, dull skin, dark circles',
      'Apply 3-4 drops on clean face at night. Massage gently upward for 2 mins. Leave overnight. Wash morning.',
      'External: 3-4 drops nightly. Consistent use for 4-8 weeks for visible results.',
      'May cause breakouts initially (purging). Do patch test. Some people are sensitive to saffron.',
      'Open wounds, active acne with pus, known allergy to any ingredient. External use only.',
      'Kumkumadi Tailam (oil), Kumkumadi Lepam (paste)', 'Year-round (prepared formula)'],

    ['Manjistha (Indian Madder)', 'मंजिष्ठा', 'Manjistha', 'Rubia cordifolia', 'Rubiaceae', 'Blood Purifier',
      'Charaka Samhita classifies it as the best Varnya (complexion enhancer) and Raktashodhaka (blood purifier). The root gives a red dye — traditionally used to color fabrics. Clears skin from inside out by purifying blood.',
      'Varnya (complexion), Raktashodhaka (blood purifier), Shothaghna (anti-inflammatory), Vishaghna (anti-toxic)',
      'Bitter, Sweet, Astringent (Tikta, Madhura, Kashaya)', 'Hot (Ushna)', 'Balances Pitta and Kapha',
      'Root', 'Acne, pigmentation, eczema, psoriasis, blood impurities, lymphatic congestion, wound healing, uterine disorders',
      'Powder with warm water. Mahamanjisthadi Kashayam (classical decoction). External paste for skin.',
      'Powder: 1-3g twice daily. Kashayam: 15ml with water. External: paste with honey/rose water.',
      'Safe for long-term use. May turn urine/stool slightly reddish (normal). Rarely causes gastric upset.',
      'Pregnancy (may stimulate uterus), heavy menstrual bleeding',
      'Powder, Mahamanjisthadi Kashayam, Capsules, External paste, Part of blood-purifying formulas', 'Year-round'],

    ['Sariva (Indian Sarsaparilla)', 'सारिवा', 'Sariva', 'Hemidesmus indicus', 'Apocynaceae', 'Blood Purifier',
      'Called "Anantamool" (endless root) due to its spreading root system. Charaka classifies it in Dahaprashamana (cooling) and Varnya (complexion). One of the best summer herbs — cools the body and purifies blood.',
      'Raktashodhaka (blood purifier), Dahaprashamana (cooling), Varnya (complexion), Mutrala (diuretic), Trishnahara (thirst-quenching)',
      'Sweet, Bitter (Madhura, Tikta)', 'Cold (Sheeta)', 'Balances Pitta and Vata. Excellent for Pitta.',
      'Root', 'Skin diseases, burning sensation, UTI, gout, fever, thirst, blood impurities, syphilis (traditional)',
      'Root soaked in water overnight — drink morning. Sarivadyasava (fermented). Powder with sugar.',
      'Soaked water: 1 glass morning. Asava: 15-20ml. Powder: 3-5g with sugar/honey.',
      'Very safe. No significant side effects. One of the mildest blood purifiers.',
      'Very few contraindications. Safe even in pregnancy (traditionally used).',
      'Root pieces, Powder, Sarivadyasava, Syrup (Saribadyarishta)', 'Year-round (root harvested any time)'],

    ['Haridra (Turmeric)', 'हरिद्रा', 'Haridra', 'Curcuma longa', 'Zingiberaceae', 'Anti-inflammatory',
      'The golden goddess of Ayurveda. Mentioned in all major texts — Charaka, Sushruta, Vagbhata. Classified in Kusthaghna (skin diseases), Vishaghna (anti-toxic), Lekhaniya (scraping). Over 12,000 modern studies on curcumin.',
      'Krimighna (antimicrobial), Varnya (complexion), Shothahara (anti-inflammatory), Raktashodhaka (blood purifier), Pramehaghna (anti-diabetic)',
      'Bitter, Pungent (Tikta, Katu)', 'Hot (Ushna)', 'Balances all three doshas (Tridoshic)',
      'Rhizome', 'Inflammation, joint pain, skin diseases, wounds, diabetes, liver protection, cancer prevention, immunity, digestion',
      'Golden milk (with black pepper). Cooking spice. Curcumin capsules for therapeutic dose. Paste for skin/wounds.',
      'Cooking: 1/2-1 tsp daily. Golden milk: 1 tsp with pepper. Curcumin: 500-2000mg. Paste: external.',
      'Very safe in food amounts. High-dose curcumin may cause GI upset. Stains everything yellow.',
      'Gallstones, bile duct obstruction, before surgery (blood thinning), iron deficiency (reduces absorption)',
      'Fresh root, Powder, Curcumin extract capsules, Golden milk mix, Paste, Haridra Khand', 'Year-round (harvested winter)']
  ];
  insertBatch(skinHerbs);

  // ===== METABOLIC & HORMONAL HERBS =====
  const metabolicHerbs = [
    ['Meshashringi (Gymnema)', 'मेषश्रृंगी', 'Meshashringi', 'Gymnema sylvestre', 'Apocynaceae', 'Metabolic',
      'Name means "ram\'s horn" (leaf shape). Also called Gudmar — "sugar destroyer." When you chew the leaf, you cannot taste sweetness for 1-2 hours. Sushruta used it for Prameha (diabetes). Blocks sugar receptors on tongue AND intestine.',
      'Pramehaghna (anti-diabetic), Medohara (fat reducing), Deepana (digestive), Krimighna (antiparasitic)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Hot (Ushna)', 'Balances Kapha and Vata',
      'Leaves', 'Diabetes (Type 1 & 2), sugar cravings, obesity, metabolic syndrome, dental caries',
      'Leaf powder before meals. Capsules. Chew fresh leaf to kill sugar craving instantly.',
      'Powder: 2-4g before meals. Capsule: 400-600mg. Fresh leaf: chew 2-3 leaves.',
      'May lower blood sugar significantly — monitor if on diabetes medication. May reduce iron absorption.',
      'Hypoglycemia, pregnancy, lactation, children. Adjust diabetes medication with doctor.',
      'Powder, Capsules, Tablets, Fresh leaves, Part of anti-diabetic formulations', 'Year-round (climber)'],

    ['Vijaysar (Pterocarpus)', 'विजयसार', 'Vijayasara', 'Pterocarpus marsupium', 'Fabaceae', 'Metabolic',
      'The only known natural substance that may regenerate pancreatic beta cells. Traditionally used as a wooden tumbler — water stored overnight turns brown and is drunk morning for diabetes. Mentioned in Charaka for Prameha.',
      'Pramehaghna (anti-diabetic), Raktastambhana (hemostatic), Varnya (complexion), Medohara (fat reducing)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Cold (Sheeta)', 'Balances Kapha and Pitta',
      'Heartwood', 'Diabetes, obesity, skin diseases, bleeding disorders, diarrhea, inflammation',
      'Vijaysar tumbler: fill with water at night, drink brown water morning. Heartwood powder. Capsules.',
      'Tumbler: 1 glass morning. Powder: 1-3g twice daily. Capsule: 500mg-1g before meals.',
      'Very safe. Tumbler needs replacement every 2-3 months (when water stops coloring).',
      'Very few. Avoid if blood sugar is already very low. Monitor sugar levels.',
      'Wooden tumbler, Heartwood powder, Capsules, Bark decoction', 'Year-round (tree heartwood)'],

    ['Kanchanar (Bauhinia)', 'कांचनार', 'Kanchanara', 'Bauhinia variegata', 'Fabaceae', 'Hormonal',
      'Charaka classifies it as Gandamala-nashaka (destroyer of glandular swellings). The primary herb for thyroid disorders, PCOS cysts, fibroids, and any abnormal growth. Kanchanar Guggulu is the classical formula.',
      'Gandamalanashaka (anti-glandular), Granthihara (anti-tumor), Medohara (fat reducing), Krimighna (antiparasitic)',
      'Astringent (Kashaya)', 'Cold (Sheeta)', 'Balances Kapha (primary). Also helps Pitta.',
      'Bark, Flowers, Buds', 'Thyroid (hypo/hyper), PCOS cysts, fibroids, lipomas, goiter, lymph node swelling, obesity',
      'Kanchanar Guggulu tablets (classical formula). Bark decoction. Flower buds as vegetable.',
      'Kanchanar Guggulu: 2 tablets twice daily. Bark decoction: 30-50ml. Use for 3-6 months.',
      'Safe for long-term use. May cause mild constipation due to astringent nature.',
      'Pregnancy, severe constipation, before surgery',
      'Kanchanar Guggulu (tablets), Bark powder, Decoction, Flower buds (edible)', 'Flowers in spring, bark year-round'],

    ['Ashoka (Saraca)', 'अशोक', 'Ashoka', 'Saraca asoca', 'Fabaceae', 'Womens Health',
      'Name means "without sorrow" — it removes the sorrow of women. Charaka and Sushruta both describe it for Raktapradar (excessive bleeding) and Yoni Roga (uterine disorders). The bark is the medicinal part.',
      'Raktastambhana (hemostatic), Garbhashaya Balya (uterine tonic), Vedanasthapana (analgesic), Varnya (complexion)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Cold (Sheeta)', 'Balances Pitta and Kapha',
      'Bark', 'Heavy periods, painful periods, fibroids, endometriosis, leucorrhea, infertility support, skin glow',
      'Ashokarishta (fermented preparation — most popular). Bark decoction. Powder with milk.',
      'Ashokarishta: 15-20ml with equal water after meals. Decoction: 30-50ml. Powder: 1-3g.',
      'Safe for most women. May delay periods if taken in excess (due to hemostatic action).',
      'Pregnancy, trying to conceive (may affect implantation), very scanty periods',
      'Ashokarishta (liquid), Bark powder, Decoction, Part of Pushyanuga Churna', 'Bark harvested year-round'],

    ['Shatavari (Wild Asparagus)', 'शतावरी', 'Shatavari', 'Asparagus racemosus', 'Asparagaceae', 'Womens Health',
      'Means "she who possesses 100 husbands" — indicating vitality it gives women. Charaka classifies it as Balya (strengthening), Vayasthapana (anti-aging), and Stanyajanana (galactagogue). The premier female Rasayana.',
      'Rasayana (rejuvenative), Stanyajanana (galactagogue), Vrishya (fertility), Balya (strengthening), Shothahara (anti-inflammatory)',
      'Sweet, Bitter (Madhura, Tikta)', 'Cold (Sheeta)', 'Balances Pitta and Vata. May increase Kapha.',
      'Tuberous root', 'PCOS, menopause, infertility, lactation, acidity, ulcers, immunity, male vitality, general debility',
      'Powder with warm milk and ghee. Shatavari Kalpa (granules). Capsules. Shatavari Ghrita.',
      'Powder: 3-6g with milk twice daily. Kalpa: 1-2 tsp. Capsule: 500mg twice daily.',
      'Safe for long-term use. May cause weight gain in Kapha types. Bloating initially.',
      'Estrogen-sensitive conditions (breast/uterine cancer), kidney disease, asparagus allergy, congestion',
      'Powder, Capsules, Granules (Kalpa), Ghrita (medicated ghee), Liquid extract', 'Root harvested year-round']
  ];
  insertBatch(metabolicHerbs);

  // ===== REJUVENATIVE & LONGEVITY HERBS =====
  const rejuvenativeHerbs = [
    ['Amalaki (Amla)', 'आमलकी', 'Amalaki', 'Emblica officinalis', 'Phyllanthaceae', 'Rejuvenative',
      'Called "Dhatri" (nurse/mother) in Ayurveda because it nurtures like a mother. Contains 20x more Vitamin C than orange. Charaka classifies it in Vayasthapana (anti-aging) and Rasayana. One of Triphala\'s three fruits.',
      'Rasayana (rejuvenative), Chakshushya (eye tonic), Vrishya (aphrodisiac), Hridya (cardiac), Pramehaghna (anti-diabetic)',
      'All 5 tastes except Salty (Pancharasa minus Lavana)', 'Cold (Sheeta)', 'Balances all three doshas (Tridoshic) — rare property',
      'Fruit', 'Anti-aging, immunity, hair, skin, eyes, digestion, diabetes, heart health, anemia, liver protection',
      'Fresh fruit daily. Juice morning. Powder with honey. Chyawanprash. Amla candy. Hair oil.',
      'Fresh: 1-2 fruits. Juice: 20-30ml. Powder: 3-6g. Chyawanprash: 1-2 tsp.',
      'Extremely safe. One of the safest herbs in Ayurveda. May cause cold sensation in excess.',
      'Very few. Avoid sweetened products in diabetes. Reduce in active diarrhea.',
      'Fresh fruit, Juice, Powder, Chyawanprash, Candy, Oil, Capsules, Triphala', 'Winter (seasonal fruit, Oct-Feb)'],

    ['Guduchi Satva', 'गुडूची सत्व', 'Guduchi Satva', 'Tinospora cordifolia starch', 'Menispermaceae', 'Rejuvenative',
      'The purified starch extracted from Guduchi stem. Considered more potent and easier to digest than raw Guduchi. Ashtanga Hridaya recommends it specifically for Jwara (fever) and Daha (burning sensation). Premium Rasayana.',
      'Jwaraghna (antipyretic), Dahaprashamana (cooling), Rasayana (rejuvenative), Tridoshahara (balances all)',
      'Bitter (Tikta)', 'Cold (Sheeta) — cooler than raw Guduchi', 'Balances all three doshas',
      'Starch from stem', 'Chronic fever, burning sensation, gout, acidity, immunity, general debility, post-fever weakness',
      'With honey for fever. With sugar for burning. With ghee for rejuvenation.',
      '500mg - 1g twice daily with appropriate vehicle (honey/sugar/ghee).',
      'Very safe. Premium quality. No significant side effects.',
      'Autoimmune conditions, before surgery. Otherwise extremely safe.',
      'Pure white starch powder (premium product)', 'Extracted from fresh stems (rainy season best)'],

    ['Chyawanprash', 'च्यवनप्राश', 'Chyawanprasha', 'Polyherbal jam (40+ herbs)', 'Multiple', 'Rejuvenative',
      'The most famous Rasayana in Ayurveda. Legend says sage Chyawan became young again using this formula. Contains 40+ herbs with Amla as base, cooked in ghee and sesame oil. Described in Charaka Samhita Chikitsa Sthana.',
      'Rasayana (supreme rejuvenative), Balya (strengthening), Medhya (brain tonic), Vrishya (aphrodisiac), Ayushya (longevity)',
      'All tastes present (Pancharasa)', 'Neutral (balanced)', 'Balances all three doshas (Tridoshic)',
      'Polyherbal jam preparation', 'Immunity, anti-aging, respiratory health, energy, digestion, fertility, brain function, general wellness',
      'Take 1-2 tsp with warm milk morning and/or evening. Can be taken year-round.',
      'Adults: 1-2 tsp twice daily. Children: 1/2-1 tsp. Elderly: 1 tsp.',
      'Very safe for all ages. Diabetics should use sugar-free version. May cause mild acidity in some.',
      'Diabetes (use sugar-free), severe obesity (high calorie), diarrhea',
      'Traditional jam (Dabur, Baidyanath, Zandu), Sugar-free versions, Granules', 'Best started in winter, can take year-round'],

    ['Bala (Country Mallow)', 'बला', 'Bala', 'Sida cordifolia', 'Malvaceae', 'Rejuvenative',
      'Name means "strength." Charaka classifies it in Balya (strengthening), Brimhaniya (nourishing), and Prajasthapana (fertility). One of the best Vata-pacifying rejuvenatives. Used extensively in Panchakarma oils.',
      'Balya (strengthening), Brimhaniya (nourishing), Vrishya (aphrodisiac), Rasayana (rejuvenative), Vatahara (Vata pacifying)',
      'Sweet (Madhura)', 'Cold (Sheeta)', 'Balances Vata and Pitta. May increase Kapha.',
      'Root, Whole plant', 'Weakness, nerve disorders, paralysis, facial palsy, infertility, emaciation, heart weakness, urinary disorders',
      'Root powder with milk. Bala Tailam (oil) for massage. Bala Ashwagandhadi Tailam. Decoction.',
      'Powder: 3-5g with milk. Oil: external massage. Decoction: 30-50ml.',
      'Safe for long-term use. Very nourishing. May increase weight.',
      'Obesity, severe Kapha conditions, congestion. Contains ephedrine-like compounds (regulated in some countries).',
      'Root powder, Bala Tailam (oil), Capsules, Decoction, Part of many Panchakarma oils', 'Year-round'],

    ['Vidari (Indian Kudzu)', 'विदारी', 'Vidari', 'Pueraria tuberosa', 'Fabaceae', 'Rejuvenative',
      'Called "Vidari Kanda" — the tuber of vitality. Charaka classifies it in Balya, Brimhaniya, and Stanyajanana. One of the best herbs for building body mass, increasing milk production, and nourishing all tissues.',
      'Brimhaniya (nourishing), Balya (strengthening), Stanyajanana (galactagogue), Vrishya (aphrodisiac), Rasayana (rejuvenative)',
      'Sweet (Madhura)', 'Cold (Sheeta)', 'Balances Vata and Pitta. Increases Kapha.',
      'Tuber', 'Underweight, weakness, low milk production, infertility, dry cough, burning urination, general debility',
      'Tuber powder with milk and ghee. Vidaryadi Kashayam. Part of weight-gain formulations.',
      'Powder: 3-5g with warm milk and ghee. Kashayam: 15-30ml.',
      'Safe. Very nourishing. Will increase weight — that is its purpose.',
      'Obesity, diabetes, severe Kapha conditions, congestion',
      'Tuber powder, Vidaryadi Kashayam, Capsules, Part of nourishing formulations', 'Tuber harvested in winter']
  ];
  insertBatch(rejuvenativeHerbs);

  // ===== LIVER, KIDNEY & DETOX HERBS =====
  const detoxHerbs = [
    ['Bhumyamalaki (Phyllanthus)', 'भूम्यामलकी', 'Bhumyamalaki', 'Phyllanthus niruri', 'Phyllanthaceae', 'Liver & Kidney',
      'Called "stone breaker" worldwide. Looks like a small Amla plant growing on ground (hence Bhumy-Amalaki = ground amla). Modern research confirms it dissolves kidney and gallstones. Also a powerful hepatoprotective.',
      'Ashmari-bhedana (stone breaking), Yakrit-uttejaka (liver stimulant), Pramehaghna (anti-diabetic), Pittahara (Pitta pacifying)',
      'Bitter, Astringent, Sweet (Tikta, Kashaya, Madhura)', 'Cold (Sheeta)', 'Balances Pitta and Kapha',
      'Whole plant', 'Kidney stones, gallstones, hepatitis, jaundice, liver cirrhosis, diabetes, UTI, skin diseases',
      'Fresh plant juice. Powder with water. Decoction. Capsules.',
      'Juice: 10-20ml twice daily. Powder: 3-5g. Capsule: 500mg twice daily. Use for 2-3 months for stones.',
      'Very safe. No significant side effects. May lower blood sugar.',
      'Pregnancy (insufficient data), hypoglycemia, before surgery',
      'Fresh juice, Powder, Capsules, Tablets, Decoction', 'Rainy season (annual herb, grows wild)'],

    ['Kalmegh (Andrographis)', 'कालमेघ', 'Kalmegh', 'Andrographis paniculata', 'Acanthaceae', 'Liver & Immunity',
      'Called "King of Bitters" — extremely bitter herb. Known as "Indian Echinacea" for immunity. Bhavaprakash describes it for Jwara (fever) and Yakrit Roga (liver diseases). Gained fame during COVID for immunity.',
      'Jwaraghna (antipyretic), Yakrit-uttejaka (liver protective), Krimighna (antimicrobial), Raktashodhaka (blood purifier)',
      'Bitter (Tikta) — extremely bitter', 'Cold (Sheeta)', 'Balances Pitta and Kapha. May aggravate Vata.',
      'Whole plant, Leaves', 'Fever, liver disorders, infections, immunity, malaria, diabetes, skin diseases, worm infestation',
      'Powder with honey (masks bitterness). Kalmegh Ghana Vati (tablets). Decoction.',
      'Powder: 1-3g (very bitter). Tablets: 2 twice daily. Decoction: 15-30ml.',
      'Very bitter taste. May cause nausea, loss of appetite, or diarrhea in excess.',
      'Pregnancy (anti-fertility effect), trying to conceive, autoimmune diseases, bleeding disorders',
      'Tablets (Ghana Vati), Powder, Decoction, Capsules, Part of Liv-52 type formulations', 'Rainy season (annual)'],

    ['Punarnava (Spreading Hogweed)', 'पुनर्नवा', 'Punarnava', 'Boerhavia diffusa', 'Nyctaginaceae', 'Kidney & Liver',
      'Name means "one that renews/rejuvenates." Charaka classifies it in Shothaghna (anti-edema) and Kasahara (anti-cough). The best natural diuretic that removes water without depleting minerals — unlike pharmaceutical diuretics.',
      'Shothaghna (anti-edema), Mutrala (diuretic), Rasayana (rejuvenative), Yakrit-uttejaka (liver stimulant), Hridya (cardiac)',
      'Bitter, Sweet, Astringent (Tikta, Madhura, Kashaya)', 'Hot (Ushna)', 'Balances all three doshas',
      'Whole plant, Root', 'Edema, kidney disorders, nephrotic syndrome, liver cirrhosis, ascites, anemia, obesity, eye diseases',
      'Fresh juice. Punarnava Mandur (with iron — for anemia). Powder. Decoction.',
      'Juice: 10-20ml. Punarnava Mandur: 2 tablets twice daily. Powder: 3-5g. Decoction: 30-50ml.',
      'Very safe. May increase urination. Rarely causes stomach upset.',
      'Pregnancy (in high doses), severe dehydration, hypotension',
      'Punarnava Mandur (tablets), Powder, Juice, Decoction, Capsules', 'Rainy season (grows abundantly after rains)'],

    ['Kutki (Picrorhiza)', 'कुटकी', 'Katuka', 'Picrorhiza kurroa', 'Plantaginaceae', 'Liver',
      'The most powerful hepatoprotective herb in Ayurveda. Charaka classifies it in Jwaraghna (antipyretic) and Lekhaniya (scraping). Contains kutkin and picroside — proven liver-protective compounds. Grows only in Himalayas.',
      'Yakrit-uttejaka (liver stimulant), Jwaraghna (antipyretic), Krimighna (antiparasitic), Rechana (mild laxative)',
      'Bitter (Tikta) — intensely bitter', 'Cold (Sheeta)', 'Balances Pitta and Kapha. May aggravate Vata.',
      'Rhizome', 'Liver disorders, hepatitis, jaundice, fever, asthma, skin diseases, constipation, autoimmune conditions',
      'Powder with honey. Arogyavardhini Vati (classical formula with Kutki). Capsules.',
      'Powder: 500mg-1g (very bitter). Arogyavardhini: 2 tablets twice daily. Capsule: 250-500mg.',
      'May cause diarrhea or abdominal cramps in high doses. Very bitter.',
      'Pregnancy, severe diarrhea, intestinal obstruction. Endangered — use sustainably sourced.',
      'Arogyavardhini Vati (tablets), Powder, Capsules', 'Himalayan herb (3000-5000m) — endangered']
  ];
  insertBatch(detoxHerbs);

  // ===== CARDIAC & CIRCULATORY HERBS =====
  const cardiacHerbs = [
    ['Arjuna (Terminalia)', 'अर्जुन', 'Arjuna', 'Terminalia arjuna', 'Combretaceae', 'Cardiac',
      'The premier heart herb of Ayurveda. Vagbhata (Ashtanga Hridaya) describes it as Hridya (cardiac tonic). The bark strengthens heart muscle, reduces cholesterol, and regulates blood pressure. Named after the warrior Arjuna.',
      'Hridya (cardiac tonic), Raktastambhana (hemostatic), Shothaghna (anti-inflammatory), Medohara (fat reducing)',
      'Astringent (Kashaya)', 'Cold (Sheeta)', 'Balances Pitta and Kapha',
      'Bark', 'Heart weakness, angina, high cholesterol, high BP, cardiac arrhythmia, post-heart attack recovery',
      'Bark powder boiled in milk (Ksheer Pak). Arjunarishta (fermented). Capsules.',
      'Ksheer Pak: 3-5g bark boiled in milk, drink morning. Arjunarishta: 15-20ml. Capsule: 500mg twice daily.',
      'Very safe for long-term use. May lower BP — monitor if on BP medication.',
      'Low blood pressure, constipation (astringent), pregnancy. Adjust BP medication with doctor.',
      'Bark powder, Arjunarishta, Capsules, Tablets, Ksheer Pak', 'Bark harvested year-round'],

    ['Pushkarmool (Inula)', 'पुष्करमूल', 'Pushkaramoola', 'Inula racemosa', 'Asteraceae', 'Cardiac',
      'Charaka classifies it as Hridya (cardiac) and Shwasahara (anti-asthma). One of the few herbs that works on both heart and lungs simultaneously. Used in angina and asthma. Contains inulin.',
      'Hridya (cardiac tonic), Shwasahara (anti-asthma), Deepana (digestive), Vatahara (Vata pacifying)',
      'Bitter, Pungent (Tikta, Katu)', 'Hot (Ushna)', 'Balances Vata and Kapha',
      'Root', 'Angina, cardiac asthma, bronchial asthma, pleurisy, cough, hiccups, liver disorders',
      'Root powder with honey. Pushkaramooladi Churna. Decoction.',
      'Powder: 1-3g with honey. Decoction: 30-50ml. Often combined with Arjuna.',
      'Safe in recommended doses. May cause mild gastric warmth.',
      'Pregnancy, high Pitta, gastric ulcers',
      'Root powder, Decoction, Part of cardiac formulations', 'Himalayan herb — root harvested autumn']
  ];
  insertBatch(cardiacHerbs);

  // ===== CLASSICAL FORMULATIONS (as encyclopedia entries) =====
  const formulations = [
    ['Trikatu', 'त्रिकटु', 'Trikatu', 'Piper nigrum + Piper longum + Zingiber officinale', 'Multiple', 'Digestive',
      'The "Three Pungents" — Black Pepper (Maricha), Long Pepper (Pippali), and Dry Ginger (Shunthi). Charaka\'s supreme Deepaniya (appetite stimulant). Ignites Agni (digestive fire), burns Ama (toxins), and enhances bioavailability of other herbs.',
      'Deepana (appetizer), Pachana (digestive), Amahara (toxin destroyer), Kaphahara (Kapha reducing), Yogavahi (bioenhancer)',
      'Pungent (Katu)', 'Hot (Ushna)', 'Strongly balances Kapha. Increases Pitta. Balances Vata.',
      'Fruits and rhizome (equal parts)', 'Poor digestion, obesity, high cholesterol, cold, cough, asthma, hypothyroidism, enhancing other herbs',
      'Equal parts mixed. Take with honey before meals. Add to other herb formulas as bioenhancer.',
      '1-2g with honey before meals. Or 1/4 tsp with warm water. Start low if Pitta type.',
      'May cause burning, acidity, or sweating in Pitta types. Start with small dose.',
      'Hyperacidity, gastric ulcers, bleeding disorders, pregnancy, high Pitta, inflammatory conditions',
      'Pre-mixed powder, Tablets, Part of Sitopaladi/Talisadi/many formulations', 'Year-round'],

    ['Triphala', 'त्रिफला', 'Triphala', 'Emblica + Terminalia chebula + Terminalia bellirica', 'Multiple', 'Digestive & Rejuvenative',
      'The "Three Fruits" — Amalaki, Haritaki, Bibhitaki. The most versatile formula in Ayurveda. Charaka says "As a mother cares for her children, so Triphala cares for the internal organs." Balances all doshas, cleanses all tissues.',
      'Tridoshahara (balances all), Rasayana (rejuvenative), Chakshushya (eye tonic), Anulomana (mild laxative), Medohara (fat reducing)',
      'All 5 tastes present (Pancharasa)', 'Neutral', 'Balances all three doshas (Tridoshic) — the only formula that does this perfectly',
      'Fruits (equal parts or 1:2:4 ratio)', 'Constipation, digestion, eye health, obesity, detox, skin, immunity, diabetes, cholesterol',
      'Powder at bedtime with warm water (laxative). Morning with honey (rejuvenative). Eye wash. Gargle.',
      'Laxative: 3-6g at bedtime. Rejuvenative: 1-2g morning with honey. Eye wash: filtered water.',
      'May cause loose stools initially (reduce dose). Very safe long-term.',
      'Pregnancy, severe diarrhea, emaciation. Reduce dose if stools too loose.',
      'Powder, Tablets, Capsules, Liquid extract, Eye wash preparation, Triphala Guggulu', 'Year-round'],

    ['Chyawanprash', 'च्यवनप्राश', 'Chyawanprasha', 'Amla-based polyherbal jam (48 herbs)', 'Multiple', 'Rejuvenative',
      'The king of Rasayanas. Formula from Charaka Samhita — sage Chyawan used it to regain youth. Contains 48+ herbs with Amla as base, processed in ghee and sesame oil. Taken by millions daily in India for immunity and vitality.',
      'Rasayana (supreme rejuvenative), Balya (strengthening), Medhya (brain tonic), Vrishya (aphrodisiac), Ayushya (longevity)',
      'All tastes (Pancharasa)', 'Neutral (balanced by design)', 'Balances all three doshas (Tridoshic)',
      'Polyherbal jam', 'Immunity, anti-aging, respiratory health, energy, fertility, brain function, digestion, general wellness',
      '1-2 tsp with warm milk morning and/or evening. Year-round use. Best started in winter.',
      'Adults: 1-2 tsp twice daily. Children: 1/2-1 tsp. Elderly: 1 tsp. With warm milk.',
      'Very safe. Diabetics use sugar-free version. May cause mild acidity in some Pitta types.',
      'Diabetes (use sugar-free), severe obesity, active diarrhea',
      'Traditional jam (Dabur, Baidyanath, Zandu, Patanjali), Sugar-free versions', 'Take year-round, best started in winter']
  ];
  insertBatch(formulations);

  const totalHerbs = herbs.length + respiratoryHerbs.length + nervineHerbs.length + painHerbs.length +
    skinHerbs.length + metabolicHerbs.length + rejuvenativeHerbs.length + detoxHerbs.length +
    cardiacHerbs.length + formulations.length;

  console.log(`  Expanded Herbs: ${totalHerbs} new herbs/formulations added`);
}

module.exports = { seedExpandedHerbs };
