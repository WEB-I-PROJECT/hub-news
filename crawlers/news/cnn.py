from bs4 import BeautifulSoup
from mongo.models import Analytic
from datetime import datetime

class CNNCrawler(Analytic):
    
    def __init__(self, _id) -> None:
        super().__init__(_id)
        self.url = 'https://www.cnnbrasil.com.br/?s='
        self.origin = 'cnn'
    
        self.news_link = self.make_tag_reference('a', 'home__list__tag')
        
        self.title = self.make_tag_reference('h1', 'post__title')
        self.content = self.make_tag_reference('div', 'post__content')
        self.tags = self.make_tag_reference('li', 'tags__list__item')
        self.date = self.make_tag_reference('span', 'post__data')
        self.image = self.make_tag_reference('div', 'posts col__list')
        
    def format_date(self, original_text: str):
        part = original_text.text.split(" | Atualizado ")
        date_str, hour_str = part[0].split(" às ")
        print(f"{date_str.removeprefix(' ') } {hour_str}")
        return datetime.strptime(f"{date_str.strip()} {hour_str.strip()}", "%d/%m/%Y %H:%M")
