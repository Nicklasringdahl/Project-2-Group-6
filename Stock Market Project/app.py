import requests
from config import *
from flask import Flask
from flask import jsonify


from yahoo_scrape import active_stocks

app = Flask(__name__)

@app.route('/tickers')
def get_tickers():
    return jsonify(active_stocks())


@app.route('/tickerinfo/<ticker>/<from_date>/<to_date>')
def get_ticker_info_by_date(ticker, from_date, to_date):
    to_date = to_date[:-1]
    advanced_url = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/day/" + from_date + "/" + to_date + "?adjusted=true&sort=asc&limit=120&apiKey=" + api_key

    response = requests.get(advanced_url)

    json = response.json()
    return json


app.run('127.0.0.1', 5000)