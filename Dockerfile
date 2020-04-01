FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
RUN npm config set unsafe-perm true
RUN npm install --unsafe-perm
RUN npm build

# Bundle app source
COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]