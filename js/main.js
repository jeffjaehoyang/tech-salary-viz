/*
 *    main.js
 */

// global variables
let allCalls;
let calls;
let nestedCalls;
let donut;
let revenueBar;
let durationBar;
let unitBar;
let stackedArea;
let timeline;
let scatterPlot;

const parseTime = d3.timeParse("%d/%m/%Y");
const formatTime = d3.timeFormat("%d/%m/%Y");

d3.csv("data/tech_salary_data.csv").then((data) => {
  data.forEach((d) => {
    if (d.totalyearlycompensation <= 30000) {
      console.log("TC below 30k");
    }
    d.totalyearlycompensation = Number(d.totalyearlycompensation);
    d.yearsofexperience = Number(d.yearsofexperience);
    d.yearsatcompany = Number(d.yearsatcompany);
    d.timestamp = parseTime(d.timestamp);
    d.basesalary = Number(d.basesalary);
    d.stockgrantvalue = Number(d.stockgrantvalue);
    d.bonus = Number(d.bonus);
  });
  console.log("data: ", data);

  allCalls = data;
  // calls = data;
  scatterPlot = new ScatterPlot("#main-scatter-plot");

  // nestedCalls = d3
  //   .nest()
  //   .key((d) => d.category)
  //   .entries(calls);

  // donut = new DonutChart("#company-size");
  // revenueBar = new BarChart(
  //   "#revenue",
  //   "call_revenue",
  //   "Average call revenue (USD)"
  // );
  // durationBar = new BarChart(
  //   "#call-duration",
  //   "call_duration",
  //   "Average call duration (seconds)"
  // );
  // unitBar = new BarChart("#units-sold", "units_sold", "Units sold per call");
  // stackedArea = new StackedAreaChart("#stacked-area");
  // timeline = new Timeline("#timeline");
});

// $("#var-select").on("change", () => {
//   stackedArea.wrangleData();
//   timeline.wrangleData();
// });

function brushed() {
  const selection = d3.event.selection || timeline.x.range();
  const newValues = selection.map(timeline.x.invert);
  changeDates(newValues);
}

function changeDates(values) {
  calls = allCalls.filter((d) => d.date > values[0] && d.date < values[1]);

  nestedCalls = d3
    .nest()
    .key((d) => d.category)
    .entries(calls);

  $("#dateLabel1").text(formatTime(values[0]));
  $("#dateLabel2").text(formatTime(values[1]));

  donut.wrangleData();
  revenueBar.wrangleData();
  unitBar.wrangleData();
  durationBar.wrangleData();
  stackedArea.wrangleData();
}
