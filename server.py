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

ingredient_count = db['ingredient_count']

dish_count = db['dish_count']

def update_ingredient_stats(ingredient : str):
    ingredient = ingredient.lower()

    

        
    query = list(ingredient_count.find({'ingredient' : ingredient}))
    
    if not len(query):
        ingredient_count.insert_one({'ingredient' :ingredient , 'quantity' : 1})
    else:
        ingredient_count.update_one({'ingredient' : ingredient},{'$inc' : {'quantity' :1}})

def update_dish_stats(dish : str):
    dish = dish.lower().strip()

    query = list(dish_count.find({'dish' : dish}))
   
    if not len(query):
        dish_count.insert_one({'dish' :dish , 'quantity' : 1})
        
    else:
        
        dish_count.update_one({'dish' : dish},{'$inc' : {'quantity' :1}})




app = flask.Flask('test')
CORS(app,allow_headers='*')

@app.route('/api/dishstat',methods =['GET'])
def show_dish_stat():
    print(list(dish_count.find({},{'_id' : 0})))
    return list(dish_count.find({},{'_id' : 0}))

@app.route('/api/ingredientstat',methods =['GET'])
def show_ingredient_stat():
    print(list(ingredient_count.find({},{'_id' : 0})))
    return list(ingredient_count.find({},{'_id' : 0}))

@app.route('/api/recipe/<dish>',methods =['GET'])
def show_recipe(dish):
    result = recipe(dish)
    return result


@app.route('/api/recipe_listings/<dish>',methods =['GET'])
def recipe_links(dish : str):
    print(time())
    query = list(col.find({'dish' : dish.lower()}))
    print(query)
    
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
        pool.map(update_ingredient_stats,list(chain(*[ingredient_processing(i['name']) for i in result['ingredients'] ])))
    return result

if __name__ == '__main__':
    app.run(debug=True , use_reloader = False)