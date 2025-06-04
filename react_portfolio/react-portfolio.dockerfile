# Use Node.js 18 alpine as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application
COPY . .

ARG REACT_APP_VIRTUALGUIGO_CONFIG_ID
ARG REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID

ENV REACT_APP_VIRTUALGUIGO_CONFIG_ID=$REACT_APP_VIRTUALGUIGO_CONFIG_ID
ENV REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID=$REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]





