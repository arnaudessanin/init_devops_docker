const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());

// Configuration de la base de données (à partir de variables d'environnement)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// Fonction pour afficher les traces des requêtes SQL avec timestamps
function logQuery(query, values) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - Requête SQL [port: ${PORT}]: ${query}`);
  if (values) {
    console.log(`${timestamp} - Valeurs :`, values);
  }
}

// Middleware pour enregistrer les requêtes HTTP avec timestamps
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - Requête HTTP [port: ${PORT}] ${req.method} sur ${req.path}`);
  next();
});

// Validation des données d'entrée
app.post(
  '/api/persons',
  [
    check('nom').isLength({ min: 1 }),
    check('prenom').isLength({ min: 1 }),
    check('age').isInt({ min: 1 }),
    check('profession').isLength({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nom, prenom, age, profession } = req.body;
      const connection = await mysql.createConnection(dbConfig);
      const query = 'INSERT INTO persons (nom, prenom, age, profession) VALUES (?, ?, ?, ?)';
      const values = [nom, prenom, age, profession];
      logQuery(query, values);
      const [results] = await connection.execute(query, values);
      connection.end();
      const timestamp = new Date().toISOString();
      console.log(`${timestamp} - Utilisateur créé avec succès`);
      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
    }
  }
);

// Route de recherche par nom ou prénom
app.get('/api/persons', async (req, res) => {
  try {
    const { nom, prenom } = req.query;
    const connection = await mysql.createConnection(dbConfig);
    let query = 'SELECT * FROM persons WHERE 1';

    if (nom) {
      query += ` AND nom LIKE "%${nom}%"`;
    }

    if (prenom) {
      query += ` AND prenom LIKE "%${prenom}%"`;
    }

    logQuery(query);
    const [results] = await connection.execute(query);
    connection.end();
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - Résultats de recherche :`, results.length);
    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    res.status(500).json({ error: 'Erreur lors de la recherche.' });
  }
});

// Mettre à jour un utilisateur
app.put(
  '/api/persons/:id',
  [
    check('nom').isLength({ min: 1 }),
    check('prenom').isLength({ min: 1 }),
    check('age').isInt({ min: 1 }),
    check('profession').isLength({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nom, prenom, age, profession } = req.body;
      const { id } = req.params;
      const connection = await mysql.createConnection(dbConfig);
      const query = 'UPDATE persons SET nom=?, prenom=?, age=?, profession=? WHERE id=?';
      const values = [nom, prenom, age, profession, id];
      logQuery(query, values);
      const [results] = await connection.execute(query, values);
      connection.end();
      const timestamp = new Date().toISOString();
      console.log(`${timestamp} - Utilisateur mis à jour avec succès`);
      res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    }
  }
);

// Supprimer un utilisateur
app.delete('/api/persons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const query = 'DELETE FROM persons WHERE id=?';
    const values = [id];
    logQuery(query, values);
    const [results] = await connection.execute(query, values);
    connection.end();
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - Utilisateur supprimé avec succès`);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur.' });
  }
});

// Démarrage du serveur Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
