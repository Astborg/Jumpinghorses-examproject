# Use official Node.js image as a base
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port for your app
EXPOSE 5000

# Run the backend app
CMD ["npm", "start"]