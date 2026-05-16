function seedHerbEncyclopedia(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS herbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      name_hi TEXT,
      sanskrit_name TEXT,
      botanical_name TEXT,
      family TEXT,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      properties TEXT,
      taste TEXT,
      potency TEXT,
      dosha_effect TEXT,
      parts_used TEXT,
      main_uses TEXT NOT NULL,
      how_to_use TEXT,
      dosage TEXT,
      side_effects TEXT,
      contraindications TEXT,
      available_forms TEXT,
      season TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS herb_symptom_map (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      herb_id INTEGER NOT NULL,
      symptom_id INTEGER NOT NULL,
      effectiveness TEXT CHECK(effectiveness IN ('high', 'medium', 'low')),
      notes TEXT,
      FOREIGN KEY (herb_id) REFERENCES herbs(id),
      FOREIGN KEY (symptom_id) REFERENCES symptoms(id)
    );
  `);

  const insertHerb = db.prepare(`
    INSERT OR IGNORE INTO herbs (name, name_hi, sanskrit_name, botanical_name, family, category, description, properties, taste, potency, dosha_effect, parts_used, main_uses, how_to_use, dosage, side_effects, contraindications, available_forms, season)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const herbs = [
    ['Ashwagandha', 'अश्वगंधा', 'Ashwagandha', 'Withania somnifera', 'Solanaceae', 'Adaptogen',
      'Known as Indian Ginseng, Ashwagandha is one of the most powerful herbs in Ayurveda. It rejuvenates the body, reduces stress, boosts immunity, and improves strength and vitality.',
      'Rasayana (rejuvenative), Balya (strength-giving), Vrishya (aphrodisiac), Medhya (brain tonic)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Hot (Ushna)', 'Balances Vata and Kapha. May increase Pitta in excess.',
      'Root (mainly), Leaves', 'Stress, anxiety, insomnia, low energy, muscle weakness, male infertility, joint pain, general debility',
      'Powder with warm milk at night. Capsules with water. KSM-66 extract for standardized dose.',
      'Powder: 3-6g/day. Capsule: 300-600mg twice daily. Extract: as directed.',
      'Generally safe. High doses may cause stomach upset, diarrhea, or drowsiness.',
      'Pregnancy, hyperthyroidism, autoimmune diseases (may stimulate immune system), before surgery',
      'Powder, Capsules, Tablets, Liquid extract, KSM-66 extract', 'Year-round'],

    ['Tulsi (Holy Basil)', 'तुलसी', 'Tulasi', 'Ocimum sanctum', 'Lamiaceae', 'Immunity',
      'Sacred plant in Indian households. Tulsi is a powerful adaptogen, immunity booster, and respiratory healer. It purifies air and is considered the "Queen of Herbs".',
      'Deepana (digestive), Krimighna (antimicrobial), Shwasahara (anti-asthmatic), Jwaraghna (antipyretic)',
      'Pungent, Bitter (Katu, Tikta)', 'Hot (Ushna)', 'Balances Kapha and Vata. May increase Pitta.',
      'Leaves, Seeds, Root', 'Cold, cough, fever, respiratory infections, stress, immunity, skin infections, oral health',
      'Fresh leaves chewed daily. Tea with leaves. Tulsi drops in water. Juice for respiratory issues.',
      'Fresh leaves: 5-10 daily. Tea: 2-3 cups. Drops: 10-15 in water twice daily.',
      'Very safe. May reduce fertility in high doses over long periods. May thin blood.',
      'Pregnancy (in medicinal doses), before surgery (blood thinning), trying to conceive',
      'Fresh leaves, Dried powder, Tea bags, Drops/Tincture, Capsules', 'Year-round (grows easily)'],

    ['Triphala', 'त्रिफला', 'Triphala', 'Combination of three fruits', 'Multiple', 'Digestive',
      'A combination of Amalaki (Amla), Bibhitaki, and Haritaki. The most versatile Ayurvedic formula — cleanses, nourishes, and rejuvenates the entire digestive system.',
      'Tridoshahara (balances all doshas), Rasayana (rejuvenative), Chakshushya (eye tonic), Anulomana (mild laxative)',
      'All five tastes present (Pancharasa)', 'Neutral', 'Balances all three doshas (Tridoshic)',
      'Fruits of Amla, Bibhitaki, Haritaki', 'Constipation, digestion, eye health, detox, weight management, skin health, immunity',
      'Powder with warm water at bedtime. Tablets after meals. Eye wash with filtered triphala water.',
      'Powder: 3-6g at bedtime with warm water. Tablets: 2 tablets at bedtime.',
      'May cause loose stools initially. Reduce dose if this happens.',
      'Pregnancy, severe diarrhea, children under 5 (use smaller dose)',
      'Powder, Tablets, Capsules, Liquid extract, Eye wash preparation', 'Year-round'],

    ['Brahmi', 'ब्राह्मी', 'Brahmi', 'Bacopa monnieri', 'Plantaginaceae', 'Brain Tonic',
      'The ultimate brain herb in Ayurveda. Brahmi enhances memory, concentration, and learning ability. It calms the mind while sharpening intellect.',
      'Medhya (brain tonic), Ayushya (longevity), Prajasthapana (fertility), Hridya (cardiac tonic)',
      'Bitter (Tikta)', 'Cold (Sheeta)', 'Balances all three doshas, especially Pitta and Vata',
      'Whole plant, Leaves', 'Memory loss, anxiety, insomnia, ADHD, epilepsy, hair growth, skin healing',
      'Powder with warm milk or ghee. Fresh juice. Brahmi oil for scalp massage. Capsules.',
      'Powder: 2-4g/day. Capsule: 300mg twice daily. Fresh juice: 10-20ml.',
      'Safe for long-term use. May cause nausea in some people on empty stomach.',
      'Pregnancy (high doses), thyroid medication (may interact)',
      'Powder, Capsules, Syrup, Oil (for hair), Fresh juice', 'Rainy season (grows near water)'],

    ['Turmeric (Haldi)', 'हल्दी', 'Haridra', 'Curcuma longa', 'Zingiberaceae', 'Anti-inflammatory',
      'The golden spice of India. Turmeric contains curcumin, one of the most studied natural anti-inflammatory compounds. Used in cooking and medicine for 4000+ years.',
      'Krimighna (antimicrobial), Varnya (complexion enhancer), Shothahara (anti-inflammatory), Raktashodhaka (blood purifier)',
      'Bitter, Pungent (Tikta, Katu)', 'Hot (Ushna)', 'Balances all three doshas',
      'Rhizome (root)', 'Inflammation, joint pain, skin problems, wounds, liver health, immunity, diabetes, cancer prevention',
      'Golden milk (with black pepper for absorption). Paste for skin. Raw turmeric juice. Capsules for therapeutic dose.',
      'Cooking: 1/2-1 tsp daily. Therapeutic: 500-2000mg curcumin with piperine. Golden milk: 1 tsp in milk.',
      'Generally very safe. High doses may cause stomach upset. Stains skin and clothes.',
      'Gallstones, bile duct obstruction, before surgery (blood thinning), iron deficiency (may reduce absorption)',
      'Fresh root, Powder, Capsules (curcumin extract), Golden milk mix, Paste', 'Year-round'],

    ['Neem', 'नीम', 'Nimba', 'Azadirachta indica', 'Meliaceae', 'Blood Purifier',
      'Called "Village Pharmacy" in India. Every part of the neem tree has medicinal value. It is the most powerful blood purifier and skin healer in Ayurveda.',
      'Krimighna (antiparasitic), Raktashodhaka (blood purifier), Kushthaghna (anti-dermatosis), Jwaraghna (antipyretic)',
      'Bitter (Tikta)', 'Cold (Sheeta)', 'Balances Pitta and Kapha. May aggravate Vata in excess.',
      'Leaves, Bark, Seeds, Oil, Flowers', 'Skin diseases, blood impurities, diabetes, dental problems, parasites, fever, malaria',
      'Neem leaf capsules internally. Neem paste externally for skin. Neem oil for hair. Neem water for wounds.',
      'Leaves: 2-4 capsules daily. Oil: external only. Juice: 10-20ml morning.',
      'Very bitter. May cause stomach upset. Neem oil should NEVER be consumed internally.',
      'Pregnancy (can cause miscarriage), trying to conceive (anti-fertility), infants, extreme Vata conditions',
      'Capsules, Oil (external), Powder, Juice, Soap, Toothpaste', 'Year-round (evergreen tree)'],

    ['Amla (Indian Gooseberry)', 'आंवला', 'Amalaki', 'Emblica officinalis', 'Phyllanthaceae', 'Rejuvenative',
      'The richest natural source of Vitamin C. Amla is a powerful antioxidant and rejuvenative that slows aging, boosts immunity, and nourishes all tissues.',
      'Rasayana (rejuvenative), Chakshushya (eye tonic), Vrishya (aphrodisiac), Hridya (cardiac tonic)',
      'All tastes except Salty (Pancharasa minus Lavana)', 'Cold (Sheeta)', 'Balances all three doshas (Tridoshic)',
      'Fruit', 'Immunity, hair health, skin glow, digestion, acidity, diabetes, eye health, anti-aging',
      'Fresh fruit daily. Amla juice morning. Amla powder with honey. Amla candy. Chyawanprash.',
      'Fresh: 1-2 fruits daily. Juice: 20-30ml morning. Powder: 3-6g daily.',
      'Very safe. May cause cold sensation in excess. Sour taste may aggravate acidity in some.',
      'Very few. Avoid excess in diarrhea. Diabetics should avoid sweetened amla products.',
      'Fresh fruit, Juice, Powder, Candy (Murabba), Chyawanprash, Capsules, Oil (for hair)', 'Winter (seasonal fruit)'],

    ['Giloy (Guduchi)', 'गिलोय', 'Guduchi', 'Tinospora cordifolia', 'Menispermaceae', 'Immunity',
      'Called "Amrita" (nectar of immortality) in Ayurveda. Giloy is the ultimate immunity booster that also detoxifies, reduces fever, and manages chronic diseases.',
      'Rasayana (rejuvenative), Jwaraghna (antipyretic), Medhya (brain tonic), Tridoshahara (balances all doshas)',
      'Bitter, Astringent (Tikta, Kashaya)', 'Hot (Ushna)', 'Balances all three doshas',
      'Stem (mainly), Root, Leaves', 'Fever, immunity, dengue, diabetes, arthritis, liver disorders, allergies, gout',
      'Fresh stem juice. Giloy satva (starch). Tablets. Kadha with other herbs.',
      'Juice: 20-30ml twice daily. Satva: 500mg-1g with honey. Tablets: as directed.',
      'Generally safe. May lower blood sugar (monitor if diabetic). May cause constipation in some.',
      'Autoimmune diseases (stimulates immunity), before surgery, pregnancy',
      'Fresh stem, Juice, Satva (starch), Tablets, Capsules, Kadha', 'Year-round (climber plant)'],

    ['Shatavari', 'शतावरी', 'Shatavari', 'Asparagus racemosus', 'Asparagaceae', 'Womens Health',
      'The premier female rejuvenative herb. Shatavari means "she who possesses 100 husbands" — indicating its power to nourish female reproductive health at all life stages.',
      'Rasayana (rejuvenative), Stanyakara (galactagogue), Vrishya (fertility), Balya (strength-giving)',
      'Sweet, Bitter (Madhura, Tikta)', 'Cold (Sheeta)', 'Balances Pitta and Vata. May increase Kapha in excess.',
      'Root (tuberous)', 'PCOS, menstrual irregularity, menopause, lactation, infertility, acidity, ulcers, immunity',
      'Powder with warm milk and ghee. Capsules. Shatavari kalpa (granules with sugar).',
      'Powder: 3-6g with milk twice daily. Capsules: 500mg twice daily.',
      'Safe for long-term use. May cause weight gain in Kapha types. May cause bloating initially.',
      'Estrogen-sensitive conditions (breast/uterine cancer), kidney disease, asparagus allergy',
      'Powder, Capsules, Granules (Kalpa), Liquid extract, Ghee preparation', 'Year-round'],

    ['Mulethi (Licorice)', 'मुलेठी', 'Yashtimadhu', 'Glycyrrhiza glabra', 'Fabaceae', 'Respiratory',
      'Sweet-tasting root that soothes inflammation throughout the body. Excellent for throat, stomach, and skin. One of the most used herbs in Ayurvedic formulations.',
      'Shothahara (anti-inflammatory), Varnya (complexion), Kanthya (throat soothing), Chedana (expectorant)',
      'Sweet (Madhura)', 'Cold (Sheeta)', 'Balances Vata and Pitta. May increase Kapha.',
      'Root', 'Sore throat, cough, acidity, ulcers, skin lightening, adrenal fatigue, voice problems',
      'Chew raw root stick. Powder with honey for cough. Tea for throat. Paste for skin.',
      'Root: chew small piece after meals. Powder: 1-3g daily. Tea: 1-2 cups.',
      'Safe in normal doses. Excess can raise blood pressure and lower potassium.',
      'High blood pressure, heart disease, kidney disease, pregnancy, low potassium',
      'Root sticks, Powder, Tea, Capsules, Skin creams', 'Year-round'],

    ['Shilajit', 'शिलाजीत', 'Shilajitu', 'Mineral pitch', 'Mineral', 'Energy & Vitality',
      'A mineral-rich substance found in Himalayan rocks. Formed over centuries from decomposed plants. Contains 85+ minerals and fulvic acid. Called "Destroyer of Weakness".',
      'Rasayana (rejuvenative), Yogavahi (enhances other herbs), Balya (strength), Medhya (brain tonic)',
      'Bitter, Salty, Astringent', 'Hot (Ushna)', 'Balances all doshas when purified',
      'Resin exudate from rocks', 'Low energy, aging, male health, anemia, altitude sickness, cognitive decline, bone health',
      'Dissolve pea-sized amount in warm milk or water. Take morning empty stomach.',
      'Purified resin: 300-500mg daily. Capsules: as directed.',
      'Safe when purified. Raw/unpurified shilajit can contain heavy metals and is dangerous.',
      'Gout (high uric acid), hemochromatosis (iron overload), pregnancy. ONLY use purified form.',
      'Purified resin, Capsules, Liquid extract', 'Collected in summer from high-altitude rocks'],

    ['Bhringraj', 'भृंगराज', 'Bhringaraja', 'Eclipta alba', 'Asteraceae', 'Hair Health',
      'Called "King of Hair" in Ayurveda. Bhringraj prevents hair fall, promotes growth, prevents premature graying, and nourishes the scalp deeply.',
      'Keshya (hair growth), Rasayana (rejuvenative), Yakritottejaka (liver stimulant), Netrya (eye tonic)',
      'Bitter, Pungent (Tikta, Katu)', 'Hot (Ushna)', 'Balances Vata and Kapha',
      'Whole plant, Leaves', 'Hair fall, premature graying, baldness, liver disorders, skin diseases, eye problems',
      'Oil for scalp massage (2-3 times/week). Powder internally. Fresh juice for liver.',
      'Oil: massage 1 hour before wash. Powder: 2-3g with water. Juice: 10-20ml.',
      'Very safe externally. Internal use may cause cold-like symptoms in some.',
      'Pregnancy (internal use), gallbladder issues',
      'Hair oil, Powder, Capsules, Fresh juice, Combined oils (with amla, brahmi)', 'Rainy season (grows wild)'],

    ['Jatamansi', 'जटामांसी', 'Jatamansi', 'Nardostachys jatamansi', 'Caprifoliaceae', 'Nervine',
      'A rare Himalayan herb that is one of the most powerful natural sedatives and brain tonics. Used for centuries for insomnia, anxiety, and mental disorders.',
      'Medhya (brain tonic), Nidrajanana (sleep-inducing), Hridya (cardiac tonic), Varnya (complexion)',
      'Bitter, Sweet, Astringent', 'Cold (Sheeta)', 'Balances all three doshas',
      'Rhizome (root)', 'Insomnia, anxiety, depression, epilepsy, memory loss, palpitations, skin glow',
      'Powder with honey at bedtime. Oil for scalp massage. Capsules.',
      'Powder: 250-500mg at bedtime. Oil: scalp massage before sleep.',
      'May cause excessive drowsiness. Start with low dose.',
      'Pregnancy, driving/operating machinery after taking, children (without supervision)',
      'Powder, Oil, Capsules, Tablets', 'Rare — grows in Himalayas above 3000m']
  ];

  const insertHerbs = db.transaction((items) => {
    for (const item of items) {
      insertHerb.run(...item);
    }
  });
  insertHerbs(herbs);

  // Map herbs to symptoms
  const insertMap = db.prepare(`
    INSERT INTO herb_symptom_map (herb_id, symptom_id, effectiveness, notes)
    VALUES (?, ?, ?, ?)
  `);

  const mappings = [
    // Ashwagandha (1)
    [1, 2, 'medium', 'Reduces inflammation in back muscles'],
    [1, 3, 'high', 'Reduces cortisol, promotes deep sleep'],
    [1, 4, 'high', 'Primary adaptogen for stress and anxiety'],
    [1, 9, 'medium', 'Anti-inflammatory for joint pain'],
    [1, 14, 'high', 'Boosts energy and stamina'],
    // Tulsi (2)
    [2, 4, 'medium', 'Adaptogenic stress relief'],
    [2, 11, 'high', 'Primary herb for cold and cough'],
    [2, 14, 'medium', 'Boosts immunity and energy'],
    // Triphala (3)
    [3, 1, 'medium', 'Balances digestion'],
    [3, 7, 'high', 'Best remedy for constipation'],
    [3, 8, 'medium', 'Aids weight management'],
    [3, 15, 'high', 'Triphala eye wash strengthens eyes'],
    // Brahmi (4)
    [4, 3, 'high', 'Calms nervous system for sleep'],
    [4, 4, 'high', 'Reduces anxiety, improves clarity'],
    [4, 5, 'medium', 'Brahmi oil nourishes hair roots'],
    [4, 6, 'medium', 'Cools pitta-related headaches'],
    // Turmeric (5)
    [5, 9, 'high', 'Powerful anti-inflammatory for joints'],
    [5, 10, 'high', 'Blood purifier, heals skin'],
    [5, 11, 'medium', 'Boosts immunity'],
    [5, 12, 'medium', 'Helps regulate blood sugar'],
    // Neem (6)
    [6, 10, 'high', 'Best blood purifier for skin'],
    [6, 12, 'medium', 'Helps lower blood sugar'],
    // Amla (7)
    [7, 1, 'high', 'Natural antacid'],
    [7, 5, 'high', 'Vitamin C strengthens hair'],
    [7, 12, 'medium', 'Helps manage blood sugar'],
    [7, 15, 'medium', 'Nourishes eyes'],
    // Giloy (8)
    [8, 11, 'high', 'Powerful immunity booster'],
    [8, 12, 'medium', 'Helps regulate blood sugar'],
    [8, 14, 'medium', 'Rejuvenates and energizes'],
    // Shatavari (9)
    [9, 1, 'medium', 'Soothes stomach lining'],
    [9, 13, 'high', 'Balances female hormones'],
    // Mulethi (10)
    [10, 1, 'high', 'Soothes acid reflux'],
    [10, 11, 'high', 'Relieves sore throat and cough'],
    // Shilajit (11)
    [11, 14, 'high', 'Powerful energy booster'],
    [11, 9, 'medium', 'Mineral support for bones and joints'],
    // Bhringraj (12)
    [12, 5, 'high', 'King of herbs for hair'],
    // Jatamansi (13)
    [13, 3, 'high', 'Powerful natural sedative'],
    [13, 4, 'high', 'Calms anxiety and restlessness']
  ];

  const insertMappings = db.transaction((items) => {
    for (const item of items) {
      insertMap.run(...item);
    }
  });
  insertMappings(mappings);

  console.log(`  Herb Encyclopedia: ${herbs.length} herbs, ${mappings.length} herb-symptom mappings`);
}

module.exports = { seedHerbEncyclopedia };
