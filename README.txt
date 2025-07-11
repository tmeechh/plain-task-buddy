
TASK MANAGER APPLICATION
========================

QUICK START:
1. Make sure Node.js is installed on your system
2. Open terminal/command prompt in this folder
3. Run: npm install
4. Run: npm start
5. Open browser and go to: http://localhost:3000

FILES INCLUDED:
- task-manager-complete.html (Frontend - complete UI)
- server.js (Backend - Express API server)
- package.json (Dependencies configuration)
- .env (Environment variables)
- README.txt (This file)

FEATURES:
✓ Add new tasks with title, description, and status
✓ Edit existing tasks
✓ Delete tasks with confirmation
✓ View all tasks in a clean list
✓ Basic responsive design
✓ No external dependencies except Express
✓ Ready-to-use MongoDB configuration
✓ Error handling and user feedback

API ENDPOINTS:
GET    /api/tasks     - Get all tasks
GET    /api/tasks/:id - Get single task
POST   /api/tasks     - Create new task
PUT    /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task

ENVIRONMENT SETUP:
- Default port: 3000
- Environment variables in .env file
- Sample MongoDB URL included (replace with real one)
- Development mode by default

DEPLOYMENT READY:
- All code in single project folder
- No build process required
- Can be deployed to any Node.js hosting service
- Environment variables configured
- Production-ready error handling

CUSTOMIZATION:
- Modify styles in the <style> section of task-manager-complete.html
- Add more fields by updating both frontend and backend
- Replace in-memory storage with actual MongoDB connection
- Add authentication if needed

For MongoDB integration, replace the in-memory tasks array 
with actual MongoDB operations using the MONGODB_URL from .env file.
