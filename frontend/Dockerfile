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

# Expose port 4200 for Angular development server
EXPOSE 4200

# Start Angular development server using ng
CMD ["ng", "serve", "--host", "0.0.0.0"]
