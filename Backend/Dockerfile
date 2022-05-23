FROM node

RUN mkdir -p /usr/src/app/
RUN mkdir /usr/src/photos/
RUN mkdir /usr/src/curriculum/
WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/
RUN npm install

COPY ./src /usr/src/app/
COPY .env /usr/src/app/
COPY ./photos/general.jpg /usr/src/photos/ 
RUN ln -s /usr/src/photos/ . 
RUN ln -s /usr/src/curriculum/ .

EXPOSE 3001
CMD ["node", "index.js"] 
