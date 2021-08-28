FROM ubuntu
WORKDIR /usr/src/app
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y firefox firefox-geckodriver curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get install nodejs
COPY package*.json ./
RUN npm install 
COPY selenium-test.mjs ./
CMD ["npm", "start"]

