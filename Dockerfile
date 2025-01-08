# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
