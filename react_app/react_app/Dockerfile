FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install react-router-dom \
        d3-selection \
        d3-fetch \
        d3-array \
        d3-geo \
        d3-scale \
        d3-scale-chromatic \
        topojson-client
COPY . .

EXPOSE 3000

CMD ["npm", "start"]