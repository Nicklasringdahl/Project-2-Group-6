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
  var output = d3.select("#newsArticle");
  Object.entries(news).forEach(function ([key, value]) {
    var li = output.append("li").text(`${key}: ${value}`);
  });
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
          text: "Stock Price",
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
          text: "Volume",
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
  var chart = new CanvasJS.Chart("bubbles", {
    animationEnabled: true,
    title: {
      text: "Most Searched Stocks",
    },
    axisX: {
      title: "",
    },
    axisY: {
      title: "Number of articles",
      includeZero: true,
    },
    legend: {
      horizontalAlign: "left",
    },
    data: [
      {
        type: "bubble",
        showInLegend: true,
        legendText: "Size of Bubble Represents amount of relevant articles",
        legendMarkerType: "circle",
        legendMarkerColor: "grey",

        dataPoints: [
          //{ x: 68.3, y: 2.4, z: 1309.05 , name: "India"},
          //{ x: 76, y: 1.57, z:1371.22, name: "China"},
          { x: 78.7, y: 1.84, z: 320.896, name: "US" },
          { x: 69.1, y: 2.44, z: 258.162, name: "Indonesia" },
          { x: 74.7, y: 1.78, z: 225.962, name: "Brazil" },
          { x: 76.9, y: 2.21, z: 125.89, name: "Mexico" },
          { x: 53, y: 5.59, z: 181.181, name: "Nigeria" },
          { x: 70.9, y: 1.75, z: 144.096, name: "Russia" },
          { x: 83.8, y: 1.46, z: 127.141, name: "Japan" },
          { x: 82.5, y: 1.83, z: 23.789, name: "Australia" },
          { x: 71.3, y: 3.31, z: 93.778, name: "Egypt" },
          { x: 81.6, y: 1.81, z: 65.128, name: "UK" },
          { x: 62.1, y: 4.26, z: 47.236, name: "Kenya" },
          { x: 69.6, y: 4.51, z: 36.115, name: "Iraq" },
          { x: 60.7, y: 4.65, z: 33.736, name: "Afganistan" },
          { x: 52.7, y: 6, z: 27.859, name: "Angola" },
          { x: 68.4, y: 2.94, z: 101.716, name: "Philippines" },
          { x: 70, y: 2.17, z: 28.656, name: "Nepal" },
          { x: 71.2, y: 1.51, z: 45.154, name: "Ukrain" },
          { x: 83.4, y: 1.62, z: 46.447, name: "Spain" },
          { x: 64.6, y: 4.28, z: 99.873, name: "Ethiopia" },
          { x: 74.6, y: 1.5, z: 68.65, name: "Thailand" },
          { x: 74.2, y: 1.88, z: 48.228, name: "Colombia" },
          { x: 74.44, y: 2.34, z: 31.155, name: "Venezuela" },
          { x: 57.4, y: 2.34, z: 55, name: "South Africa" },
          { x: 59.2, y: 3.86, z: 15.77, name: "Zimbabwe" },
          { x: 55.9, y: 4.63, z: 22.834, name: "Cameroon" },
        ],
      },
    ],
  });
  chart.render();
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
