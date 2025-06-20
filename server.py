import flask
from flask_cors import CORS
import json
from flask_cors import CORS  
from recipe_ing import recipe
from listings import recipe_listings
from urllib.parse import unquote

app = flask.Flask('test')
CORS(app,allow_headers='*')

@app.route('/api/recipe/<dish>',methods =['GET'])
def show_recipe(dish):
    result = recipe(dish)
    return result


@app.route('/api/recipe_listings/<dish>',methods =['GET'])
def recipe_links(dish):
    result = recipe_listings(unquote(dish))

    return result

if __name__ == '__main__':
    app.run(debug=True)