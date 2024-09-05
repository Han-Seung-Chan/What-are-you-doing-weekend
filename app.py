from flask import Flask, jsonify, request, render_template, make_response, redirect
from pymongo import MongoClient # MongoDB 서버 연결
from bson import ObjectId
# from bson.json_util import dumps
from flask.json.provider import JSONProvider

import bcrypt # pw 해싱용 라이브러리
import sys
import os
import uuid
import json

from datetime import datetime, timedelta # 쿠키 기간 만료 계산

import jwt # JWT 토큰 생성 및 검사

app = Flask(__name__)

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

client = MongoClient("localhost", 27017)

db = client.logintest
login_collection = db.users
post_collection = db.posts

# 홈페이지
@app.route("/")
def home():
    # 브라우저의 쿠키에서 유저 토큰 가져오기.
    token_receive = request.cookies.get("mytoken")

    try:
        # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
        payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])

        find_id = login_collection.find_one({"user_id" : payload["id"]})

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
    find_data = login_collection.find_one({"user_id" : request_id})

    # DB에 해당 데이터가 존재하고, PW가 일치할 때 동작
    if find_data and bcrypt.checkpw(request_pw.encode(), find_data["user_pw"]):
        # Payload 생성
        payload = {"id" : request_id,
                   "exp" : datetime.utcnow() + timedelta(seconds = 60 * 60 * 24)} # 24시간 후 만료
        # Token 생성
        token = jwt.encode(payload, "Secret Key", algorithm = "HS256")

        return jsonify({"result": "success", "data" : token})
    else :
        return jsonify({"result" : "failure"})

# log-out
@app.route("/api/logout", methods = ["POST"])
def logout():
    # test
    res=make_response("")
    res.set_cookie("mytoken", "", max_age=0)
    
    return res

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
    find_id = login_collection.find_one({"user_id": user_id})
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
    doc = {"user_name": user_name, "user_id": user_id, "user_pw": user_pw, "user_parti" : [], "user_write": [], "alarm": []}
    login_collection.insert_one(doc)
    return jsonify({"result": "success"})

@app.route('/api/write', methods=['POST'])
def post_schedule():
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
    current_time = datetime.now() # 현재 시간 가공해서 시간
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
    post_collection.insert_one(doc)

    find_user = login_collection.find_one({"user_id" : author_id})
    user_write_list = list(find_user["user_write"])
    user_write_list.append(post_id)
    login_collection.update_one({"user_id" : author_id}, {"$set":{"user_write": user_write_list}})

    return jsonify({'result': 'success', 'data': doc})

# VIEW 상세
@app.route('/api/view', methods=['GET'])
def schedule_view():
    try:
        post_id = request.args.get('post_id')
        result = post_collection.find_one({'post_id': post_id}, {'_id': 0})
        author_id = result["author_id"]
        
        # 브라우저의 쿠키에서 유저 토큰 가져오기.
        token_receive = request.cookies.get("mytoken")
        # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
        payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
        user_id = payload["id"]

        isWriter = False
        isParti = False

        if author_id == user_id: isWriter = True
        
        if not isWriter:
            find_user = login_collection.find_one({"user_id" : user_id})

            user_parti = list(find_user["user_parti"])
            if post_id in user_parti:
                isParti = True
        print(isWriter)
        print(isParti)
        result["isWriter"] = isWriter
        result["isParti"] = isParti
        return jsonify({'result': 'success', 'data': result})
    
    except Exception as e:
        return jsonify({'result': 'error', 'data': str(e)}), 500
    
@app.route('/api/edit', methods=['POST'])
def editPost():
    post_id = request.form['post_id']
    title = request.form['title']
    scheduled_time = request.form['scheduled_time']
    description = request.form['description']
    participant = request.form.getlist('participant')

    post_collection.update_one({'post_id': post_id},
                               {'$set': {'title': title,
                                        'scheduled_time': scheduled_time,
                                        'description': description,
                                        'participant': participant,}})
    print(post_id)
    return jsonify({'result':'success', 'data': result})

