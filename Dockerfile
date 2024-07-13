FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN NEXT_PUBLIC_BACKEND_HOST=APP_NEXT_PUBLIC_BACKEND_HOST npm run build

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["npm", "start"]

EXPOSE 3000
