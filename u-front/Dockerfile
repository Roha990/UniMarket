FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install yarn

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
