FROM node:18-alpine

#  Create app directory
WORKDIR /usr/src/app/

#  Install dependencies
#  Copy both package.json and package-lock.json

COPY package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 3002

CMD ["node", "otpService.js"]