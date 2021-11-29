/*
 *    scatterPlot.js
 */

class ScatterPlot {
  constructor(_parentElement) {
    this.parentElement = _parentElement;
    this.dataFiltered = allCalls;
    this.filteredCompanyNames = [];
    this.filteredPositionTitles = [];
    this.filteredLocations = [];
    this.currentGroupList = [];
    this.circleRad = 3.7;
    this.colorVariable = "company";
    this.baseColor = "blue";
    this.initVis();
  }

  initVis() {
    const vis = this;
    this.groupColor = d3
      .scaleOrdinal()
      .range(["blue", "green", "red", "violet"]); // color grouping

    vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 100 };
    // get the current width of the div where the chart appear, and attribute it to Svg
    vis.WIDTH =
      parseInt(d3.select("#main-scatter-plot").style("width"), 10) -
      vis.MARGIN.LEFT -
      vis.MARGIN.RIGHT;
    vis.HEIGHT = 570 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;

    vis.svg = d3
      .select(vis.parentElement)
      .append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

    vis.g = vis.svg
      .append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`);

    vis.x = d3
      .scaleLinear()
      .domain([0, d3.max(allCalls.map((d) => d.totalyearlycompensation))])
      .range([0, vis.WIDTH]);
    vis.y = d3
      .scaleLinear()
      .domain([0, d3.max(vis.dataFiltered.map((d) => d.yearsofexperience))])
      .range([vis.HEIGHT, 0]);

    vis.yAxisCall = d3.axisLeft(vis.y).ticks();
    vis.xAxisCall = d3.axisBottom(vis.x).ticks();
    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`)
      .call(vis.xAxisCall);
    vis.yAxis = vis.g.append("g").attr("class", "y axis").call(vis.yAxisCall);

    // Add tooltip
    vis.tooltip = d3
      .select("#main-scatter-plot")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // Labels
    const xLabel = vis.g
      .append("text")
      .attr("y", vis.HEIGHT + 50)
      .attr("x", vis.WIDTH / 2)
      .attr("font-size", "15px")
      .attr("text-anchor", "middle")
      .text("Total Yearly Compensation ($)");

    const yLabel = vis.g
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -170)
      .attr("font-size", "15px")
      .attr("text-anchor", "middle")
      .text("Years of Experience");

    // Add dots
    vis.dots = vis.g.selectAll("circle").data(allCalls);
    vis.dots
      .enter()
      .append("circle")
      .style("opacity", 0.5)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(d.yearsofexperience))
      .attr("r", vis.circleRad)
      .attr("fill", "blue");

    vis.dots.on("mouseover", function (d, idx, allData) {
      d3.select(this).attr("r", vis.circleRad);
      vis.tooltip.transition().duration(200).style("opacity", 1);
      vis.tooltip.html(
        "Company <b>" +
          d.company +
          "</b>: " +
          "title=" +
          d.title +
          ", tc=" +
          d.totalyearlycompensation +
          "<br>" +
          "yoe=" +
          d.yearsofexperience
      );
    });
    vis.dots.on("mouseout", function (d, i) {
      d3.select(this).attr("r", 4);
      vis.tooltip.transition().duration(500).style("opacity", 0);
    });
  }

  resetCompany() {
    const vis = this;
    vis.filteredCompanyNames = allCalls;
    $("#company-select").selectpicker("deselectAll");
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations
    );
  }

  resetPosition() {
    const vis = this;
    vis.filteredPositionTitles = allCalls;
    $("#position-select").selectpicker("deselectAll");
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations
    );
  }

  resetLocation() {
    const vis = this;
    vis.filteredLocations = allCalls;
    $("#city-select").selectpicker("deselectAll");
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations
    );
  }

  groupCompany() {
    // color group by company
    const vis = this;
    const selectedCompanyNames = $("#company-select").val();
    vis.colorVariable = "company";
    vis.currentGroupList = selectedCompanyNames;
  }

  groupPosition() {
    // color group by position
    const vis = this;
    const selectedPositionTitles = $("#position-select").val();
    vis.colorVariable = "position";
    vis.currentGroupList = selectedPositionTitles;
  }

  groupLocation() {
    // color group by location
    const vis = this;
    const selectedLocations = $("#city-select").val();
    vis.colorVariable = "location";
    vis.currentGroupList = selectedLocations;
  }

  wrangleData() {
    const vis = this;
    vis.t = d3.transition().duration(750);
    // filter data based on selections
    vis.filterCompany();
    vis.filterPosition();
    vis.filterLocation();
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations
    );
    vis.updateVis();
  }

  filterCompany() {
    const vis = this;
    // filter by company and call in wrangleData()
    const selectedCompanyNames = $("#company-select").val();
    if (selectedCompanyNames.length > 0) {
      vis.filteredCompanyNames = allCalls.filter(({ company }) =>
        selectedCompanyNames.includes(company)
      );
    } else {
      vis.filteredCompanyNames = allCalls;
    }
  }

  filterPosition() {
    const vis = this;
    // filter by position name (swe, pm, etc) and call in wrangleData()
    const selectedPositions = $("#position-select").val();
    if (selectedPositions.length > 0) {
      vis.filteredPositionTitles = allCalls.filter(({ title }) =>
        selectedPositions.includes(title)
      );
    } else {
      vis.filteredPositionTitles = allCalls;
    }
  }

  filterLocation() {
    const vis = this;
    // filter by location and call in wrangleData()
    const selectedLocations = $("#city-select").val();
    if (selectedLocations.length > 0) {
      vis.filteredLocations = allCalls.filter(({ location }) =>
        selectedLocations.includes(location)
      );
    } else {
      vis.filteredLocations = allCalls;
    }
  }

  getGroupByVariable(d) {
    const vis = this;
    switch (vis.colorVariable) {
      case "company":
        return d.company;
      case "position":
        return d.title;
      case "location":
        return d.location;
    }
  }

  updateVis() {
    const vis = this;
    // update scales
    vis.x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(vis.dataFiltered.map((d) => d.totalyearlycompensation)),
      ])
      .range([0, vis.WIDTH]);
    vis.y = d3
      .scaleLinear()
      .domain([0, d3.max(vis.dataFiltered.map((d) => d.yearsofexperience))])
      .range([vis.HEIGHT, 0]);

    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t).call(vis.yAxisCall);

    // Add dots
    vis.dots = vis.g.selectAll("circle").data(vis.dataFiltered);

    vis.dots
      .exit()
      .attr("class", "exit")
      .transition(vis.t)
      .attr("cx", (d) => 0)
      .attr("cy", (d) => 0)
      .remove();

    vis.dots
      .attr("class", "update")
      .attr("fill", (d) => this.groupColor(vis.getGroupByVariable(d)))
      .transition(vis.t)
      .style("opacity", 0.5)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(d.yearsofexperience))
      .attr("r", vis.circleRad);

    vis.dots
      .enter()
      .append("circle")
      .attr("fill", (d) => this.groupColor(vis.getGroupByVariable(d)))
      .transition(vis.t)
      .style("opacity", 0.5)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(d.yearsofexperience))
      .attr("r", vis.circleRad);

    vis.dots.on("mouseover", function (d, idx, allData) {
      d3.select(this).attr("r", vis.circleRad);
      vis.tooltip.transition().duration(200).style("opacity", 1);
      vis.tooltip.html(
        "Company <b>" +
          d.company +
          "</b>: " +
          "title=" +
          d.title +
          ", tc=" +
          d.totalyearlycompensation +
          "<br>" +
          "yoe=" +
          d.yearsofexperience
      );
    });
    vis.dots.on("mouseout", function (d, i) {
      d3.select(this).attr("r", 4);
      vis.tooltip.transition().duration(500).style("opacity", 0);
    });

    d3.selectAll(".legend").remove();

    const legend = vis.g
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${vis.WIDTH - 10}, ${vis.HEIGHT - 95})`);
    vis.currentGroupList.forEach((d, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", vis.groupColor(d));

      legendRow
        .append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .style("font-size", "15px")
        .text(d);
    });
  }
}
