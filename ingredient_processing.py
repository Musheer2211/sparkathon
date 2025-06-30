import re

def ingredient_processing(ingredient):
    ret_list = []
    if '(' in ingredient and ')' in ingredient:
        main_ingredient = ingredient[0:ingredient.index('(')]
        rest_of_ingredient = ingredient[ingredient.index('(')+1:ingredient.index(')')]
        ret_list = re.split(' or |,',rest_of_ingredient)
            
        return [main_ingredient.strip().lower() + f' {i.strip().lower()}' for i in ret_list]
    else:
        return [ingredient.strip().lower(),]
    
if __name__ == '__main__':
    print(ingredient_processing('Pasta (Sappegetti or Fetticuni or sda , 324)'))