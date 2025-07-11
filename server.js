
// Backend Node.js/Express Server
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// In-memory database (for simplicity - replace with MongoDB in production)
let tasks = [
    {
        _id: '1',
        title: 'Sample Task 1',
        description: 'This is a sample task to demonstrate the application',
        status: 'pending',
        createdAt: new Date().toISOString()
    },
    {
        _id: '2',
        title: 'Sample Task 2',
        description: 'Another sample task with completed status', 
        status: 'completed',
        createdAt: new Date().toISOString()
    }
];

let nextId = 3;

// API Routes

// GET all tasks
app.get('/api/tasks', (req, res) => {
    try {
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
    try {
        const task = tasks.find(t => t._id === req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// POST create new task
app.post('/api/tasks', (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newTask = {
            _id: nextId.toString(),
            title: title.trim(),
            description: description ? description.trim() : '',
            status: status || 'pending',
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        nextId++;

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
    try {
        const taskIndex = tasks.findIndex(t => t._id === req.params.id);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const { title, description, status } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: title.trim(),
            description: description ? description.trim() : '',
            status: status || 'pending',
            updatedAt: new Date().toISOString()
        };

        res.json(tasks[taskIndex]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const taskIndex = tasks.findIndex(t => t._id === req.params.id);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];
        res.json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'task-manager-complete.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Task Manager Server running on http://localhost:${PORT}`);
    console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
    console.log('MongoDB URL: ' + (process.env.MONGODB_URL || 'Not configured'));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server gracefully...');
    process.exit(0);
});

module.exports = app;
