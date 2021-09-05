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
    .attr("heighyt", svgHeight + 40);


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
})