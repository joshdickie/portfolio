FROM node:24-alpine

WORKDIR /app

COPY backend ./backend
COPY tsconfig.base.json ./

WORKDIR /app/backend
RUN npm install

CMD ["npm", "run", "dev"]
