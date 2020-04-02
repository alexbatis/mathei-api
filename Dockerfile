FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json .

RUN npm config set unsafe-perm true
RUN npm install --unsafe-perm
RUN npm run-script build

# Bundle app source
COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]