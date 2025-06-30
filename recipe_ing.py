from ollama import chat
from ollama import ChatResponse
import json


def recipe(dish : str):
  response: ChatResponse = chat(model='spark', format='json',messages=[
  {
    'role': 'user',
    'content': f'{dish}'
  },
])
  return json.JSONDecoder().decode(response.message.content)
    

if __name__ == '__main__':
    result = recipe('Butter Chicken')
    print("\n\nParsed JSON Result:\n", result)
