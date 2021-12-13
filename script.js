function init() {
  document.getElementById("fromDate").valueAsDate = new Date();

  fetch("http://127.0.0.1:5000/")
    .then((response) => response.json())
    .then((data) => fillTickerDropDown(data))
    .catch((error) => {
      console.log("Error: ", error);
    });
}

function fillTickerDropDown(dataSet) {
  let dropdown = d3.select("#tickerDropdown");

  dropdown.append("option").text("").property("value", "");
  dataSet.forEach((data) => {
    dropdown.append("option").text(data).property("value", data);
  });
}

function getTickerInfo(ticker, fromDate, toDate) {
  let parameters = `${ticker}/${fromDate}/${toDate}`;
  fetch("http://127.0.0.1:5000/tickerinfo/" + new URLSearchParams(parameters))
    .then((response) => response.json())
    .then((data) => getStockInfo(data))
    .catch((error) => {
      console.log("Error: ", error);
    });
}

function getGoogleNews(ticker) {
  fetch("http://127.0.0.1:5000/news/" + new URLSearchParams(ticker))
    .then((response) => response.json())
    .then((news) => fillNewsParagraph(news))
    .catch((error) => {
      console.log("Error: ", error);
    });
}

function fillNewsParagraph(news) {
  let p = document.getElementById("news");
  p.innerHTML = news;
}

function getStockInfo(data) {
  let records = data.results;
  if (!records) return;

  let jsonRecords = JSON.stringify(records);

  console.log(JSON.stringify(records));

  records.forEach((ticker) => {
    let tickerJson = JSON.stringify(ticker);
    console.log(tickerJson);
  });
}

window.onload = function () {
  var dataPoints1 = [],
    dataPoints2 = [];
  var stockChart = new CanvasJS.StockChart("chartContainer", {
    theme: "light2",
    charts: [
      {
        title: {
          text: "Bitcoin Price in USD",
        },
        axisY: {
          prefix: "$",
        },
        data: [
          {
            type: "candlestick",
            yValueFormatString: "$#,###.##",
            dataPoints: dataPoints1,
          },
        ],
      },
      {
        title: {
          text: "Bitcoin Volume",
        },
        data: [
          {
            dataPoints: dataPoints2,
          },
        ],
      },
    ],
    navigator: {
      data: [
        {
          dataPoints: dataPoints2,
        },
      ],
      slider: {
        minimum: new Date(2018, 05, 01),
        maximum: new Date(2018, 09, 01),
      },
    },
  });
  $.getJSON("https://canvasjs.com/data/docs/btcusd2018.json", function (data) {
    for (var i = 0; i < data.length; i++) {
      dataPoints1.push({
        x: new Date(data[i].date),
        y: [
          Number(data[i].open),
          Number(data[i].high),
          Number(data[i].low),
          Number(data[i].close),
        ],
      });
      dataPoints2.push({
        x: new Date(data[i].date),
        y: Number(data[i].volume_btc),
      });
    }
    stockChart.render();
  });
};

function inputValueChangted() {
  let duration = document.getElementById("durationDropdown").value;
  let fromDateValue = document.getElementById("fromDate").value;
  let toDate = document.getElementById("toDate");
  let startDate = new Date(fromDateValue);
  let day = 60 * 60 * 24 * 1000;

  let endDate;

  switch (duration) {
    case "oneDay":
      endDate = new Date(startDate.getTime() + day);
      break;
    case "oneWeek":
      endDate = new Date(startDate.getTime() + day * 7);
      break;
    case "oneMonth":
      endDate = new Date(startDate.getTime() + day * 30);
      break;
    case "threeMonths":
      endDate = new Date(startDate.getTime() + day * 90);
      break;
    case "sixMonths":
      endDate = new Date(startDate.getTime() + day * 183);
      break;
    case "oneYear":
      endDate = new Date(startDate.getTime() + day * 365);
      break;
  }

  let date =
    endDate.getDate() < 10 ? `0${endDate.getDate()}` : `${endDate.getDate()}`;

  toDate.value = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${date}`;

  let ticker = document.getElementById("tickerDropdown").value;

  if (ticker && ticker !== "") {
    getGoogleNews(ticker);
  }

  if (ticker && fromDateValue && toDate.value) {
    getTickerInfo(ticker, fromDateValue, toDate.value);
  }
}

(function () {
  init();
})();
