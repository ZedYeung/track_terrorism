FROM node:8

# Install http-server
RUN npm install http-server -g

# Copy html and data
COPY /index.html /src/global_terrorism_development_visualize/
COPY /data /src/global_terrorism_development_visualize/data/

# Set work directory
WORKDIR /src/global_terrorism_development_visualize

# Run http server on port 8080
EXPOSE  8080
CMD ["http-server", "-d", "false", "-g", "true", "-p", "8080"]
