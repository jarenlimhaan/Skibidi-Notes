## Deployment (using Digital Ocean)
---

- For deployment, we used a **DigitalOcean Droplet**, which serves a similar role to AWS's ECS (Elastic Cloud Server). After provisioning the droplet with sufficient compute resources, we SSH-ed into the server and cloned our GitHub repository directly onto it. To maintain environment-specific configuration, we transferred our `.env` file from our local development machine to the server using `scp`.

- Once the codebase and environment variables were in place, we installed all necessary dependencies. This included setting up a Python virtual environment (poetry) for the backend (FastAPI) by running poetry install, and running `npm install` for the frontend (Next.js). 

- Redis was a requirement for caching and task state tracking, so we deployed it using Docker, making it lightweight and easy to manage.

- To keep the application running persistently on the server, we used `tmux` to create a detachable session. Inside that session, we ran our custom `make run` command, which starts both the frontend and backend concurrently. This allows the server to continue operating even after we disconnect the SSH session.

- The backend API (FastAPI) runs on port 8000 and is accessible via `/docs` for Swagger documentation, while the frontend (Next.js) runs on port 3000. This setup enabled us to simulate a production-like environment and reliably serve both the frontend and backend of our application.