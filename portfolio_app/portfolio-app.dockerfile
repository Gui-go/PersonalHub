# Install dependencies
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the project files
COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
