# Josh Dickie's Portfolio

Full-stack portfolio site and playground.

- Frontend: [Next.js](https://nextjs.org/) (React + TypeScript)
- Backend: [Express](https://expressjs.com/) + [Mongoose](https://mongoosejs.com/) (TypeScript)
- Database: MongoDB
- Containerized: Docker Compose
- Author: [Josh Dickie](https://github.com/joshdickie)

---

## Project Structure

```
├── backend/ # Express + Mongoose API
├── frontend/ # Next.js React app
├── content/ # Source content (Markdown)
├── scripts/ # Scripts for orchestration and deployment (bash, js)
├── tsconfig.base.json
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Development

### Start containers:

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## License

### MIT

---
