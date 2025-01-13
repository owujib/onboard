# FROM node:18-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 3000


# CMD ["npm", "start"]


FROM node:22-alpine

WORKDIR /app

# Install build dependencies for bcrypt and Prisma (or other native modules)
RUN apk add --no-cache python3 make g++ bash

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate


# Expose port 3000
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
