from bs4.element import SoupStrainer
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import requests
from lxml import html
import json

def get_google_news(ticker):
    ticker = ticker[:-1]
    link = f"https://www.google.com/search?q=nyse+{ticker}&tbm=nws&sxsrf=AOaemvLAGr6H4slKdPayoZBiYHPE_WXwcA:1639289339574&source=lnt&tbs=qdr:d&sa=X&ved=2ahUKEwiBpZPWzN30AhVJaN4KHXnJBq0QpwV6BAgBECE&biw=1920&bih=937&dpr=1"

    req = Request(link, headers= {'User-Agent': 'Mozilla/5.0'})

    webpage = urlopen(req).read()

    with requests.Session() as c:
        soup = BeautifulSoup(webpage, 'html5lib')
        # print(soup)

    titles = []
    links = []
    times = []
    descriptions =[]
    title = ""

    for item in soup.find_all('div', attrs={'class': 'ZINbbc xpd O9g5cc uUPGi'}):
        try:
            raw_link = item.find('a', href=True)['href']
            link = (raw_link.split("/url?q=")[1]).split('&sa=U&')[0]

            title = (item.find('div', attrs= {'class': 'BNeawe vvjwJb AP7Wnd'}).get_text())

            descriptionTime = (item.find('div', attrs= {'class': 'BNeawe s3v9rd AP7Wnd'}).get_text())
            time = descriptionTime.split(" · ")[0]
            description = descriptionTime.split(" · ")[1]

        except Exception:
            pass


        titles.append(title)
        links.append(link)
        times.append(time)
        descriptions.append(description)

    zip_iterator = zip(titles, links)
    titles_links_dict = dict(zip_iterator)

    # print(titles_links_dict)

    jsonString = json.dumps(titles_links_dict)

    return jsonString
