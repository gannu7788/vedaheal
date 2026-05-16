function seedHerbImages(db) {
  const updateImage = db.prepare('UPDATE herbs SET image_url = ? WHERE name = ?');

  // Using ui-avatars.com - reliable, fast, customizable text-based images
  // Format: https://ui-avatars.com/api/?name=HERB&background=COLOR&color=fff&size=320&font-size=0.33
  const images = [
    ['Ashwagandha', 'https://ui-avatars.com/api/?name=🌿+Ashwagandha&background=166534&color=fff&size=320&font-size=0.28&bold=true'],
    ['Tulsi (Holy Basil)', 'https://ui-avatars.com/api/?name=🌱+Tulsi&background=15803d&color=fff&size=320&font-size=0.33&bold=true'],
    ['Triphala', 'https://ui-avatars.com/api/?name=🍃+Triphala&background=92400e&color=fff&size=320&font-size=0.33&bold=true'],
    ['Brahmi', 'https://ui-avatars.com/api/?name=🧠+Brahmi&background=1e40af&color=fff&size=320&font-size=0.33&bold=true'],
    ['Turmeric (Haldi)', 'https://ui-avatars.com/api/?name=✨+Haldi&background=b45309&color=fff&size=320&font-size=0.33&bold=true'],
    ['Neem', 'https://ui-avatars.com/api/?name=🌳+Neem&background=14532d&color=fff&size=320&font-size=0.33&bold=true'],
    ['Amla (Indian Gooseberry)', 'https://ui-avatars.com/api/?name=🫒+Amla&background=065f46&color=fff&size=320&font-size=0.33&bold=true'],
    ['Giloy (Guduchi)', 'https://ui-avatars.com/api/?name=🌿+Giloy&background=0d9488&color=fff&size=320&font-size=0.33&bold=true'],
    ['Shatavari', 'https://ui-avatars.com/api/?name=🌸+Shatavari&background=9d174d&color=fff&size=320&font-size=0.28&bold=true'],
    ['Mulethi (Licorice)', 'https://ui-avatars.com/api/?name=🪵+Mulethi&background=78350f&color=fff&size=320&font-size=0.33&bold=true'],
    ['Shilajit', 'https://ui-avatars.com/api/?name=�ite+Shilajit&background=1f2937&color=fff&size=320&font-size=0.33&bold=true'],
    ['Bhringraj', 'https://ui-avatars.com/api/?name=💇+Bhringraj&background=166534&color=fff&size=320&font-size=0.28&bold=true'],
    ['Jatamansi', 'https://ui-avatars.com/api/?name=😴+Jatamansi&background=4c1d95&color=fff&size=320&font-size=0.28&bold=true'],
    ['Karela (Bitter Gourd)', 'https://ui-avatars.com/api/?name=🥒+Karela&background=166534&color=fff&size=320&font-size=0.33&bold=true'],
    ['Vijaysar', 'https://ui-avatars.com/api/?name=🪵+Vijaysar&background=713f12&color=fff&size=320&font-size=0.33&bold=true'],
    ['Gokshura (Tribulus)', 'https://ui-avatars.com/api/?name=💪+Gokshura&background=1e3a8a&color=fff&size=320&font-size=0.28&bold=true'],
    ['Punarnava', 'https://ui-avatars.com/api/?name=💧+Punarnava&background=831843&color=fff&size=320&font-size=0.28&bold=true'],
    ['Haritaki (Harad)', 'https://ui-avatars.com/api/?name=👑+Haritaki&background=78350f&color=fff&size=320&font-size=0.28&bold=true'],
    ['Guduchi (Giloy)', 'https://ui-avatars.com/api/?name=🛡️+Guduchi&background=134e4a&color=fff&size=320&font-size=0.28&bold=true'],
    ['Vacha (Calamus)', 'https://ui-avatars.com/api/?name=🧠+Vacha&background=312e81&color=fff&size=320&font-size=0.33&bold=true'],
    ['Lodhra', 'https://ui-avatars.com/api/?name=🌺+Lodhra&background=701a75&color=fff&size=320&font-size=0.33&bold=true'],
    ['Kantakari (Solanum)', 'https://ui-avatars.com/api/?name=🫁+Kantakari&background=14532d&color=fff&size=320&font-size=0.28&bold=true'],
    ['Tagar (Indian Valerian)', 'https://ui-avatars.com/api/?name=😴+Tagar&background=3b0764&color=fff&size=320&font-size=0.33&bold=true']
  ];

  let updated = 0;
  for (const [name, url] of images) {
    const result = updateImage.run(url, name);
    if (result.changes > 0) updated++;
  }

  console.log(`  Images: ${updated} herb images added`);
}

module.exports = { seedHerbImages };
