import requests
from flask import Flask, request
import os
from battery import battery_bp

app = Flask(__name__)
username = os.getenv('USERNAME')
password = os.getenv('PASSWORD')
app.register_blueprint(battery_bp)


@app.route('/login', methods=['GET'])
def login():
    response = requests.post(
        'https://monitor.byte-watt.com/api/usercenter/cloud/user/login', 
        json= {
            'username': username,
            'password': password
        }, 
    )

    response.raise_for_status()
    response_data = response.json()
    return response_data.get('data', {}).get('token', '')

if __name__ == '__main__':
    app.run(debug=True)