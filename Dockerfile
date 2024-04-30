
# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app's source code inside the Docker container
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable to specify the production environment
##ENV NODE_ENV=production

# Run the app when the container launches
CMD ["npm", "start"]
