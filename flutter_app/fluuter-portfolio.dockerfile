FROM ghcr.io/cirruslabs/flutter:latest AS build

WORKDIR /app

COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get

COPY . .

RUN rm -rf .dart_tool .packages .flutter-plugins .flutter-plugins-dependencies

RUN flutter build web --release

# 🧊 Serve the web build using NGINX
FROM nginx:alpine

# Copy custom config to ensure port 8080 is used
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the web build output
COPY --from=build /app/build/web /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]