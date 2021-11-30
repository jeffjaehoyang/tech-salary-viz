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
    d.gender = upperCaseFirstLetter(d.gender);
    d.location = parseCityName(d.location);
  });

  allCalls = data;

  companyNames = allCalls.map((d) => d.company);
  uniqueCompanyNames = [...new Set(companyNames)];

  positionNames = allCalls.map((d) => d.title);
  uniquePositionNames = [...new Set(positionNames)];

  cityNames = allCalls.map((d) => d.location);
  uniqueCityNames = [...new Set(cityNames)];

  yearsAtCompany = allCalls.map((d) => d.yearsatcompany);

  genders = allCalls
    .filter((d) => ["Male", "Female", "Other"].includes(d.gender))
    .map((p) => p.gender);
  uniqueGenders = [...new Set(genders)];

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

$("#gender-select").on("change", () => {
  scatterPlot.wrangleData();
  scatterPlot.groupGender();
  scatterPlot.updateVis();
});

$("#gender-reset").on("click", () => {
  scatterPlot.resetGender();
  scatterPlot.updateVis();
});

$("#gender-group").on("click", () => {
  scatterPlot.groupGender();
  scatterPlot.updateVis();
});

$("#yAxis-select").on("change", () => {
  scatterPlot.changeYAxis($("#yAxis-select").val());
  scatterPlot.updateVis();
})

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

  const $genderDropdown = $("#gender-select");
  $.each(uniqueGenders, function (i, gender) {
    $genderDropdown.append(`<option value="${gender}">${gender}</option>`);
  });
  $genderDropdown.selectpicker("refresh");

  const $yAxisDropdown = $("#yAxis-select");
  $yAxisDropdown.append(`<option value="yearsofexperience">Years of Experience</option>`)
  $yAxisDropdown.append(`<option value="yearsatcompany">Years at Company</option>`)
  $yAxisDropdown.selectpicker("refresh");
}
