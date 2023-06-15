const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// API-Schlüssel zum Vergleich
const API_KEY = 'your-api-key';

// Middleware-Funktion für die API-Schlüsselüberprüfung
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  next();
};

// Verbindung zur MongoDB-Datenbank
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definieren Sie das Datenmodell für die Entität "Item"
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API-Schlüsselüberprüfung für alle Routen
app.use(checkApiKey);

// GET: Alle Elemente abrufen
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Einzelnes Element abrufen
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Neues Element erstellen
app.post('/api/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Vorhandenes Element aktualisieren
app.put('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
    });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Ein Element löschen
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (item) {
      res.json({ message: 'Item deleted' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
