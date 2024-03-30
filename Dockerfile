FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
CMD ["npm", "start"]
EXPOSE 3006
