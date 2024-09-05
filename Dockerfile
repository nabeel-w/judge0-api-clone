FROM node:20.5.1
ENV DEBIAN_FRONTEND=noninteractive

ENV NODE_ENV=production \
    JWT_SECRET=w%v2A!4sDzN7cE*g9Pb#f@j^Kt8BqLmY \
    MONGO_LINK=mongodb+srv://admin-nabeel:N%40beel3112@cluster0.3jl39cv.mongodb.net/codeDB?retryWrites=true&w=majority \
    PORT=5000

RUN apt-get update && \
    apt-get install -y \
    build-essential \  
    python3 \                  
    php
RUN npm install -g npm@latest
WORKDIR /app
COPY package*.json ./
COPY . .
COPY ./client/build/ ./build
RUN rm -rf node_modules
RUN rm -rf client
RUN rm package-lock.json
RUN npm install
EXPOSE 5000
CMD ["node", "/app/index.js"]