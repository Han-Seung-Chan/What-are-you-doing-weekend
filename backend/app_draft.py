from flask import Flask, Blueprint, request, jsonify, render_template, render_template_string
from jinja2 import Template
import os
app = Flask(__name__)

from pymongo import MongoClient
from bson import ObjectId
client = MongoClient('localhost:27017')
db = client.dbjungle

import uuid
import datetime
from bson.json_util import dumps

from flask.json.provider import JSONProvider
import json
import sys
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

@app.route('/write')
def home():
    # return render_template('write.html')
    directory = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(directory, 'write.html')

    with open(template_path, 'r', encoding='utf-8') as file:
        template_content = file.read()

    template = Template(template_content)
    rendered_template = template.render(variable1="value1", variable2="value2")

    return rendered_template

@app.route('/write', methods=['POST'])
def post_schedule():
    title = request.form['title']
    scheduled_time = request.form['scheduled_time']
    description = request.form['description']
    participant = request.form.getlist('participant')
    author_id = '뭐하니'

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


@app.route('/list')
def test():
    directory = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(directory, 'list.html')

    with open(template_path, 'r', encoding='utf-8') as file:
        template_content = file.read()

    template = Template(template_content)
    rendered_template = template.render(variable1="value1", variable2="value2")

    return rendered_template

@app.route('/api/list', methods=['GET'])
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
    
 
# @app.route('/view', methods=['GET'])
# # Get view 에서는 게시글의 상세 정보 + 댓글 출력
# # GET 으로 post_id 를 받아오기, 
# # DB 에서 post_id 를 찾아보기, 없으면 Error MSG 출력 
# def view_detail():
#     post_id = request.args.get('post_id')
#     if not post_id:
#         return jsonify({"result": "error", "message":" 해당 약속이 없습니다 "}), 400
    
#     post = db.schedules.find_one({'post_id': post_id})
#     if not post:
#         return jsonify({"message": " 해당 약속을 찾을 수 없습니다 "}), 404

#     return jsonify({ 
#             'result': 'success',
#             'post_id': post['post_id'],
#             'title': post['title'],
#             'scheduled_time': post['scheduled_time'],
#             'description': post['description'],
#             'write_time': post['write_time'],
#             'participant': post['participant'],
#             'author_id': post['author_id'],
#             # 'comments': comments
#         })


app.run(port=5001, debug=True)
