FROM node:24-alpine

WORKDIR /app

COPY frontend ./frontend
COPY tsconfig.base.json ./

WORKDIR /app/frontend
RUN npm install

CMD ["npm", "run", "dev"]
