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

function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

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

function renderXText(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXaxis]));

    return circlesGroup;
}