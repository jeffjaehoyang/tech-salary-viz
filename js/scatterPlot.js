/*
 *    scatterPlot.js
 */

class ScatterPlot {
  constructor(_parentElement) {
    this.parentElement = _parentElement;
    this.dataFiltered = allCalls;
    this.filteredCompanyNames = allCalls;
    this.filteredPositionTitles = allCalls;
    this.filteredLocations = allCalls;
    this.filteredYOE = allCalls;
    this.filteredGenders = allCalls;
    this.currentGroupList = [];
    this.appliedFilters = [];
    this.circleRad = 3.7;
    this.colorVariable;
    this.baseColor = "blue";
    this.yAxisvar = "d.yearsofexperience";
    this.yAxisLabel = "Years of Experience";
    this.yAxisRange = [
      d3.max(this.dataFiltered.map((d) => eval(this.yAxisvar))),
      0,
    ];
    this.initVis();
  }

  initVis() {
    const vis = this;
    this.groupColor = d3
      .scaleOrdinal()
      .range(["blue", "green", "red", "violet"]); // color grouping

    vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 100 };
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
      .domain([0, d3.max(vis.dataFiltered.map((d) => eval(this.yAxisvar)))])
      .range([vis.HEIGHT, 0]);

    vis.yAxisCall = d3.axisLeft(vis.y).ticks();
    vis.xAxisCall = d3.axisBottom(vis.x).ticks();
    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`)
      .call(vis.xAxisCall);
    vis.yAxis = vis.g.append("g").attr("class", "y axis").call(vis.yAxisCall);

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
      .attr("class", "yAxislabel")
      .text(this.yAxisLabel);

    //brush
    vis.brush = d3
      .brushY()
      .handleSize(10)
      .extent([
        [0, 0],
        [vis.WIDTH, vis.HEIGHT],
      ])
      .on("end", () => vis.brushed(this));

    vis.brushComponent = vis.g
      .append("g")
      .attr("class", "brush")
      .call(vis.brush);

    // Tooltip
    vis.tip = d3
      .tip()
      .attr("class", "d3-tip")
      .html((d) => {
        let text = `<strong>Company: </strong> <span style='color:red;text-transform:capitalize'>${d.company}</span><br>`;
        text += `<strong>Title: </strong> <span style='color:red;text-transform:capitalize'>${d.title}</span><br>`;
        text += `<strong>Total Compensation: </strong> <span style='color:red'>$${numberWithCommas(
          d.totalyearlycompensation
        )}</span><br>`;
        text += `<strong>Years of Experience: </strong> <span style='color:red'>${d.yearsofexperience} yrs</span><br>`;
        text += `<strong>Years at Company: </strong> <span style='color:red'>${d.yearsatcompany} yrs</span><br>`;
        text += `<strong>Gender: </strong> <span style='color:red'>${d.gender}</span><br>`;
        text += `<strong>City: </strong> <span style='color:red'>${d.location}</span><br>`;
        return text;
      });
    vis.g.call(vis.tip);

    // Add dots
    vis.dots = vis.g.selectAll("circle").data(vis.dataFiltered);

    vis.dots
      .enter()
      .append("circle")
      .on("mouseover", vis.tip.show)
      .on("mouseout", vis.tip.hide)
      .style("opacity", 0.5)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(eval(this.yAxisvar)))
      .attr("r", vis.circleRad)
      .attr("fill", vis.baseColor);

    vis.infoBox = d3.select("#info-summary-box");
    vis.infoBox.html(
      "Data summary will be displayed once filters are applied."
    );
  }

  brushed(vis) {
    const selection = d3.event.selection;
    if (!selection) {
      vis.resetYOE();
    } else {
      vis.yAxisRange = selection.map(vis.y.invert);
    }
    vis.brushComponent.remove(); // This remove the grey brush area as soon as the selection has been done
    //brush
    vis.brush = d3
      .brushY()
      .handleSize(10)
      .extent([
        [0, 0],
        [vis.WIDTH, vis.HEIGHT],
      ])
      .on("end", () => vis.brushed(this));

    vis.brushComponent = vis.g
      .append("g")
      .attr("class", "brush")
      .call(vis.brush);

    vis.wrangleData();
    vis.updateVis();
  }

  resetCompany() {
    const vis = this;
    vis.filteredCompanyNames = allCalls;
    $("#company-select").selectpicker("deselectAll");
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations,
      vis.filteredGenders,
      vis.filteredYOE
    );
    vis.appliedFilters = vis.appliedFilters.filter(function (e) {
      return e !== "company";
    });
    vis.colorVariable =
      vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
  }

  resetPosition() {
    const vis = this;
    vis.filteredPositionTitles = allCalls;
    $("#position-select").selectpicker("deselectAll");
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations,
      vis.filteredGenders,
      vis.filteredYOE
    );
    vis.appliedFilters = vis.appliedFilters.filter(function (e) {
      return e !== "title";
    });
    vis.colorVariable =
      vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
  }

  resetLocation() {
    const vis = this;
    vis.filteredLocations = allCalls;
    $("#city-select").selectpicker("deselectAll");
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations,
      vis.filteredGenders,
      vis.filteredYOE
    );
    vis.appliedFilters = vis.appliedFilters.filter(function (e) {
      return e !== "location";
    });
    vis.colorVariable =
      vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
  }

  resetGender() {
    const vis = this;
    vis.filteredGenders = allCalls;
    $("#gender-select").selectpicker("deselectAll");
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations,
      vis.filteredGenders,
      vis.filteredYOE
    );
    vis.appliedFilters = vis.appliedFilters.filter(function (e) {
      return e !== "gender";
    });
    vis.colorVariable =
      vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
  }

  resetYOE() {
    const vis = this;
    vis.filteredYOE = allCalls;
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations,
      vis.filteredGenders,
      vis.filteredYOE
    );
    this.yAxisRange = [
      d3.max(vis.dataFiltered.map((d) => eval(this.yAxisvar))),
      0,
    ];
  }

  groupCompany() {
    // color group by company
    const vis = this;
    const selectedCompanyNames = $("#company-select").val();
    vis.colorVariable = "company";
    vis.currentGroupList = selectedCompanyNames;
  }

  changeYAxis(yAxisval) {
    this.yAxisLabel = yAxisval;
    yAxisval = yAxisval.toLowerCase().split(" ").join("");
    this.yAxisvar = `d.` + yAxisval;
  }

  groupPosition() {
    // color group by position
    const vis = this;
    const selectedPositionTitles = $("#position-select").val();
    vis.colorVariable = "title";
    vis.currentGroupList = selectedPositionTitles;
  }

  groupLocation() {
    // color group by location
    const vis = this;
    const selectedLocations = $("#city-select").val();
    vis.colorVariable = "location";
    vis.currentGroupList = selectedLocations;
  }

  groupGender() {
    // color group by location
    const vis = this;
    const selectedGenders = $("#gender-select").val();
    vis.colorVariable = "gender";
    vis.currentGroupList = selectedGenders;
  }

  wrangleData() {
    const vis = this;
    vis.t = d3.transition().duration(750);
    // filter data based on selections
    vis.filterCompany();
    vis.filterPosition();
    vis.filterLocation();
    vis.filterGender();
    vis.filterYOE();
    vis.dataFiltered = intersectMany(
      vis.filteredCompanyNames,
      vis.filteredPositionTitles,
      vis.filteredLocations,
      vis.filteredGenders,
      vis.filteredYOE
    );
  }

  filterCompany() {
    const vis = this;
    // filter by company and call in wrangleData()
    const selectedCompanyNames = $("#company-select").val();
    if (selectedCompanyNames.length > 0) {
      if (!vis.appliedFilters.includes("company"))
        vis.appliedFilters.push("company");
      vis.filteredCompanyNames = allCalls.filter(({ company }) =>
        selectedCompanyNames.includes(company)
      );
    } else {
      vis.filteredCompanyNames = allCalls;
      vis.appliedFilters = vis.appliedFilters.filter(function (e) {
        return e !== "company";
      });
    }
    if (
      vis.colorVariable === "company" &&
      !vis.appliedFilters.includes("company")
    ) {
      vis.colorVariable =
        vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
    }
  }

  filterPosition() {
    const vis = this;
    // filter by position name (swe, pm, etc) and call in wrangleData()
    const selectedPositions = $("#position-select").val();
    if (selectedPositions.length > 0) {
      if (!vis.appliedFilters.includes("title"))
        vis.appliedFilters.push("title");
      vis.filteredPositionTitles = allCalls.filter(({ title }) =>
        selectedPositions.includes(title)
      );
    } else {
      vis.filteredPositionTitles = allCalls;
      vis.appliedFilters = vis.appliedFilters.filter(function (e) {
        return e !== "title";
      });
    }
    if (
      vis.colorVariable === "title" &&
      !vis.appliedFilters.includes("title")
    ) {
      vis.colorVariable =
        vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
    }
  }

  filterLocation() {
    const vis = this;
    // filter by location and call in wrangleData()
    const selectedLocations = $("#city-select").val();
    if (selectedLocations.length > 0) {
      if (!vis.appliedFilters.includes("location"))
        vis.appliedFilters.push("location");
      vis.filteredLocations = allCalls.filter(({ location }) =>
        selectedLocations.includes(location)
      );
    } else {
      vis.filteredLocations = allCalls;
      vis.appliedFilters = vis.appliedFilters.filter(function (e) {
        return e !== "location";
      });
    }
    if (
      vis.colorVariable === "location" &&
      !vis.appliedFilters.includes("location")
    ) {
      vis.colorVariable =
        vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
    }
  }

  filterGender() {
    const vis = this;
    // filter by gender and call in wrangleData()
    const selectedGenders = $("#gender-select").val();
    if (selectedGenders.length > 0) {
      if (!vis.appliedFilters.includes("gender"))
        vis.appliedFilters.push("gender");
      vis.filteredGenders = allCalls.filter(({ gender }) =>
        selectedGenders.includes(gender)
      );
    } else {
      vis.filteredGenders = allCalls;
      vis.appliedFilters = vis.appliedFilters.filter(function (e) {
        return e !== "gender";
      });
    }
    if (
      vis.colorVariable === "gender" &&
      !vis.appliedFilters.includes("gender")
    ) {
      vis.colorVariable =
        vis.appliedFilters.length > 0 ? vis.appliedFilters[0] : null;
    }
  }

  filterYOE() {
    const vis = this;
    vis.filteredYOE = allCalls.filter(
      (d) =>
        eval(this.yAxisvar) <= vis.yAxisRange[0] &&
        eval(this.yAxisvar) >= vis.yAxisRange[1]
    );
  }

  getGroupByVariable(d) {
    const vis = this;
    switch (vis.colorVariable) {
      case "company":
        return d.company;
      case "title":
        return d.title;
      case "location":
        return d.location;
      case "gender":
        return d.gender;
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
      .domain([
        vis.yAxisRange[1],
        Math.min(
          vis.yAxisRange[0],
          d3.max(vis.dataFiltered.map((d) => eval(this.yAxisvar)))
        ),
      ])
      .range([vis.HEIGHT, 0]);

    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t).call(vis.yAxisCall);

    d3.selectAll(".yAxislabel").remove();

    const yLabel = vis.g
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -170)
      .attr("font-size", "15px")
      .attr("text-anchor", "middle")
      .attr("class", "yAxislabel")
      .text(this.yAxisLabel);

    this.groupColor = d3
      .scaleOrdinal()
      .domain(vis.currentGroupList)
      .range(["blue", "green", "red", "violet"]); // color grouping

    // Tooltip
    vis.tip = d3
      .tip()
      .attr("class", "d3-tip")
      .html((d) => {
        let text = `<strong>Company: </strong> <span style='color:red;text-transform:capitalize'>${d.company}</span><br>`;
        text += `<strong>Title: </strong> <span style='color:red;text-transform:capitalize'>${d.title}</span><br>`;
        text += `<strong>Total Compensation: </strong> <span style='color:red'>$${numberWithCommas(
          d.totalyearlycompensation
        )}</span><br>`;
        text += `<strong>Years of Experience: </strong> <span style='color:red'>${d.yearsofexperience} yrs</span><br>`;
        text += `<strong>Years at Company: </strong> <span style='color:red'>${d.yearsatcompany} yrs</span><br>`;
        text += `<strong>Gender: </strong> <span style='color:red'>${d.gender}</span><br>`;
        text += `<strong>City: </strong> <span style='color:red'>${d.location}</span><br>`;
        return text;
      });
    vis.g.call(vis.tip);

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
      .attr("fill", (d) =>
        vis.colorVariable
          ? this.groupColor(vis.getGroupByVariable(d))
          : vis.baseColor
      )
      .transition(vis.t)
      .style("opacity", 0.5)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(eval(this.yAxisvar)))
      .attr("r", vis.circleRad);

    vis.dots
      .enter()
      .append("circle")
      .on("mouseover", vis.tip.show)
      .on("mouseout", vis.tip.hide)
      .attr("fill", (d) =>
        vis.colorVariable
          ? this.groupColor(vis.getGroupByVariable(d))
          : vis.baseColor
      )
      .transition(vis.t)
      .style("opacity", 0.5)
      .attr("cx", (d) => vis.x(d.totalyearlycompensation))
      .attr("cy", (d) => vis.y(eval(this.yAxisvar)))
      .attr("r", vis.circleRad);

    // remove previous legend
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

    const infoText = vis.generateInfoText();
    vis.infoBox.html(infoText).transition();
  }

  generateInfoText() {
    const vis = this;
    const groupByList = vis.currentGroupList;
    const groupByInfo = `</br> Groups represented as color variables are: ${groupByList.join(
      ", "
    )}. `;
    const data = {};
    let groupTextInfo = "</br> ";
    data.count = vis.dataFiltered.length;
    groupByList.forEach((d) => {
      const dataForGroup = vis.dataFiltered.filter(
        (dp) => dp[vis.colorVariable] === d
      );
      data.d = {};
      data.d.median = d3.median(
        dataForGroup,
        (dp) => dp.totalyearlycompensation
      );
      data.d.average = d3.mean(
        dataForGroup,
        (dp) => dp.totalyearlycompensation
      );
      groupTextInfo += `Median compensation for ${d} is $${numberWithCommas(
        data.d.median
      )} and average compensation is $${numberWithCommas(
        Math.floor(data.d.average)
      )}. `;
    });

    return `Currently displaying ${data.count} different datapoints. ${
      groupByList.length > 0 ? groupByInfo : ""
    } ${groupTextInfo}`;
  }
}
