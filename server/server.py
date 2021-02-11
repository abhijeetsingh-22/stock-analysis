import datetime
from flask import Flask, request, jsonify
import pandas as pd
from pandas.io import json
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import jwt
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = 'thisIsTheMostSecureSecretKeyAbhijeetIsWorldsBestProgrammer'
MONGO_URI = 'mongodb+srv://master:asingh1999@cluster0.ekrao.mongodb.net/stockData?retryWrites=true&w=majority'
client = MongoClient(MONGO_URI)
db = client.stockData
users = db.users
pairs = db.pairData
pairDetails = db.pairDetails


def isloggedin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'error': {'message': 'you need to login to do that token'}})
        try:
            print('key is ', app.config['SECRET_KEY'])
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = {'username': data['username']}
        except Exception as e:
            print(e)
            return jsonify({'error': {'message': 'you need to login to do that', 'code': 401}})

        return f(current_user, *args, **kwargs)
        # return f
    return decorator


@app.route('/')
# @isloggedin
def home():
    df = pd.DataFrame([1, 2, 3, 4])
    df.to_csv('test.csv')
    return ('welcome')
    # return ('welcome ' + current_user['username'])


# @app.route('/auth/signup', methods=['GET', 'POST'])
# def signup_user():
#     try:
#         data = request.get_json()
#         if not data or not data['username'] or not data['password']:
#             return jsonify({'error': {'message': 'please enter valid username/password'}})
#         hashed_password = generate_password_hash(
#             data['password'], method='sha256')
#         new_user = users.insert_one(
#             {'username': data['username'], 'password': hashed_password},)
#         print(new_user)

#         if new_user:
#             token = jwt.encode({'username': data['username'], 'exp': datetime.datetime.utcnow(
#             ) + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
#             print(token)
#             return jsonify({'token': token})
#         # return jsonify({'error': {'message': 'please enter valid username/password'}})
#     except Exception as e:
#         print(e)
#         return jsonify({'error': {'message': 'something went wrong, try again later'}})


@app.route('/auth/signin', methods=['GET', 'POST'])
def login_user():

    auth = request.json

    if not auth or not auth['username'] or not auth['password']:
        return jsonify({'error': {'message': 'wrong username/password'}})

    user = users.find_one({"username": auth['username']})

    if user and check_password_hash(user['password'], auth['password']):
        token = jwt.encode({'username': user['username'], 'exp': datetime.datetime.utcnow(
        ) + datetime.timedelta(hours=15)}, app.config['SECRET_KEY'])

        return jsonify({'token': token, 'username': user['username']})
    return jsonify({'error': {'message': 'wrong username/password'}})


@ app.route('/api/getpairs')
@ isloggedin
def pairsRes(current_user):
    try:

        data = pairs.find()
        response = []
        for doc in data:
            doc['_id'] = str(doc['_id'])
            response.append(doc)

        return json.dumps(response)
    except Exception as e:
        print(e)
        return jsonify({'error': {'message': 'not found'}})


@ app.route('/api/pairdetails/<yStock>/<xStock>')
@ isloggedin
def getPairData(current_user, yStock, xStock):
    try:
        data = pairDetails.find({'xStock': xStock, 'yStock': yStock})

        res = []
        for doc in data:
            doc['_id'] = str(doc['_id'])
            res.append(doc)

        return json.dumps(res[0])
    except Exception as e:
        print(e)
        return jsonify({'error': {'message': 'something went wrong, try again later'}})


#
if __name__ == '__main__':
    app.run(port=8000, debug=True)