# LIST 기능 
# 정렬 순서를 Parameter 로 받아오기
# [현재 진행 중]/ 약속 시간 순/ 작성 날짜 순/ 내가 작성한 글/ 내가 참여한 글 
# inProgress/ appointment/ createdDate/ wrotebyMe/ participated
# 내가 작성한 글, 내가 참여한 글은 별도로 진행하기로 함 ( LNB Button )
@app.route('/api/lists', methods=['GET'])
def schedule_list():
    sortMode = request.args.get('sortMode', 'inProgress')

    current_date = datetime.now()
    today_date_str = current_date.strftime('%Y%m%d')
    today_date = int(today_date_str)

    # post_collection에서 데이터를 가져옴
    appoints = list(post_collection.find({}, {}))
    
    filtered_results = []
    for appointment_doc in appoints:
        try:
            # 'scheduled_time'이 없거나 변환할 수 없으면 건너뜀
            scheduled_time_str = appointment_doc.get('scheduled_time')

            print(scheduled_time_str)
            if scheduled_time_str is None:
                continue  # 'scheduled_time' 필드가 없으면 다음 문서로
            date_obj = datetime.strptime(scheduled_time_str, '%Y-%m-%d')
            year = date_obj.year
            month = date_obj.month
            day = date_obj.day
            appointment_date =  year * 10000 + month * 100 + day
            if today_date < appointment_date:
                filtered_results.append(appointment_doc)
        except (ValueError, KeyError) as e:
            # 변환 중 예외가 발생할 경우 건너뜀
            print(f"Error processing document: {e}")
            continue

    if sortMode == 'inProgress': 
        result = filtered_results
    elif sortMode == 'appointment': 
        result = list(post_collection.find().sort('scheduled_time', -1))
    elif sortMode == 'createdDate': 
        result = list(post_collection.find().sort('write_time', -1))
    else:
        result = list(post_collection.find({}, {'_id': 0}))  # '_id' 제외하고 반환

    return jsonify({'result': 'success', 'data': result})


# LIST/COMMENT  
# FE 에서 data 로 post_id 받아옴 
# DB 이름은 comments_list ( s 있음 )
@app.route('/api/list/comments', methods=['GET'])
def list_comment(): 
    post_id = request.args.get('post_id')
    # print(f"Received post_id: {post_id}")  # Debug print

    # Assuming post_id is a UUID and stored as a string in MongoDB
    try:
        result = list(db.comments_list.find({'post_id': post_id}, {'_id': 0}))
    except Exception as e:
        print(f"Error querying database: {e}")  # Debug print
        return jsonify({'result': 'error', 'data': '서버 오류입니다.'}), 500

    # if not result:
        # return jsonify({'result': 'error', 'data': '댓글을 찾을 수 없습니다.'}), 404

    comments = [comment for comment in result]

    return jsonify({'result': 'success', 'data': comments})

# WRITE/COMMENT 
# FE 에서 data 로 post_id 받아옴 
# Comment 에 필요한 것; 작성자 author_id, 내용 commentDesc
# DB 에 넣을 것; post_id, 작성자 author_id, 내용 commentDesc
# URL 이랑 DB 이름 둘 다 s 있음
@app.route('/api/write/comments', methods=['POST'])
def post_comment(): 
    post_id = request.form['post_id']
    # authod_id = request.form['authod_id']
    token_receive = request.cookies.get("mytoken")

    # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
    payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
    author_id = payload["id"]
    commentDesc = request.form['commentDesc']

    if not commentDesc:
        return jsonify({'result': 'error', 'data': ' 댓글을 입력하세요 '})

    doc = {
        'post_id': post_id,
        'author_id': author_id,
        'commentDesc': commentDesc
    }

    db.comments_list.insert_one(doc) # comment DB 별도 생성
    return jsonify({'result': 'success', 'data': doc})

# LIST/REVIEW  
# FE 에서 data 로 post_id 받아옴 
# URL 이랑 DB 이름 둘 다 s 있음
@app.route('/api/list/reviews', methods=['GET'])
def list_review(): 
    post_id = request.args.get('post_id')
    # print(f"Received post_id: {post_id}")  # Debug print

    # Assuming post_id is a UUID and stored as a string in MongoDB
    try:
        result = list(db.reviews_list.find({'post_id': post_id}, {'_id': 0}))
    except Exception as e:
        print(f"Error querying database: {e}")  # Debug print
        return jsonify({'result': 'error', 'data': '서버 오류입니다.'}), 500

    # if not result:
        # return jsonify({'result': 'error', 'data': '댓글을 찾을 수 없습니다.'}), 404

    reviews = [review for review in result]

    return jsonify({'result': 'success', 'data': reviews})

