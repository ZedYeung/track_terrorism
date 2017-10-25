FROM ubuntu

# Install python3
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip
RUN pip3 install \
  gunicorn \
  Flask \
  flask-compress

# Copy html
COPY /templates /src/global_terrorism_development_visualize/templates/
COPY /static /src/global_terrorism_development_visualize/static/
COPY /app.py /src/global_terrorism_development_visualize/app.py

# Set work directory
WORKDIR /src/global_terrorism_development_visualize

# Run http server on port 8080
EXPOSE 8080
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:8080"]
