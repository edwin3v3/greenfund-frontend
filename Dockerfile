# Use a stable Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies in a clean environment
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# The default command to run the app
CMD ["npm", "run", "dev"]