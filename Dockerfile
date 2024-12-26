# Use a Node.js base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project
RUN npm run build

# Expose the port on which the application will run
EXPOSE 3033
EXPOSE 3034

# Command to run the application
CMD ["npm", "run", "start:prod"]