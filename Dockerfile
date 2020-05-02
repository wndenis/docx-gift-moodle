FROM python:3.7-slim
RUN apt-get -y update
RUN apt-get install -y --fix-missing \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    && apt-get clean && rm -rf /tmp/* /var/tmp/*
RUN apt-get install -y --fix-missing \
    libglib2.0-0 \
    libgtk2.0-dev \
    && apt-get clean && rm -rf /tmp/* /var/tmp/*
COPY . /app
WORKDIR /app 
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "app.py"]