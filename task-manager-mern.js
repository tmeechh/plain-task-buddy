
/*
===============================================
MERN TASK MANAGER - COMPLETE APPLICATION
===============================================
Frontend: React Components (JSX)
Backend: Express.js Server with MongoDB
Database: MongoDB (configured via environment)
===============================================
*/

// ===== BACKEND (Express Server) =====
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory database (replace with MongoDB in production)
let tasks = [
    {
        _id: '1',
        title: 'Sample Task 1',
        description: 'This is a sample task',
        status: 'pending',
        createdAt: new Date().toISOString()
    },
    {
        _id: '2',
        title: 'Sample Task 2',
        description: 'Another sample task',
        status: 'completed',
        createdAt: new Date().toISOString()
    }
];

let nextId = 3;

// API Routes
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { title, description, status } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
        _id: nextId.toString(),
        title,
        description: description || '',
        status: status || 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    nextId++;
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t._id === req.params.id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, status } = req.body;
    
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title || tasks[taskIndex].title,
        description: description || tasks[taskIndex].description,
        status: status || tasks[taskIndex].status
    };

    res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t._id === req.params.id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully' });
});

// Serve React app
app.get('*', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MERN Task Manager</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { background: #333; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .form-container { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        textarea { resize: vertical; height: 80px; }
        .btn { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .task-list { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .task-item { padding: 20px; border-bottom: 1px solid #eee; }
        .task-item:last-child { border-bottom: none; }
        .task-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .task-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .task-status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-completed { background: #d1edff; color: #004085; }
        .task-actions { display: flex; gap: 10px; }
        .loading { text-align: center; padding: 40px; }
        .empty { text-align: center; padding: 40px; color: #666; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // API Functions
        const api = {
            getTasks: async () => {
                const response = await fetch('/api/tasks');
                return response.json();
            },
            createTask: async (task) => {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(task)
                });
                return response.json();
            },
            updateTask: async (id, task) => {
                const response = await fetch(\`/api/tasks/\${id}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(task)
                });
                return response.json();
            },
            deleteTask: async (id) => {
                await fetch(\`/api/tasks/\${id}\`, { method: 'DELETE' });
            }
        };

        // Task Form Component
        const TaskForm = ({ task, onSubmit, onCancel }) => {
            const [title, setTitle] = useState(task ? task.title : '');
            const [description, setDescription] = useState(task ? task.description : '');
            const [status, setStatus] = useState(task ? task.status : 'pending');

            const handleSubmit = (e) => {
                e.preventDefault();
                if (!title.trim()) return;
                onSubmit({ title, description, status });
                if (!task) {
                    setTitle('');
                    setDescription('');
                    setStatus('pending');
                }
            };

            return (
                <div className="form-container">
                    <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {task ? 'Update Task' : 'Add Task'}
                        </button>
                        {task && (
                            <button type="button" onClick={onCancel} className="btn btn-secondary">
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            );
        };

        // Task List Component
        const TaskList = ({ tasks, onEdit, onDelete }) => {
            if (tasks.length === 0) {
                return (
                    <div className="empty">
                        <h3>No tasks yet</h3>
                        <p>Click "Add Task" to create your first task</p>
                    </div>
                );
            }

            return (
                <div className="task-list">
                    {tasks.map(task => (
                        <div key={task._id} className="task-item">
                            <div className="task-header">
                                <div>
                                    <div className="task-title">{task.title}</div>
                                    <span className={\`task-status status-\${task.status}\`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="task-actions">
                                    <button 
                                        onClick={() => onEdit(task)} 
                                        className="btn btn-success"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => onDelete(task._id)} 
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {task.description && <p>{task.description}</p>}
                            <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>
            );
        };

        // Main App Component
        const App = () => {
            const [tasks, setTasks] = useState([]);
            const [loading, setLoading] = useState(true);
            const [showForm, setShowForm] = useState(false);
            const [editingTask, setEditingTask] = useState(null);

            useEffect(() => {
                loadTasks();
            }, []);

            const loadTasks = async () => {
                try {
                    const data = await api.getTasks();
                    setTasks(data);
                } catch (error) {
                    console.error('Error loading tasks:', error);
                } finally {
                    setLoading(false);
                }
            };

            const handleCreateTask = async (taskData) => {
                try {
                    await api.createTask(taskData);
                    loadTasks();
                    setShowForm(false);
                } catch (error) {
                    console.error('Error creating task:', error);
                }
            };

            const handleUpdateTask = async (taskData) => {
                try {
                    await api.updateTask(editingTask._id, taskData);
                    loadTasks();
                    setEditingTask(null);
                    setShowForm(false);
                } catch (error) {
                    console.error('Error updating task:', error);
                }
            };

            const handleDeleteTask = async (id) => {
                if (confirm('Are you sure you want to delete this task?')) {
                    try {
                        await api.deleteTask(id);
                        loadTasks();
                    } catch (error) {
                        console.error('Error deleting task:', error);
                    }
                }
            };

            const handleEditTask = (task) => {
                setEditingTask(task);
                setShowForm(true);
            };

            const handleCancelEdit = () => {
                setEditingTask(null);
                setShowForm(false);
            };

            if (loading) {
                return <div className="loading">Loading tasks...</div>;
            }

            return (
                <div className="container">
                    <div className="header">
                        <h1>MERN Task Manager</h1>
                        <p>Full Stack React + Node.js + Express + MongoDB</p>
                    </div>

                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="btn btn-primary"
                        style={{ marginBottom: '20px' }}
                    >
                        {showForm ? 'Hide Form' : 'Add New Task'}
                    </button>

                    {showForm && (
                        <TaskForm
                            task={editingTask}
                            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                            onCancel={editingTask ? handleCancelEdit : null}
                        />
                    )}

                    <TaskList
                        tasks={tasks}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                    />
                </div>
            );
        };

        // Render App
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(\`MERN Task Manager running on http://localhost:\${PORT}\`);
    console.log('Frontend: React with vanilla CSS');
    console.log('Backend: Express.js with in-memory storage');
    console.log('Ready for MongoDB integration');
});

module.exports = app;
