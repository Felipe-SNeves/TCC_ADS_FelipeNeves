FROM node
WORKDIR .
COPY . .
RUN npm install -g serve
CMD ["npx", "serve", "-s", "build"]
