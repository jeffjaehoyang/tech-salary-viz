/*
 *    scatterPlot.js
 */

class ScatterPlot {
  constructor(_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
  }

  initVis() {
    const vis = this;
    this.groupColor = d3.scaleOrdinal(d3.schemeSet1); // color grouping

    vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 };
    // get the current width of the div where the chart appear, and attribute it to Svg
    vis.WIDTH =
      parseInt(d3.select("#main-scatter-plot").style("width"), 10) -
      vis.MARGIN.LEFT -
      vis.MARGIN.RIGHT;
    // vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
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
    vis.y = d3.scaleLinear().domain([0, 50]).range([vis.HEIGHT, 0]);

    vis.yAxisCall = d3.axisLeft(vis.y).ticks(16);
    vis.xAxisCall = d3.axisBottom(vis.x).ticks();
    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`)
      .call(vis.xAxisCall);
    vis.yAxis = vis.g.append("g").attr("class", "y axis").call(vis.yAxisCall);

    // Add dots
    vis.dots = vis.g.selectAll("circle").data(allCalls);
    vis.dots
      .enter()
      .append("circle")
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(d.yearsofexperience))
      .attr("r", 1.5)
      .attr("fill", "lightblue");

    vis.dataFiltered = allCalls;
  }

  wrangleData() {
    const vis = this;
    vis.t = d3.transition().duration(750);
    // filter data based on selections
    vis.filterCompany();
    vis.filterPosition();
    vis.filterLocation();
    vis.updateVis();
  }

  filterCompany() {
    const vis = this;

    // filter by company and call in wrangleData()
    const selectedCompanyNames = $("#company-select").val();
    if (selectedCompanyNames.length > 0) {
      vis.dataFiltered = vis.dataFiltered.filter(({ company }) =>
        selectedCompanyNames.includes(upperCaseFirstLetter(company))
      );
    } else {
      vis.dataFiltered = allCalls;
    }
  }

  filterPosition() {
    const vis = this;

    // filter by position name (swe, pm, etc) and call in wrangleData()
    const selectedPositions = $("#position-select").val();
    if (selectedPositions.length > 0) {
      vis.dataFiltered = allCalls.filter(({ title }) =>
        selectedPositions.includes(upperCaseFirstLetter(title))
      );
    } else {
      vis.dataFiltered = allCalls;
    }
  }

  filterLocation() {
    const vis = this;

    // filter by location and call in wrangleData()
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
      .attr("fill", (d) => this.groupColor(d.company))
      .transition(vis.t)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(d.yearsofexperience))
      .attr("r", 1.5);

    vis.dots
      .enter()
      .append("circle")
      .attr("fill", (d) => this.groupColor(d.company))
      .transition(vis.t)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(d.yearsofexperience))
      .attr("r", 1.5);
  }
}
