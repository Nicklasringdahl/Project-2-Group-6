window.onload = function () {
  var dps1 = [],
    dps2 = [];
  var stockChart = new CanvasJS.StockChart("chartContainer", {
    title: {
      text: "Stock chart",
    },

    theme: "light2",
    exportEnabled: true,
    charts: [
      {
        axisY: {
          prefix: "$",
          crosshair: {
            enabled: true,
          },
        },

        legend: {
          verticalAlign: "top",
          horizontalAlign: "left",
          cursor: "pointer",
          itemclick: function (e) {
            if (
              typeof e.dataSeries.visible === "undefined" ||
              e.dataSeries.visible
            ) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            e.chart.render();
          },
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            type: "candlestick",
            showInLegend: true,
            name: "Stock Price",
            yValueFormatString: "$#,###.00",
            dataPoints: dps1,
          },
        ],
      },
      {
        title: {
          text: "Test",
        },
        data: [
          {
            dataPoints: dps2,
          },
        ],
      },
    ],
    navigator: {
      data: [
        {
          dataPoints: dps2,
        },
      ],
      slider: {
        minimum: new Date(2018, 03, 01),
        maximum: new Date(2018, 05, 01),
      },
    },
  });
  $.getJSON("https://canvasjs.com/data/docs/ethusd2018.json", function (data) {
    for (var i = 0; i < data.length; i++) {
      dps1.push({
        x: new Date(data[i].date),
        y: [
          Number(data[i].open),
          Number(data[i].high),
          Number(data[i].low),
          Number(data[i].close),
        ],
      });
      dps2.push({ x: new Date(data[i].date), y: Number(data[i].close) });
    }
    stockChart.render();
    jQuery("#sma").on("change", function () {
      for (var i = 0; i < stockChart.charts[0].data.length; i++) {
        if (stockChart.charts[0].data[i].name === "Simple Moving Average") {
          stockChart.charts[0].data[i].remove();
          return;
        }
      }
      var sma = calculateSMA(dps1, 7);
      stockChart.charts[0].addTo("data", {
        type: "line",
        dataPoints: sma,
        showInLegend: true,
        yValueFormatString: "$#,###.00",
        name: "Simple Moving Average",
      });
    });
    jQuery("#ema").on("change", function () {
      for (var i = 0; i < stockChart.charts[0].data.length; i++) {
        if (stockChart.charts[0].data[i].name === "EMA") {
          stockChart.charts[0].data[i].remove();
          return;
        }
      }
      var ema = calculateEMA(dps1, 7);
      stockChart.charts[0].addTo("data", {
        type: "line",
        name: "EMA",
        showInLegend: true,
        yValueFormatString: "$#,###.##",
        dataPoints: ema,
      });
    });
    jQuery("#macd").on("change", function () {
      if (stockChart.charts.length > 1) {
        stockChart.options.charts.pop();
        stockChart.render();
        return;
      }
      var ema12 = calculateEMA(dps1, 12),
        ema26 = calculateEMA(dps1, 26),
        macd = [],
        ema9;
      for (var i = 0; i < ema12.length; i++) {
        macd.push({ x: ema12[i].x, y: ema12[i].y - ema26[i].y });
      }
      var ema9 = calculateEMA(macd, 9);
      stockChart.addTo("charts", {
        height: 100,
        data: [
          {
            type: "line",
            name: "MACD",
            showInLegend: true,
            yValueFormatString: "#,###.00",
            dataPoints: macd,
          },
        ],
        legend: { horizontalAlign: "left" },
        toolTip: { shared: true },
      });
      stockChart.charts[1].addTo("data", {
        type: "line",
        name: "Signal",
        showInLegend: true,
        yValueFormatString: "#,##0.00",
        dataPoints: ema9,
      });
    });
  });
  function calculateSMA(dps, count) {
    var avg = function (dps) {
      var sum = 0,
        count = 0,
        val;
      for (var i = 0; i < dps.length; i++) {
        val = dps[i].y[3];
        sum += val;
        count++;
      }
      return sum / count;
    };
    var result = [],
      val;
    count = count || 5;
    for (var i = 0; i < count; i++) result.push({ x: dps[i].x, y: null });
    for (var i = count - 1, len = dps.length; i < len; i++) {
      val = avg(dps.slice(i - count + 1, i));
      if (isNaN(val)) result.push({ x: dps[i].x, y: null });
      else result.push({ x: dps[i].x, y: val });
    }
    return result;
  }
  function calculateEMA(dps, count) {
    var k = 2 / (count + 1);
    var emaDps = [{ x: dps[0].x, y: dps[0].y.length ? dps[0].y[3] : dps[0].y }];
    for (var i = 1; i < dps.length; i++) {
      emaDps.push({
        x: dps[i].x,
        y:
          (dps[i].y.length ? dps[i].y[3] : dps[i].y) * k +
          emaDps[i - 1].y * (1 - k),
      });
    }
    return emaDps;
  }
};

// create data
var data = [
  {
    name: "European Union - Top 10 Most Populated Countries",
    children: [
      { name: "Belgium", value: 11443830 },
      { name: "France", value: 64938716 },
      { name: "Germany", value: 80636124 },
      { name: "Greece", value: 10892931 },
      { name: "Italy", value: 59797978 },
      { name: "Netherlands", value: 17032845 },
      { name: "Poland", value: 38563573 },
      { name: "Romania", value: 19237513 },
      { name: "Spain", value: 46070146 },
      { name: "United Kingdom", value: 65511098 },
    ],
  },
];

// create a chart and set the data
chart = anychart.treeMap(data, "as-tree");

// set the container id
chart.container("chartContainer2");

// initiate drawing the chart
chart.draw();
