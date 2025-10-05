# app.py

# 1. Import the Flask class
from flask import Flask

# 2. Create an instance of the Flask class
# __name__ is a built-in variable that tells Flask where to look for resources
app = Flask(__name__)

# 3. Define a route (URL path)
@app.route('/')
def hello_world():
    # 4. Return the content to be displayed in the browser
    return 'Hello, Flask World!'

# 5. Optional: Run the application directly (for development)
if __name__ == '__main__':
    app.run(debug=True)