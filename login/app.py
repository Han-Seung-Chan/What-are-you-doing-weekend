from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient

import bcrypt
import sys

from datetime import datetime, timedelta

import jwt

app = Flask(__name__)

client = MongoClient("localhost", 27017)

db = client.logintest
collection = db.users

# sign-up 페이지
@app.route("/sign_up_page")
def sign_up_page():
    return render_template("sign_up.html")

# id-check
@app.route("/id_check", methods=["GET"])
def id_check():
    user_id = request.args.get("user_id")

    find_id = collection.find_one({"user_id": user_id})
    if not find_id:
        return jsonify({"result": "success"})
    return jsonify({"result": "failure"})

# sign-up
@app.route("/sign_up", methods = ["POST"])
def sign_up():
    user_name = request.form["user_name"]
    user_id = request.form["user_id"]
    user_pw = request.form["user_pw"].encode()

    user_pw = bcrypt.hashpw(password=user_pw, salt=bcrypt.gensalt())

    doc = {"user_name": user_name, "user_id": user_id, "user_pw": user_pw}
    collection.insert_one(doc)
    return jsonify({"result": "success"})
    
## pw-check
#@app.route("/pw_check", methods = ["GET"])
#def check_pw():
#    user_pw = request.args.get("user_pw").encode()
#    find_pw = collection.find_one({"user_id": "bbb"})["user_pw"]
#    is_same = bcrypt.checkpw(user_pw, find_pw)
#
#    if is_same:
#        return jsonify({"result": "success"})
#    return jsonify({"result": "failure"})



# log-in 페이지
@app.route("/login_page")
def login_page():
    return render_template("login.html")

# log-in
@app.route("/login", methods = ["POST"])
def login():
    request_id = request.form["user_id"]
    request_pw = request.form["user_pw"]

    find_data = collection.find_one({"user_id" : request_id})

    if find_data and bcrypt.checkpw(request_pw.encode(), find_data["user_pw"]):
        payload = {"id" : request_id,
                   "exp" : datetime.utcnow() + timedelta(seconds = 1)} # 24시간 후 만료
        token = jwt.encode(payload, "Secret Key", algorithm = "HS256")

        return jsonify({"result": "success", "token" : token})
    else :
        return jsonify({"result" : "failure"})

# token-test
@app.route("/test")
def test():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
        print(payload)
        return render_template("test.html")
    except jwt.ExpiredSignatureError:
        return render_template("login.html")
        print("Expired Error")
    except jwt.exceptions.DecodeError:
        return render_template("login.html")
        print("Decode Error")

if __name__ == '__main__':
    print(sys.executable)
    app.run('0.0.0.0', port = 5000, debug = True)