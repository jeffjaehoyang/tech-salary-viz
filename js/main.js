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

function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

d3.csv("data/tech_salary_data.csv").then((data) => {
  data.forEach((d) => {
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
  companyNames = allCalls.map((d) => upperCaseFirstLetter(d.company));
  uniqueCompanyNames = [...new Set(companyNames)];
  // calls = data;
  scatterPlot = new ScatterPlot("#main-scatter-plot");

  initDropdown();
});

function initDropdown() {
  const $dropdown = $("#var-select");
  $.each(uniqueCompanyNames, function (i, companyName) {
    console.log("appending options...");
    $dropdown.append(`<option value="${companyName}">${companyName}</option>`);
  });
  $dropdown.selectpicker("refresh");
}
