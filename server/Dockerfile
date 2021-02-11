FROM python:3.9.1

WORKDIR /
COPY ./requirements.txt .
RUN pip install --upgrade pip \
    &&  pip install --trusted-host pypi.python.org --requirement requirements.txt
COPY . .
CMD [ "gunicorn","-b","0.0.0.0:8001","wsgi" ]