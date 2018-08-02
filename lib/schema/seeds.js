module.exports = {
  // Sample Test Data to populate our database
  // seed_donors : `
  //   INSERT INTO donors VALUES 
  //     (1,'1200120150000003','1',null,'Juan','Dela','Cruz','M','1989-01-31',
  //     '208 74th','08212','0821','082','08','Y',null,null,'2018-07-30','Y');
  //   `,
        
  seed_donors : `
    INSERT INTO donors VALUES 
      (1,'1200120150000003','1',null,'Juan','Dela','Cruz','M','1989-01-31',
      '208 74th','08212','0821','082','08','Y',null,null,'2018-07-30','Y'),

      (2,'1200120150000004','2',null,'Maria','Cabrera','Helena','F','1989-01-30',
      '208 74th',null,null,null,null,'Y',null,null,'2018-07-30','Y'),

      (3,null,'3',null,'William','D','Co','M','1989-01-30',
      '208 74th',null,null,null,null,'Y',null,null,'2018-07-30','Y'),

      (4,'1200120150000006','4',null,'William','Avilla','Co','M','1989-01-30',
      '208 74th',null,null,null,null,'Y',null,null,'2018-07-30','Y');
    `,
    
  seed_vdonors : `
    INSERT INTO vdonors VALUES 
      (1,'Juan Dela Cruz','1200120150000003'),
      (2,'Maria Cabrera Helena','1200120150000003'),
      (3,'William D Co',null),
      (4,'William Avilla Co','1200120150000003');
  `,
  
  seed_region : `
    INSERT INTO region VALUES 
      (1, '13', 'NCR'),
      (2, '08', 'Region 8');
  `,
  
  seed_province : `
    INSERT INTO province VALUES 
      (1, '13','131', 'Quezon'),
      (2, '13','132', 'Batangas'),
      (3, '08','081', 'Leyte'),
      (4, '08','082', 'Samar');
  `,
  seed_city : `
    INSERT INTO city VALUES 
      (1, '13', '131','1311', 'Quezon City'),
      (2, '13', '131','1312', 'Batangas City'),
      (3, '08', '082','0821', 'Tacloban'),
      (4, '08', '082','0822', 'Borongan');
  `,
  seed_barangay : `
    INSERT INTO barangay VALUES 
      (1, '13', '131', '1311','13111', 'Test 1'),
      (2, '13', '131', '1311','13112', 'Test 2'),
      (3, '08', '082','0822', '08211', 'Songco'),
      (4, '08', '082','0822', '08212', 'Balud');
  `
}