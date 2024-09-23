const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB Connected"))
.catch(err => console.error("DB Connection Error:", err));

// Creating schema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        default: ''
    }
});

// Creating model
const Todo = mongoose.model('Todo', todoSchema);

// Create a new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newTodo = new Todo({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: error.message });
    }
});

// Update a todo item
app.put('/todos/:id', async (req, res) => {
    const { title, description } = req.body;
    const id = req.params.id;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a todo item
app.delete('/todos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
