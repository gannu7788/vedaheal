const path = require('path');

function seedHerbsBulk(db) {
  const herbsData = require(path.join(__dirname, 'amidha-herbs.json'));

  const insertHerb = db.prepare(`
    INSERT OR IGNORE INTO herbs (name, name_hi, sanskrit_name, botanical_name, family, category, description, properties, taste, potency, dosha_effect, parts_used, main_uses, how_to_use, dosage, side_effects, contraindications, available_forms, season)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Map rasa codes to readable names
  const rasaMap = {
    'Madhura': 'Sweet (Madhura)',
    'Amla': 'Sour (Amla)',
    'Lavana': 'Salty (Lavana)',
    'Katu': 'Pungent (Katu)',
    'Tikta': 'Bitter (Tikta)',
    'Kashaya': 'Astringent (Kashaya)'
  };

  // Map guna codes
  const gunaMap = {
    'Guru': 'Heavy',
    'Laghu': 'Light',
    'Snigdha': 'Oily/Unctuous',
    'Ruksha': 'Dry',
    'Ushna': 'Hot',
    'Sheeta': 'Cold',
    'Manda': 'Slow/Dull',
    'Tikshna': 'Sharp/Penetrating',
    'Sthira': 'Stable',
    'Sara': 'Mobile/Flowing',
    'Mridu': 'Soft',
    'Kathina': 'Hard',
    'Vishada': 'Clear',
    'Picchila': 'Slimy/Sticky',
    'Slakshna': 'Smooth',
    'Khara': 'Rough',
    'Sukshma': 'Subtle',
    'Sthula': 'Gross',
    'Sandra': 'Dense',
    'Drava': 'Liquid'
  };

  // Categorize based on prabhav (special properties)
  function getCategory(herb) {
    const prabhav = (herb.prabhav || []).map(p => p.toLowerCase());
    const name = herb.name.toLowerCase();

    if (prabhav.some(p => p.includes('medhya') || p.includes('smritikara'))) return 'Brain Tonic';
    if (prabhav.some(p => p.includes('rasayan') || p.includes('vayasthapana'))) return 'Rejuvenative';
    if (prabhav.some(p => p.includes('hridya'))) return 'Cardiac';
    if (prabhav.some(p => p.includes('kasahara') || p.includes('shwasahara'))) return 'Respiratory';
    if (prabhav.some(p => p.includes('deepana') || p.includes('pachana'))) return 'Digestive';
    if (prabhav.some(p => p.includes('vrishya') || p.includes('vajikarana'))) return 'Fertility';
    if (prabhav.some(p => p.includes('varnya'))) return 'Skin & Beauty';
    if (prabhav.some(p => p.includes('krimighna'))) return 'Antiparasitic';
    if (prabhav.some(p => p.includes('shothaghna') || p.includes('vedanasthapana'))) return 'Anti-inflammatory';
    if (prabhav.some(p => p.includes('mutrala'))) return 'Urinary';
    if (prabhav.some(p => p.includes('balya'))) return 'Strengthening';
    if (prabhav.some(p => p.includes('raktashodhaka'))) return 'Blood Purifier';
    if (prabhav.some(p => p.includes('jwaraghna'))) return 'Antipyretic';
    if (prabhav.some(p => p.includes('nidrajanana'))) return 'Nervine';
    if (prabhav.some(p => p.includes('stanyajanana'))) return 'Womens Health';
    if (prabhav.some(p => p.includes('pramehaghna'))) return 'Metabolic';

    // Fallback based on dosha
    if (herb.pacify?.includes('Pitta')) return 'Cooling';
    if (herb.pacify?.includes('Vata')) return 'Vata Pacifying';
    if (herb.pacify?.includes('Kapha')) return 'Kapha Reducing';

    return 'General';
  }

  function buildDoshaEffect(herb) {
    let effect = '';
    if (herb.tridosha) return 'Balances all three doshas (Tridoshic)';
    if (herb.pacify?.length) effect += `Pacifies ${herb.pacify.join(' and ')}. `;
    if (herb.aggravate?.length) effect += `May aggravate ${herb.aggravate.join(' and ')} in excess.`;
    return effect.trim() || 'Consult practitioner for dosha effect';
  }

  let inserted = 0;
  let skipped = 0;

  const insertMany = db.transaction(() => {
    for (const herb of herbsData) {
      // Skip if already exists (our manually curated ones are better)
      const existing = db.prepare('SELECT id FROM herbs WHERE name = ?').get(herb.name);
      if (existing) { skipped++; continue; }

      const taste = (herb.rasa || []).map(r => rasaMap[r] || r).join(', ');
      const properties = (herb.prabhav || []).join(', ');
      const gunas = (herb.guna || []).map(g => gunaMap[g] || g).join(', ');
      const category = getCategory(herb);
      const doshaEffect = buildDoshaEffect(herb);
      const virya = herb.virya === 'Ushna' ? 'Hot (Ushna)' : herb.virya === 'Sheeta' ? 'Cold (Sheeta)' : (herb.virya || 'Consult text');
      const vipaka = herb.vipaka || '';

      const description = herb.preview || `${herb.name} is an Ayurvedic herb with ${properties || 'various therapeutic'} properties.`;

      try {
        insertHerb.run(
          herb.name,                          // name
          null,                               // name_hi (not in source)
          null,                               // sanskrit_name
          null,                               // botanical_name
          null,                               // family
          category,                           // category
          description,                        // description
          `${properties}${gunas ? '. Guna: ' + gunas : ''}`, // properties
          taste || null,                      // taste
          `${virya}${vipaka ? '. Vipaka: ' + vipaka : ''}`, // potency
          doshaEffect,                        // dosha_effect
          null,                               // parts_used
          properties || 'Consult Ayurvedic practitioner', // main_uses
          'Consult a qualified Ayurvedic practitioner for proper usage and dosage.', // how_to_use
          'As directed by Ayurvedic practitioner.', // dosage
          'Consult practitioner. Individual responses may vary.', // side_effects
          herb.aggravate?.length ? `May not be suitable for ${herb.aggravate.join('/')} dominant constitution in excess.` : 'Consult practitioner.', // contraindications
          'Powder, Decoction, or as part of classical formulations', // available_forms
          'Year-round'                        // season
        );
        inserted++;
      } catch (e) {
        // Skip duplicates silently
        skipped++;
      }
    }
  });

  insertMany();
  console.log(`  Bulk Import: ${inserted} herbs imported from Amidha Ayurveda DB (${skipped} skipped/duplicates)`);
  console.log(`  Attribution: Amidha Ayurveda Herb Database (CC BY 4.0) — https://amidhaayurveda.com`);
}

module.exports = { seedHerbsBulk };
