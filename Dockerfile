FROM ubuntu

# Install python3
RUN apt-get update
RUN apt-get install -y python3

# Copy html
COPY /index.html /src/global_terrorism_development_visualize/
COPY /data /src/global_terrorism_development_visualize/data/

# Set work directory
WORKDIR /src/global_terrorism_development_visualize

# Run http server on port 8080
EXPOSE  8080
CMD ["python3", "-m", "http.server", "8080"]
