from bs4.element import SoupStrainer
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import requests

root ="https://www.google.com/"

variable = "Carnival%20Corporation%20&%20plc"

link = f"https://www.google.com/search?q={variable}&tbm=nws&sxsrf=AOaemvK8YyIzs1qaXyZ84_lEcTJ_prropA:1638866843368&source=lnt&tbs=qdr:d&sa=X&ved=2ahUKEwjooKHgptH0AhVIxzgGHYKrBokQpwV6BAgBECE&biw=1371&bih=937&dpr=1"


req = Request(link, headers= {'User-Agent': 'Mozilla/5.0'})

webpage = urlopen(req).read()

with requests.Session() as c:
    soup = BeautifulSoup(webpage, 'html5lib')
    # print(soup)

for item in soup.find_all('div', attrs={'class': 'ZINbbc xpd O9g5cc uUPGi'}):
    raw_link = item.find('a', href=True)['href']
    link = (raw_link.split("/url?q=")[1]).split('&sa=U&')[0]

    title = (item.find('div', attrs= {'class': 'BNeawe vvjwJb AP7Wnd'}).get_text())

    descriptionTime = (item.find('div', attrs= {'class': 'BNeawe s3v9rd AP7Wnd'}).get_text())
    time = descriptionTime.split(" · ")[0]
    description = descriptionTime.split(" · ")[1]
    print(title)
    print(link)
    print(time)
    print(description)


    # document = open("data.csv", "a")
    # document.wriate("{}, {}, {}, {}\n")


# mCBkyc tNxQIb y355M JIFdL JQe2Ld nDgy9d = for title

# BNeawe vvjwJb AP7Wnd