// @TODO: YOUR CODE HERE!

const svgWidth = 960;
const svgHeight = 500;

const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("heighyt", svgHeight + 50);


const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXaxis = "poverty";
var chosenYaxis = "healthcare";

function xScale(data, chosenXaxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXaxis]) * 0.9,
        d3.max(data, d => d[chosenXaxis]) * 1.1])
        .range([0, width]);

    return xLinearScale;
}

function yScale(data, chosenYaxis) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYaxis]) - 2,
        d3.max(data, d => d[chosenYaxis]) + 2])
        .range([height, 0]);

    return yLinearScale;
}


function renderXaxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

        return xAxis;
}

function renderYaxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

        return yAxis;
}

function renderXCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXaxis]))
        .attr("dx", d => newXScale(d[chosenXaxis]));

    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transtion()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYaxis]))
        .attr("dy", d => newYScale(d[chosenYaxis])+5)

    return circlesGroup;
}

function renderXText(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXaxis]));

    return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("dy", d => newYScale(d[chosenYaxis])+5);

    return circlesGroup;
}


function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup) {

    var xlabel;
    var ylabel;

    if (chosenXaxis === "poverty") {
        xlabel = "Poverty: ";
    }
    else if (chosenXaxis === "age") {
        xlabel = "Age: ";
    }
    else if (chosenXaxis === "income") {
        xlabel = "Household Income: ";
    }

    if (chosenYaxis === "healthcare") {
        ylabel = "Healthcare: ";
    }
    else if (chosenYaxis === "obesity") {
        ylabel = "Obesity: ";
    }
    else if (chosenYaxis === "smokes") {
        ylabel = "Smokes: ";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, 60])
        .style("color", "black")
        .style("background", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .html(function(d) {
            return (`${d.state}<br>${xlabel + d[chosenXaxis]}%<br>${ylabel + d[chosenYaxis]}%`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    });

    circlesGroup.on("mouseout", function(data) {
        toolTip.hide(data);
    });

    return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(data, err) {

    data.forEach(d => {
        d.poverty = +d.poverty;
        d.povertyMoe = +d.povertyMoe;
        d.age = +d.age;
        d.ageMoe = +d.ageMoe;
        d.income = +d.income;
        d.incomeMoe = + d.incomeMoe;
        d.healthcare = + d.healthcare;
        d.healthcareLow = +d.healthcareLow;
        d.healthcareHigh = + d.healthcareHigh;
        d.obesity = +d.obesity;
        d.obesityLow = +d.obesityLow;
        d.obesityHigh = +d.obesityHigh;
        d.smokes = +d.smokes;
        d.smokesLow = +d.smokesLow;
        d.smokesHigh = +d.smokesHigh;
    });

    var xLinearScale = xScale(data, chosenXaxis);

    var yLinearScale = yScale(data, chosenYaxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("g");

    var circles = circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXaxis]))
        .attr("cy", d => yLinearScale(d[chosenYaxis]))
        .attr("r", 15)
        .classed("stateCircle", true);

    var circlesText = circlesGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[chosenXaxis]))
        .attr("dy", d => yLinearScale(d[chosenYaxis])+5)
        .classed("stateText", true);




    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var PovertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("In Poverty (%)");
  
    var AgeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (Median)");

    var IncomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Household Income (Median)");

    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
    
    var ObeseLabel = ylabelsGroup.append("text")
      .attr("y", -80)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obese (%)");
  
    var SmokesLabel = ylabelsGroup.append("text")
      .attr("y", -60)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");

    var HealthLabel = ylabelsGroup.append("text")
      .attr("y", -40)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

      circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

    
    xlabelsGroup.selectAll("text")
        .on("click", function() {

            var value = d3.select(this).attr("value");
            if (value !== chosenXaxis) {

                chosenXaxis = value;

                xLinearScale = xScale(data, chosenXaxis);

                xAxis = renderXaxes(xLinearScale, xAxis);

                circles = renderXCircles(circles, xLinearScale, chosenXaxis);

                circlesText = renderXText(circlesText, xLinearScale, chosenXaxis);

                circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

                if (chosenXaxis === "age") {
                    AgeLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    PovertyLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    IncomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else if(chosenXaxis === 'income'){
                    IncomeLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    PovertyLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    AgeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else {
                    IncomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    AgeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    PovertyLabel
                      .classed("active", true)
                      .classed("inactive", false);
                  }
            }

        });
    

    ylabelsGroup.selectAll("text")
        .on("click", function() {

            var value = d3.select(this).attr("value");
            if (value !== chosenYaxis) {

                chosenYaxis = value;

                yLinearScale = yScale(data, chosenYaxis);

                yAxis = renderYAxes(yLinearScale, yAxis);

                circles = renderYCircles(circles, yLinearScale, chosenYaxis);

                circlesText = renderYText(circlesText, yLinearScale, chosenYaxis);

                circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

                if (chosenYaxis === "obesity") {
                    ObeseLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    SmokesLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    HealthLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else if(chosenYaxis === 'smokes'){
                    SmokesLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    HealthLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    ObeseLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else {
                    HealthLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    SmokesLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    ObeseLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    }
                }
        });    
    });