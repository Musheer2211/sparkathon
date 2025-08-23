from ollama import chat
from ollama import ChatResponse
import json
import requests
from urllib.parse import quote
import time
from multiprocessing import Pool

from recipe_ing import recipe

params = {
    "apikey": "add key",
    'tld' : '.com'
}

def exist_check(x):
    return x if x else None

def fetch(url : str) -> dict:
    response = requests.get(url,params)
    try:
        data : dict= json.JSONDecoder().decode(response.text)
    except json.decoder.JSONDecodeError:
        print(url)
        print(response.text)
        return []
    ret_list = []
    try:
        for product in data['products_list']:
            # print(product.keys())
            listing = {
                'product_url' : product['product_url'] if 'product_url' in product else None,
                'price' : product['product_price'] if 'product_price' in product else None,
                'currency_symbol' : product["price_currency_symbol"] if 'price_currency_symbol' in product else None,
                'image_url' : product['product_image'] if 'product_image' in product else None,
                'rating' : product['rating_score'] if 'rating_score' in product else None
            }
            ret_list.append(listing)
            if len(ret_list) >= 3:
                break
    except KeyError:
        print(data)
    
    return ret_list




def recipe_listings(dish : str):
    print(time.time())
    rec = recipe(dish=dish)
    print(time.time())
    urls = [f"https://ecommerce.api.zenrows.com/v1/targets/walmart/discovery/{quote(ingredient['name'])}" for ingredient in rec['ingredients']]
    with Pool(processes=8) as pool:
        listings = pool.map(fetch,urls)
        for i in range(len(listings)):
            
            rec['ingredients'][i]['listings'] = listings[i]


    print(time.time())
    return rec

    

if __name__ == '__main__':
    recipe_listings('White Sauce Pasta')
