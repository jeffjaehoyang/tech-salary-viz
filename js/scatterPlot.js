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

    vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 };
    vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
    vis.HEIGHT = 370 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;

    vis.svg = d3
      .select(vis.parentElement)
      .append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

    vis.g = vis.svg
      .append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`);

    vis.color = d3.scaleOrdinal(d3.schemePastel1);

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
    const dots = vis.g.selectAll("dot").data(allCalls);
    console.log("dots: ", dots);
    dots
      .enter()
      .append("circle")
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(d.yearsofexperience))
      .attr("r", 1.5)
      .attr("fill", "#69b3a2");

    // vis.addLegend();

    vis.wrangleData();
  }

  wrangleData() {
    // wrangle data
  }

  updateVis() {
    // update vis
  }

  addLegend() {
    // add legend
  }
}
