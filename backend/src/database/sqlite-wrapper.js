// Wrapper that provides better-sqlite3 compatible API using sql.js (pure JS)
// This works on ARM/Termux without native compilation

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let SQL;
let dbInstance;

class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
    this._init(dbPath);
  }

  _init(dbPath) {
    if (!SQL) throw new Error('SQL.js not initialized. Call initSqlite() first.');

    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      this.db = new SQL.Database(buffer);
    } else {
      this.db = new SQL.Database();
    }
  }

  _save() {
    const data = this.db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(this.dbPath, buffer);
  }

  pragma(str) {
    try { this.db.run(`PRAGMA ${str}`); } catch(e) {}
  }

  exec(sql) {
    this.db.run(sql);
  }

  save() {
    this._save();
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        try {
          self.db.run(sql, params);
          // Don't save on every run — save in transaction or explicitly
          const changes = self.db.getRowsModified();
          const lastId = self.db.exec("SELECT last_insert_rowid() as id");
          return {
            changes,
            lastInsertRowid: lastId[0]?.values[0]?.[0] || 0
          };
        } catch(e) {
          throw e;
        }
      },
      get(...params) {
        try {
          const stmt = self.db.prepare(sql);
          stmt.bind(params);
          if (stmt.step()) {
            const cols = stmt.getColumnNames();
            const vals = stmt.get();
            stmt.free();
            const row = {};
            cols.forEach((col, i) => { row[col] = vals[i]; });
            return row;
          }
          stmt.free();
          return undefined;
        } catch(e) {
          throw e;
        }
      },
      all(...params) {
        try {
          const results = [];
          const stmt = self.db.prepare(sql);
          stmt.bind(params);
          while (stmt.step()) {
            const cols = stmt.getColumnNames();
            const vals = stmt.get();
            const row = {};
            cols.forEach((col, i) => { row[col] = vals[i]; });
            results.push(row);
          }
          stmt.free();
          return results;
        } catch(e) {
          throw e;
        }
      }
    };
  }

  transaction(fn) {
    const self = this;
    return (...args) => {
      // Just run the function directly — sql.js auto-commits each statement
      fn(...args);
      self._save();
    };
  }

  close() {
    if (this.db) {
      this._save();
      this.db.close();
    }
  }
}

async function initSqlite() {
  SQL = await initSqlJs();
}

function createDatabase(dbPath) {
  return new Database(dbPath);
}

module.exports = { initSqlite, createDatabase };
