FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Build is performed before this stage

# Bundle app source
COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]