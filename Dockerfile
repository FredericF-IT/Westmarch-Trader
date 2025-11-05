#set node instance
FROM node:latest

#set working directory
WORKDIR /usr/src/app

#install sqlite3
RUN apt-get update && apt-get install -y sqlite3

#install dependencies
RUN npm install -g pm2
RUN npm install discord.js
RUN npm install sqlite3
RUN npm install dotenv
RUN npm install discord-interactions
RUN npm install node-fetch

#expose port...
#EXPOSE 3000

ENTRYPOINT ["pm2-runtime", "process.json" ]
