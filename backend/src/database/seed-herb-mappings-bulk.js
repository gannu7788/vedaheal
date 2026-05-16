const path = require('path');

function seedBulkHerbMappings(db) {
  // Map herbs to symptoms based on their prabhav (therapeutic properties)
  // This creates herb_symptom_map entries for the bulk-imported herbs

  const insertMap = db.prepare(`
    INSERT OR IGNORE INTO herb_symptom_map (herb_id, symptom_id, effectiveness, notes)
    VALUES (?, ?, ?, ?)
  `);

  // Get all herbs
  const allHerbs = db.prepare('SELECT id, name, properties, description, category, dosha_effect FROM herbs').all();

  // Symptom IDs:
  // 1=Acidity, 2=Back Pain, 3=Insomnia, 4=Stress, 5=Hair Fall
  // 6=Headache, 7=Constipation, 8=Obesity, 9=Joint Pain, 10=Skin
  // 11=Cold/Cough, 12=Diabetes, 13=PCOS, 14=Low Energy, 15=Eye Strain

  // Keywords in properties/description that map to each symptom
  // STRICT matching — only truly relevant herbs should map
  const symptomKeywords = {
    1: { // Acidity
      high: ['amlapitta', 'antacid', 'dahaprashamana', 'pittashamaka'],
      medium: [],
      properties: ['Dahaprashamana', 'Amlapittahara']
    },
    2: { // Back Pain
      high: ['katishoola', 'gridhrasi', 'sciatica'],
      medium: ['vedanasthapana', 'asthidhatu'],
      properties: ['Vedanasthapana']
    },
    3: { // Insomnia
      high: ['nidrajanana', 'anidra'],
      medium: [],
      properties: ['Nidrajanana']
    },
    4: { // Stress & Anxiety
      high: ['medhya', 'manasroga', 'unmada'],
      medium: [],
      properties: ['Medhya', 'Manasrogahara']
    },
    5: { // Hair Fall
      high: ['keshya', 'kesha', 'romakara', 'khalitya'],
      medium: [],
      properties: ['Keshya']
    },
    6: { // Headache & Migraine
      high: ['shirashool', 'shiroroga', 'ardhavabhedaka'],
      medium: [],
      properties: ['Shirashoolahara']
    },
    7: { // Constipation
      high: ['virechana', 'bhedana', 'anulomana', 'malavardhaka'],
      medium: ['vatanulomana'],
      properties: ['Virechana', 'Bhedana', 'Anulomana']
    },
    8: { // Obesity
      high: ['medohara', 'lekhana', 'sthaulya'],
      medium: [],
      properties: ['Medohara', 'Lekhana']
    },
    9: { // Joint Pain
      high: ['amavata', 'sandhivata', 'sandhishoola'],
      medium: ['vedanasthapana', 'shothaghna'],
      properties: ['Shothaghna']
    },
    10: { // Skin Problems
      high: ['kushtaghna', 'twakroga', 'visarpa', 'dadru'],
      medium: ['varnya', 'raktashodhaka'],
      properties: ['Kushtaghna', 'Varnya']
    },
    11: { // Cold & Cough
      high: ['kasahara', 'shwasahara', 'pratishyaya'],
      medium: ['chedana', 'kaphahara'],
      properties: ['Kasahara', 'Shwasahara', 'Chedana']
    },
    12: { // Diabetes
      high: ['pramehaghna', 'madhumeha'],
      medium: [],
      properties: ['Pramehaghna']
    },
    13: { // PCOS
      high: ['garbhashaya', 'artavakara', 'artavajanana'],
      medium: ['stanyajanana'],
      properties: ['Artavakara', 'Garbhashaya']
    },
    14: { // Low Energy
      high: ['balya', 'brimhaniya', 'ojaskara'],
      medium: ['rasayan'],
      properties: ['Balya', 'Brimhaniya', 'Ojaskara']
    },
    15: { // Eye Strain
      high: ['chakshushya', 'netrya', 'drishtivardhaka'],
      medium: [],
      properties: ['Chakshushya', 'Netrya']
    }
  };

  let totalMappings = 0;

  const insertBatch = db.transaction(() => {
    for (const herb of allHerbs) {
      const herbText = `${herb.properties || ''} ${herb.description || ''} ${herb.category || ''}`.toLowerCase();

      for (const [symptomId, keywords] of Object.entries(symptomKeywords)) {
        let matched = false;
        let effectiveness = 'medium';

        // Check high-effectiveness keywords
        for (const kw of keywords.high) {
          if (herbText.includes(kw.toLowerCase())) {
            matched = true;
            effectiveness = 'high';
            break;
          }
        }

        // Check properties (from prabhav)
        if (!matched && keywords.properties) {
          for (const prop of keywords.properties) {
            if (herbText.includes(prop.toLowerCase())) {
              matched = true;
              effectiveness = 'high';
              break;
            }
          }
        }

        // Check medium-effectiveness keywords
        if (!matched) {
          for (const kw of keywords.medium) {
            if (herbText.includes(kw.toLowerCase())) {
              matched = true;
              effectiveness = 'medium';
              break;
            }
          }
        }

        if (matched) {
          // Check if mapping already exists
          const existing = db.prepare(
            'SELECT id FROM herb_symptom_map WHERE herb_id = ? AND symptom_id = ?'
          ).get(herb.id, parseInt(symptomId));

          if (!existing) {
            insertMap.run(herb.id, parseInt(symptomId), effectiveness, null);
            totalMappings++;
          }
        }
      }
    }
  });

  insertBatch();
  console.log(`  Bulk Mappings: ${totalMappings} herb-symptom connections created`);
}

module.exports = { seedBulkHerbMappings };
