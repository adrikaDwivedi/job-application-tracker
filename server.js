import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Database('applications.db');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    status TEXT NOT NULL,
    dateApplied TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Get all applications
app.get('/api/applications', (req, res) => {
  try {
    const applications = db.prepare('SELECT * FROM applications ORDER BY dateApplied DESC').all();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new application
app.post('/api/applications', (req, res) => {
  try {
    const { company, position, status, dateApplied } = req.body;
    const result = db.prepare(
      'INSERT INTO applications (company, position, status, dateApplied) VALUES (?, ?, ?, ?)'
    ).run(company, position, status, dateApplied);
    
    const newApp = db.prepare('SELECT * FROM applications WHERE id = ?').get(result.lastInsertRowid);
    res.json(newApp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status
app.put('/api/applications/:id', (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete application
app.delete('/api/applications/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});