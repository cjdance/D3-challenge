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