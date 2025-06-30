import flask
from flask_cors import CORS
import json
from flask_cors import CORS  
from recipe_ing import recipe
from listings import recipe_listings
from urllib.parse import unquote
from time import time
import pymongo
from multiprocessing import Pool
from itertools import chain
from ingredient_processing import ingredient_processing

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

db = myclient["spark"]

col = db["dish"]

ingredients = db['ingredients']

dish_count = db['dish_count']

def update_ingredient_stats(ingredient : str):
    ingredient = ingredient.lower()

    

        
    query = list(ingredients.find({'ingredient' : ingredient}))
    
    if not len(query):
        ingredients.insert_one({'ingredient' :ingredient , 'quantity' : 1})
    else:
        ingredients.update_one({'ingredient' : ingredient},{'$inc' : {'quantity' :1}})

def update_dish_stats(dish : str):
    dish = dish.lower().strip()

    query = list(dish_count.find({'dish' : dish}))
    print('tf')
    if not len(query):
        dish_count.insert_one({'dish' :dish , 'quantity' : 1})
        print(1)
    else:
        print(2)
        dish_count.update_one({'dish' : dish},{'$inc' : {'quantity' :1}})




app = flask.Flask('test')
CORS(app,allow_headers='*')

@app.route('/api/recipe/<dish>',methods =['GET'])
def show_recipe(dish):
    result = recipe(dish)
    return result


@app.route('/api/recipe_listings/<dish>',methods =['GET'])
def recipe_links(dish : str):
    print(time())
    query = list(col.find({'dish' : dish.lower()}))
    
    if len(query):
        update_dish_stats(dish)

        with Pool(processes=6) as pool:
            pool.map(update_ingredient_stats,list(chain(*[ingredient_processing(i['name']) for i in query[0]['json']['ingredients'] ])))
        return query[0]['json']
    result = recipe_listings(unquote(dish))
    print(time())
    col.insert_one(
        {
            'dish' : dish.lower(),
            'json' : result
        }
    )

    update_dish_stats(dish)

    with Pool(processes=6) as pool:
        pool.map(update_ingredient_stats,list(chain(*[ingredient_processing(i['name']) for i in query[0]['json']['ingredients'] ])))
    return result

if __name__ == '__main__':
    app.run(debug=True , use_reloader = False)