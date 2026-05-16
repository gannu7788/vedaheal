const { createDatabase } = require('./sqlite-wrapper');
const path = require('path');
const { seedData } = require('./seed');
const { seedExtendedData } = require('./seed-extended');
const { seedHerbEncyclopedia } = require('./seed-herbs');
const { seedComprehensiveData } = require('./seed-comprehensive');
const { seedHerbImages } = require('./seed-images');
const { seedAssessmentQuestions } = require('./seed-questions');
const { seedExpandedHerbs } = require('./seed-herbs-expanded');
const { seedHerbsBatch2 } = require('./seed-herbs-batch2');
const { seedHerbsBatch3 } = require('./seed-herbs-batch3');
const { seedHerbsBulk } = require('./seed-herbs-bulk');
const { seedBulkHerbMappings } = require('./seed-herb-mappings-bulk');
const { seedMoreProblems } = require('./seed-more-problems');
const { seedMoreProblems2 } = require('./seed-more-problems2');

const DB_PATH = path.join(__dirname, '..', '..', 'vedaheal.db');
let db;

function getDb() {
  if (!db) {
    db = createDatabase(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initDatabase() {
  const database = getDb();

  // Create tables
  database.exec(`
    CREATE TABLE IF NOT EXISTS symptoms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      name_hi TEXT,
      category TEXT NOT NULL,
      description TEXT,
      dosha_association TEXT
    );

    CREATE TABLE IF NOT EXISTS remedies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symptom_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('herb', 'diet', 'lifestyle', 'home_remedy')),
      title TEXT NOT NULL,
      title_hi TEXT,
      description TEXT NOT NULL,
      description_hi TEXT,
      how_to_use TEXT,
      precautions TEXT,
      FOREIGN KEY (symptom_id) REFERENCES symptoms(id)
    );

    CREATE TABLE IF NOT EXISTS yoga_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symptom_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      name_hi TEXT,
      sanskrit_name TEXT,
      type TEXT NOT NULL CHECK(type IN ('asana', 'pranayama', 'mudra', 'meditation')),
      difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
      duration_minutes INTEGER,
      steps TEXT NOT NULL,
      benefits TEXT,
      precautions TEXT,
      image_url TEXT,
      FOREIGN KEY (symptom_id) REFERENCES symptoms(id)
    );

    CREATE TABLE IF NOT EXISTS daily_routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symptom_id INTEGER NOT NULL,
      time_of_day TEXT NOT NULL CHECK(time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
      activity TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER,
      FOREIGN KEY (symptom_id) REFERENCES symptoms(id)
    );

    CREATE TABLE IF NOT EXISTS dosha_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      question_hi TEXT,
      category TEXT NOT NULL,
      option_vata TEXT NOT NULL,
      option_pitta TEXT NOT NULL,
      option_kapha TEXT NOT NULL
    );
  `);

  // Seed data if tables are empty
  const count = database.prepare('SELECT COUNT(*) as count FROM symptoms').get();
  if (count.count === 0) {
    seedData(database);
    seedExtendedData(database);
    seedHerbEncyclopedia(database);
    seedComprehensiveData(database);
    seedHerbImages(database);
    seedAssessmentQuestions(database);
    seedExpandedHerbs(database);
    seedHerbsBatch2(database);
    seedHerbsBatch3(database);
    seedHerbsBulk(database);
    seedBulkHerbMappings(database);
    seedMoreProblems(database);
    seedMoreProblems2(database);
    console.log('✅ Database seeded with all data');
    database.save();
  }

  console.log('✅ Database initialized');
}

module.exports = { initDatabase, getDb };
