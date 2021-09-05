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

