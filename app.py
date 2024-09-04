from flask import Flask, jsonify, request, url_for, render_template
from jinja2 import Template # SSR을 위한 Jinja2 라이브러리
from pymongo import MongoClient # MongoDB 서버 연결
from bson import ObjectId
from bson.json_util import dumps
from flask.json.provider import JSONProvider

import bcrypt # pw 해싱용 라이브러리
import sys
import os
import uuid
import json

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
            return render_template('template.html')
        # 존재하지 않다면 login 페이지로 이동
        else :
            return render_template("login.html")
    
    # 토큰 인증을 받지 못할 때, login 페이지로 이동
    #
    # 기간 만료된 토큰일 때
    except jwt.ExpiredSignatureError:
        return render_template("login.html")
    
    # Decode 과정에서 오류가 발생할 때
    except jwt.exceptions.DecodeError:
        return render_template("login.html")

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

# log-out
@app.route("/logout", methods = ["POST"])
def logout():
    print("임시")

# 회원가입 페이지 출력
@app.route("/sign-up-page")
def sign_up_page():
    return render_template("sign_up.html")  
  
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


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

class CustomJSONProvider(JSONProvider):
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=CustomJSONEncoder)

    def loads(self, s, **kwargs):
        return json.loads(s, **kwargs)

app.json = CustomJSONProvider(app)



@app.route('/api/write', methods=['POST'])
def post_schedule():
    print(request.form)
    title = request.form['title']
    scheduled_time = request.form['scheduled_time']
    description = request.form['description']
    participant = request.form.getlist('participant')

    # 브라우저의 쿠키에서 유저 토큰 가져오기.
    token_receive = request.cookies.get("mytoken")

    # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
    payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
    author_id = payload["id"]
    
    if not title or not scheduled_time or not description:
        return jsonify({"message": " 모든 영역을 입력해 주세요 "}), 400

    post_id = str(uuid.uuid4()) # uuid 를 활용한 post_id 만들기 
    current_time = datetime.datetime.now() # 현재 시간 가공해서 시간
    write_time = current_time.strftime("%Y.%m.%d %H:%M")
    doc = {
        'post_id': post_id,
        'title': title,
        'scheduled_time': scheduled_time,
        'description': description,
        'write_time': write_time,
        'participant': participant,
        'author_id': author_id
    }
    db.schedules.insert_one(doc)
    return jsonify({'result': 'success', 'post_id': post_id})

# LIST
@app.route('/list')
def list_page():
    directory = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(directory, 'list.html')

    with open(template_path, 'r', encoding='utf-8') as file:
        template_content = file.read()

    template = Template(template_content)
    rendered_template = template.render(variable1="value1", variable2="value2")

    return rendered_template

# LIST 목록 
@app.route('/api/lists', methods=['GET'])
def schedule_list():
    try:
        result = list(db.schedules.find({}, {'_id': 0})) # id 제외하고 반환
        schedules = []
        for schedule in result:
            schedules.append(schedule)
        print(schedules)
        return jsonify({'result': 'success', 'schedules': schedules})

    except Exception as e:
        return jsonify({'result': 'error', 'message': str(e)}), 500

# VIEW 상세
@app.route('/api/view', methods=['GET'])
def schedule_view():
    try:
        post_id = request.args.get('post_id')
        result = db.schedules.find_one({'post_id': post_id}, {'_id': 0})
        
        return jsonify({'result': 'success', 'schedules': result})
    
    except Exception as e:
        return jsonify({'result': 'error', 'message': str(e)}), 500

@app.route('/api/edit', methods=['POST'])
def editMemo():
    post_id = request.form['post_id']
    result = db.schedules.find_one({'post_id': post_id}, {'_id': 0})
    print(post_id)
    return jsonify({'result':'success', 'schedules': result})

app.run(port=5002, debug=True)
