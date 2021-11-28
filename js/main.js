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
let uniqueCompanyNames;
let uniquePositionNames;

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

  allCalls = data;

  companyNames = allCalls.map((d) => upperCaseFirstLetter(d.company));
  uniqueCompanyNames = [...new Set(companyNames)];

  positionNames = allCalls.map((d) => upperCaseFirstLetter(d.title));
  uniquePositionNames = [...new Set(positionNames)];

  scatterPlot = new ScatterPlot("#main-scatter-plot");
  initDropdown();
});

$("#company-select").on("change", () => {
  scatterPlot.wrangleData();
});

$("#position-select").on("change", () => {
  scatterPlot.wrangleData();
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
}
