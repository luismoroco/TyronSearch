import requests
from bs4 import BeautifulSoup
import json
import os

##validacion
visited_urls = set()

UNIQUE_ID = '1001'

def get_wikipedia_info(url, max_words=150):
    global UNIQUE_ID
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        title = soup.find('title').text.strip()

        links = [a['href'] for a in soup.find_all('a', href=True)]

        base_url = 'https://en.wikipedia.org'
        full_links = [base_url + link for link in links if link.startswith('/wiki/')]

        paragraphs = [p.text.strip() for p in soup.find_all('p')]

        page_info = {
            "id": UNIQUE_ID,
            "url": url,
            "title": title,
            "text": "\n\n".join(paragraphs),
            # "hyperlinks": full_links
        }

        UNIQUE_ID = str(int(UNIQUE_ID) + 1)

        return page_info, full_links
    else:
        print(f'Error al obtener la página: {url}')
        return None

# Función para cargar URLs visitadas desde archivos JSON existentes
def load_visited_urls():
    for filename in os.listdir('./outputs/'):
        if filename.startswith('output_'):
            with open(f'/outputs/{filename}', 'r', encoding='utf-8') as file:
                data = json.load(file)
                visited_urls.add(data["url"])

# Cargar las URLs visitadas
load_visited_urls()

#####SEED
start_url = 'https://en.wikipedia.org/wiki/Materia'


max_depth = 3 #profunidad 


id_page = 0
cont_per_page = 20

def recursive_extraction_info(start_url, depth):
    global id_page, cont_per_page
    if depth <= 0:
        return []

    page_info, full_links = get_wikipedia_info(start_url)
    if page_info is None:
        return []

    sub_links = []

    for link in full_links:
        sub_links.extend(recursive_extraction_info(link, depth - 1))
    
    if(cont_per_page>0):
        json_objects = []
        json_objects.append(page_info)
        

        with open(f'outputs/output_{id_page}', 'a', encoding='utf-8') as file:
            if os.path.getsize(f'outputs/output_{id_page}') == 0:
                file.write('')
            else:
                file.write('\n')

            for i, json_object in enumerate(json_objects):
                json.dump(json_object, file, ensure_ascii=False, indent=4)
                # if i < len(json_objects) - 1:
                #     file.write(',') 
                
        cont_per_page = cont_per_page - 1

    elif(cont_per_page == 0):
        cont_per_page = 20
        # with open(f'outputs/output_{id_page}', 'a', encoding='utf-8') as file:
        #     file.write(']')
        id_page = id_page+1

    return [page_info] + sub_links

result = recursive_extraction_info(start_url, max_depth)

# print('Lo logro senior, Lo logre? Lo logro')
print('Finish successfully')