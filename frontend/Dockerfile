# Use official Node.js image as the base image
FROM node:18-alpine

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN ng build --prod

# Expose port 80 for serving the application
EXPOSE 80

# Start serving the application using a simple web server
CMD ["npm", "run", "start:prod"]
