const express = require('express');
const mongoose = require('mongoose');
const Contact = require('./models/contact');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/contacts', async (req, res) => {
  const { name, phone, email } = req.body;
  const newContact = new Contact({ name, phone, email });
  try {
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/', async (req, res) => {
  try {
    await Contact.deleteMany();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, { name, phone, email }, { new: true });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Contact.findByIdAndDelete(id);
    res.status(204).json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
