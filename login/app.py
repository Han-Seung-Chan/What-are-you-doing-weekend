from flask import Flask, jsonify, request, url_for, render_template
from jinja2 import Template # SSR을 위한 Jinja2 라이브러리
from pymongo import MongoClient # MongoDB 서버 연결

import bcrypt # pw 해싱용 라이브러리
import sys
import os

from datetime import datetime, timedelta # 쿠키 기간 만료 계산

import jwt # JWT 토큰 생성 및 검사

app = Flask(__name__)

client = MongoClient("localhost", 27017)

db = client.logintest
collection = db.users

# 홈페이지
@app.route("/")
def home():
    # 브라우저의 쿠키에서 유저 토큰 가져오기.
    token_receive = request.cookies.get("mytoken")

    try:
        # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
        payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])

        find_id = collection.find_one({"user_id" : payload["id"]})

        # 정상적으로 토큰이 Decoding 되고, 유저 ID가 있다면 아래의 과정을 수행한다.
        #
        if find_id:
            # 현재 파일이 위치한 절대 경로를 얻는다.
            directory = os.path.dirname(os.path.abspath(__file__))
            # index.html 파일 경로를 지정한다.
            template_path = os.path.join(directory, "../frontend/index.html")

            # html 파일을 읽어와 Jinja2 Template으로 로드한다.
            with open(template_path, 'r', encoding="utf-8") as file:
                template_content = file.read()
            
            template = Template(template_content)

            # 필요한 변수들이 있다면 넣어서 템플릿을 렌더링한다.
            rendered_template = template.render()

            return render_template("index.html")
            return rendered_template
        # 존재하지 않다면 login 페이지로 이동
        else :
            return login_page_render()
    
    # 토큰 인증을 받지 못할 때, login 페이지로 이동
    #
    # 기간 만료된 토큰일 때
    except jwt.ExpiredSignatureError:
        return login_page_render()
    
    # Decode 과정에서 오류가 발생할 때
    except jwt.exceptions.DecodeError:
        return login_page_render()

# Jinja2로 login.html SSR
def login_page_render():
    # 현재 파일이 위치한 절대 경로를 얻는다.
    directory = os.path.dirname(os.path.abspath(__file__))
    # sign_up.html 파일 경로를 지정한다.
    template_path = os.path.join(directory, "../frontend/login_html/login.html")

    # html 파일을 읽어와 Jinja2 Template으로 로드한다.
    with open(template_path, 'r', encoding="utf-8") as file:
        template_content = file.read()
        
    template = Template(template_content)

    # 필요한 변수들이 있다면 넣어서 템플릿을 렌더링한다.
    rendered_template = template.render()

    return rendered_template

# log-in
@app.route("/login", methods = ["POST"])
def login():
    # 요청된 유저 ID와 PW
    request_id = request.form["user_id"]
    request_pw = request.form["user_pw"]

    # DB에서 요청된 ID 존재 여부 확인
    find_data = collection.find_one({"user_id" : request_id})

    # DB에 해당 데이터가 존재하고, PW가 일치할 때 동작
    if find_data and bcrypt.checkpw(request_pw.encode(), find_data["user_pw"]):
        # Payload 생성
        payload = {"id" : request_id,
                   "exp" : datetime.utcnow() + timedelta(seconds = 60 * 60 * 24)} # 24시간 후 만료
        # Token 생성
        token = jwt.encode(payload, "Secret Key", algorithm = "HS256")

        return jsonify({"result": "success", "token" : token})
    else :
        return jsonify({"result" : "failure"})

# 회원가입 페이지 출력
@app.route("/sign-up-page")
def sign_up_page():
    # 현재 파일이 위치한 절대 경로를 얻는다.
    directory = os.path.dirname(os.path.abspath(__file__))
    # sign_up.html 파일 경로를 지정한다.
    template_path = os.path.join(directory, "../frontend/login_html/sign_up.html")

    # html 파일을 읽어와 Jinja2 Template으로 로드한다.
    with open(template_path, 'r', encoding="utf-8") as file:
        template_content = file.read()
    
    template = Template(template_content)

    # 필요한 변수들이 있다면 넣어서 템플릿을 렌더링한다.
    rendered_template = template.render()

    return rendered_template

# ID-check
@app.route("/id-check", methods=["GET"])
def id_check():
    # 요청된 유저 ID
    user_id = request.args.get("user_id")

    # DB에서 요청된 ID 탐색
    find_id = collection.find_one({"user_id": user_id})
    if not find_id:
        return jsonify({"result": "success"})
    return jsonify({"result": "failure"})

# sign-up
@app.route("/sign-up", methods = ["POST"])
def sign_up():
    # 회원가입을 위한 유저 정보
    user_name = request.form["user_name"]
    user_id = request.form["user_id"]
    user_pw = request.form["user_pw"].encode()

    # 유저 PW 해싱
    user_pw = bcrypt.hashpw(password=user_pw, salt=bcrypt.gensalt())

    # 정보를 DB에 저장
    doc = {"user_name": user_name, "user_id": user_id, "user_pw": user_pw}
    collection.insert_one(doc)
    return jsonify({"result": "success"})

if __name__ == '__main__':
    print(sys.executable)
    app.run('0.0.0.0', port = 5000, debug = True)