# WRITE/REVIEW 
# FE 에서 data 로 post_id 받아옴 
# review 에 필요한 것; 작성자 author_id, 내용 reviewDesc
# DB 에 넣을 것; post_id, 작성자 author_id, 내용 reviewDesc
# URL 이랑 DB 이름 둘 다 s 있음
@app.route('/api/write/reviews', methods=['POST'])
def post_review(): 
    post_id = request.form['post_id']
    # authod_id = request.form['authod_id']
    token_receive = request.cookies.get("mytoken")

    # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
    payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
    author_id = payload["id"]
    reviewDesc = request.form['reviewDesc']

    if not reviewDesc:
        return jsonify({'result': 'error', 'data': ' 댓글을 입력하세요 '})

    doc = {
        'post_id': post_id,
        'author_id': author_id,
        'reviewDesc': reviewDesc
    }

    db.reviews_list.insert_one(doc) # review DB 별도 생성
    return jsonify({'result': 'success', 'data': doc})


# 참여하기 버튼
@app.route("/api/parti", methods=["POST"])
def participate():
    post_id = request.form["post_id"]

    # 브라우저의 쿠키에서 유저 토큰 가져오기.
    token_receive = request.cookies.get("mytoken")
    # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
    payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
    user_id = payload["id"]

    # 참여하기 알람 추가
    author_find = post_collection.find_one({"post_id": post_id})
    author_id = author_find["author_id"]
    author_data_find = login_collection.find_one({"user_id" : author_id})
    title = author_find["title"]
    author_alarm_list = author_data_find["alarm"]
    print(author_alarm_list)
    author_alarm_list.append({"title": title, "isJoin" : 1, "user_id": user_id})
    login_collection.update_one({"user_id":author_id},{"$set": {"alarm" : author_alarm_list}})

    find_user = login_collection.find_one({"user_id":user_id})

    user_parti_list = list(find_user["user_parti"])
    if not post_id in user_parti_list:
        user_parti_list.append(post_id)
        login_collection.update_one({"user_id" : user_id}, {"$set":{"user_parti": user_parti_list}})
        return jsonify({'result': 'success'})
    return jsonify({"result": "failure"})

# 참여하기 취소 버튼
@app.route("/api/parti-cancel", methods=["POST"])
def participate_cancel():
    post_id = request.form["post_id"]

    # 브라우저의 쿠키에서 유저 토큰 가져오기.
    token_receive = request.cookies.get("mytoken")
    # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
    payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
    user_id = payload["id"]

    # 참여하기 알람 추가
    author_find = post_collection.find_one({"post_id": post_id})
    author_id = author_find["author_id"]
    author_data_find = login_collection.find_one({"user_id" : author_id})
    print(author_data_find)
    title = author_find["title"]
    author_alarm_list = list(author_data_find["alarm"]).append({"title": title, "isJoin" : 0, "user_id": user_id})
    login_collection.update_one({"user_id":author_id},{"$set": {"alarm" : author_alarm_list}})

    find_user = login_collection.find_one({"user_id":user_id})

    user_parti_list = list(find_user["user_parti"])
    user_parti_list.remove(post_id)
    login_collection.update_one({"user_id" : user_id}, {"$set":{"user_parti": user_parti_list}})

    return jsonify({'result': 'success'})

# 알람 확인 버튼
@app.route("/api/alarm", methods=["GET"])
def alarm():
    # 브라우저의 쿠키에서 유저 토큰 가져오기.
    token_receive = request.cookies.get("mytoken")
    # 시크릿 키와 보안 알고리즘으로 전달 받은 토큰을 Decoding 한다.
    payload = jwt.decode(token_receive, "Secret Key", algorithms = ["HS256"])
    user_id = payload["id"]

    find_data = login_collection.find_one({"user_id" : user_id})
    alarm_list = list(find_data["alarm"])

    return jsonify({"result" : "success", "data": alarm_list})


if __name__ == '__main__':
    print(sys.executable)
    app.run('0.0.0.0', port = 5000, debug = True)
