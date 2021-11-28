/*
 *    main.js
 */

// global variables
let allCalls;
let calls;
let stackedArea;
let timeline;
let scatterPlot;

let positionNames;
let companyNames;
let cityNames;
let uniqueCompanyNames;
let uniquePositionNames;
let uniqueCityNames;

d3.csv("data/tech_salary_data.csv").then((data) => {
  data.forEach((d) => {
    d.totalyearlycompensation = Number(d.totalyearlycompensation);
    d.yearsofexperience = Number(d.yearsofexperience);
    d.yearsatcompany = Number(d.yearsatcompany);
    d.timestamp = parseTime(d.timestamp);
    d.basesalary = Number(d.basesalary);
    d.stockgrantvalue = Number(d.stockgrantvalue);
    d.bonus = Number(d.bonus);
    d.company = upperCaseFirstLetter(d.company);
    d.title = upperCaseFirstLetter(d.title);
    d.location = parseCityName(d.location);
  });

  allCalls = data;

  companyNames = allCalls.map((d) => upperCaseFirstLetter(d.company));
  uniqueCompanyNames = [...new Set(companyNames)];

  positionNames = allCalls.map((d) => upperCaseFirstLetter(d.title));
  uniquePositionNames = [...new Set(positionNames)];

  cityNames = allCalls.map((d) => d.location);
  uniqueCityNames = [...new Set(cityNames)];

  scatterPlot = new ScatterPlot("#main-scatter-plot");
  initDropdown();
});

// bunch of event handlers ...

$("#company-select").on("change", () => {
  scatterPlot.wrangleData();
  scatterPlot.groupCompany();
  scatterPlot.updateVis();
});

$("#company-reset").on("click", () => {
  scatterPlot.resetCompany();
  scatterPlot.updateVis();
});

$("#company-group").on("click", () => {
  scatterPlot.groupCompany();
  scatterPlot.updateVis();
});

$("#position-select").on("change", () => {
  scatterPlot.wrangleData();
  scatterPlot.groupPosition();
  scatterPlot.updateVis();
});

$("#position-reset").on("click", () => {
  scatterPlot.resetPosition();
  scatterPlot.updateVis();
});

$("#position-group").on("click", () => {
  scatterPlot.groupPosition();
  scatterPlot.updateVis();
});

$("#city-select").on("change", () => {
  scatterPlot.wrangleData();
  scatterPlot.groupLocation();
  scatterPlot.updateVis();
});

$("#city-reset").on("click", () => {
  scatterPlot.resetLocation();
  scatterPlot.updateVis();
});

$("#city-group").on("click", () => {
  scatterPlot.groupLocation();
  scatterPlot.updateVis();
});

function initDropdown() {
  const $companyDropdown = $("#company-select");
  $.each(uniqueCompanyNames, function (i, companyName) {
    $companyDropdown.append(
      `<option value="${companyName}">${companyName}</option>`
    );
  });
  $companyDropdown.selectpicker("refresh");

  const $positionDropdown = $("#position-select");
  $.each(uniquePositionNames, function (i, positionName) {
    $positionDropdown.append(
      `<option value="${positionName}">${positionName}</option>`
    );
  });
  $positionDropdown.selectpicker("refresh");

  const $cityDropdown = $("#city-select");
  $.each(uniqueCityNames, function (i, cityName) {
    $cityDropdown.append(`<option value="${cityName}">${cityName}</option>`);
  });
  $cityDropdown.selectpicker("refresh");
}
