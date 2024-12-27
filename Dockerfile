# Step 1: Build the Angular application
FROM node:14 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm build

# Step 2: Serve the Angular application using Nginx
FROM nginx:alpine

COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# Copy custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
