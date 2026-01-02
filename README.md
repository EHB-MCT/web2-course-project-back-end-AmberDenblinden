# Carnaval Halle Backend ✨

This is the backend API for the Carnaval Halle Web 2 project.
It provides a carnaval-groups API that serves data about carnaval groups and supports retrieving individual group information for use in the frontend application.

The API is hosted on Render and is consumed by a Vite-based frontend deployed on GitHub Pages.

Website url: https://web2-course-project-back-end-u8jp.onrender.com

## Available API endpoints

GET /groups
Returns a list of all carnaval groups.

GET /groups/:id
Returns detailed information about a specific group.

POST /groups
Adds a new carnaval group.

PUT /groups/:id
Updates an existing carnaval group.

DELETE /groups/:id
Deletes a carnaval group.

## Sources 🗃️

- Anthropic. (2024). Claude (Version 4) [Large language model].https://claude.ai/share/57c48408-6d0c-42e6-b03d-47a638a3c346
  Used for fixing errors while deploying the frontend to GitHub Pages using GitHub Actions.
- Express.js Documentation. (n.d.). https://expressjs.com/
  Used for setting up the server and routing (backend.js).
- MongoDB Atlas Documentation. (n.d.). https://www.mongodb.com/docs/atlas/
- Team, M. D. (n.d.). Access data from a cursor. Node.js Driver - MongoDB Docs. https://www.mongodb.com/docs/drivers/node/current/crud/query/cursor/#return-an-array-of-all-documents
  Used for database connection and data storage.
- Render Documentation. (n.d.). https://render.com/docs
  Used for deploying the backend API.
