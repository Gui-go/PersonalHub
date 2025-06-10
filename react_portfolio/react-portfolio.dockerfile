# FROM node:16-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000

# ARG REACT_APP_VIRTUALGUIGO_CONFIG_ID
# ARG REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID
# ARG REACT_APP_GWR_CONFIG_ID
# ENV REACT_APP_VIRTUALGUIGO_CONFIG_ID=$REACT_APP_VIRTUALGUIGO_CONFIG_ID
# ENV REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID=$REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID
# ENV REACT_APP_GWR_CONFIG_ID=$REACT_APP_GWR_CONFIG_ID

# CMD [ "npm", "start" ]


# # Build stage
# FROM node:20 AS builder
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build


# # Production stage
# FROM node:20 AS production
# WORKDIR /app
# COPY . .
# COPY --from=builder /app/.next /app/.next
# ENV NODE_ENV=production
# CMD ["npm", "start"]

# Build stage
# FROM node:20 AS builder
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build

# # Production stage
# FROM node:20 AS production
# WORKDIR /app
# RUN npm install -g serve
# COPY --from=builder /app/dist /app/dist
# CMD ["serve", "-s", "dist", "-l", "3000"]

# ---- Build Stage ----
# FROM node:20 AS builder

# WORKDIR /app
# COPY . .

# RUN npm run build && npm run export


# # ---- Production Stage ----
# FROM node:20 AS production

# WORKDIR /app
# RUN npm install -g serve

# COPY --from=builder /app/out /app/out

# CMD ["serve", "-s", "out", "-l", "3000"]

# Stage 1: Build the app
# FROM node:20 AS builder

# WORKDIR /app
# COPY . .

# RUN npm install
# RUN npm run build && npm run export

# # Stage 2: Serve the static build
# FROM node:20 AS production

# WORKDIR /app
# RUN npm install -g serve

# COPY --from=builder /app/out /app/out

# CMD ["serve", "-s", "out", "-l", "3000"]


# Stage 1: Build the app
FROM node:20 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve the static build
FROM node:20 AS production

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/out /app/out

CMD ["serve", "-s", "out", "-l", "3000"]


#--------------------------------------------
# Use Node.js 18 alpine as the base image
# FROM node:18-alpine

# Set working directory
# WORKDIR /app

# Copy package.json and install dependencies
# COPY package.json .
# RUN npm install

# Copy the rest of the application
# COPY . .

# ARG REACT_APP_VIRTUALGUIGO_CONFIG_ID
# ARG REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID
# ARG REACT_APP_GWR_CONFIG_ID

# ENV REACT_APP_VIRTUALGUIGO_CONFIG_ID=$REACT_APP_VIRTUALGUIGO_CONFIG_ID
# ENV REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID=$REACT_APP_MIGRATIONDYNAMICS_CONFIG_ID
# ENV REACT_APP_GWR_CONFIG_ID=$REACT_APP_GWR_CONFIG_ID

# Expose port
# EXPOSE 3000

# Start the development server
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]



# CMD ["npm", "install", "-g", "serve"]
# CMD ["serve", "-s", "buid", "-l", "3000"]
# CMD ["npm", "run", "start"]
# CMD ["npm", "start"]



