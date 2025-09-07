// routes/contact.js
import express from "express";
import Contact from "../models/contact.js";

const router = express.Router();

// ✅ GET all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contacts", error: err });
  }
});

// ✅ POST a new contact
router.post("/", async (req, res) => {
  try {
    const { title, value, link, icon } = req.body;

    const newContact = new Contact({
      title,
      value,
      link,
      icon,
    });

    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(400).json({ message: "Error creating contact", error: err });
  }
});

// ✅ PUT (update contact by ID)
router.put("/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: "Error updating contact", error: err });
  }
});

// ✅ DELETE (remove contact by ID)
router.delete("/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting contact", error: err });
  }
});

export default router;
