/**
 * Table Structures
 */

module.exports = {
  create_donors : `
    CREATE TABLE IF NOT EXISTS donors(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seqno TEXT, donor_id TEXT, photo TEXT,
      fname TEXT, mname TEXT, lname TEXT, gender TEXT, bdate TEXT, 
      nsb TEXT, barangay TEXT, city TEXT, province TEXT, region TEXT, 
      donation_stat TEXT,
      created_by TEXT, created_dt TEXT,
      sync TEXT, local TEXT
    );
    `,
  create_vdonors : `  
    CREATE VIRTUAL TABLE IF NOT EXISTS vdonors USING fts4(id INTEGER PRIMARY KEY, name TEXT, seqno TEXT)
    `,
  create_region : `
    CREATE TABLE IF NOT EXISTS region (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      regcode TEXT,
      regname TEXT
    )`,
  create_province : `
    CREATE TABLE IF NOT EXISTS province (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      regcode TEXT,
      provcode TEXT,
      provname TEXT
    )`,
  create_city : `
    CREATE TABLE IF NOT EXISTS city (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      regcode TEXT,
      provcode TEXT,
      citycode TEXT,
      cityname TEXT
    )`,
  create_barangay : `
    CREATE TABLE IF NOT EXISTS barangay (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      regcode TEXT,
      provcode TEXT,
      citycode TEXT,
      bgycode TEXT,
      bgyname TEXT
    )`,

  drop_donors: `DROP TABLE IF EXISTS donors;`,
  drop_vdonors: `DROP TABLE IF EXISTS vdonors;`,  
  drop_region: `DROP TABLE IF EXISTS region;`, 
  drop_province: `DROP TABLE IF EXISTS province;`, 
  drop_city: `DROP TABLE IF EXISTS city;`, 
  drop_barangay: `DROP TABLE IF EXISTS barangay;`, 
}