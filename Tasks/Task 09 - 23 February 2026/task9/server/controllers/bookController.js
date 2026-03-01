const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    // Check if valid ObjectId or custom bookId
    let book;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      book = await Book.findById(id);
    }
    if (!book) {
      book = await Book.findOne({ bookId: id });
    }
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Search books
// @route   GET /api/books/search?query=val&field=title
exports.searchBooks = async (req, res) => {
  try {
    const { query, field } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let searchQuery = {};
    const validFields = ['title', 'author', 'bookId'];
    
    if (field && validFields.includes(field)) {
      searchQuery[field] = { $regex: query, $options: 'i' };
    } else {
      searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { bookId: { $regex: query, $options: 'i' } }
        ]
      };
    }

    const books = await Book.find(searchQuery);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Add new book
// @route   POST /api/books
exports.addBook = async (req, res) => {
  try {
    const { bookId, title, author, category, quantity } = req.body;

    if (!bookId || !title || !author || !category || quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Please provide all required fields correctly' });
    }

    const existingBook = await Book.findOne({ bookId });
    if (existingBook) {
      return res.status(400).json({ message: 'Book ID already exists' });
    }

    const availabilityStatus = quantity > 0;

    const book = await Book.create({
      bookId, title, author, category, quantity, availabilityStatus
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const { title, author, category, quantity } = req.body;
    let updateData = { title, author, category, quantity };
    
    if (quantity !== undefined) {
      updateData.availabilityStatus = quantity > 0;
    }

    // Clean up undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate Book ID' });
    }
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};
