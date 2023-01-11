
const length = 1000;
const marginLength = 30;

const margin = {
    "top": marginLength,
    "left": marginLength,
    "bottom": marginLength,
    "right": marginLength
}

const innerRadius = 0.2 * length / 2;
const outerRadius = length / 2;

const cleanedData = data.map(d => {
    const timestamp = d.timestamp.toString();
    return {
        timestamp: [timestamp.slice(0, 4), "-", timestamp.slice(4)].join(''),
        value: +d.value
    }
})

//to format the x-axis labels
const dateFormat = d3.timeFormat("%Y");

const minDate = new Date(cleanedData[0].timestamp);
const maxDate = new Date(cleanedData[cleanedData.length - 1].timestamp);

const xScale = d3.scaleBand().domain(cleanedData.map(d => new Date(d.timestamp))).range([0, 2 * Math.PI])

const yScale = d3.scaleLinear()
    .domain(d3.extent(cleanedData, d => d.value))
    .range([innerRadius, outerRadius]);

const colorScale = d3.scaleSequential(d3.interpolateSpectral)
    .domain(d3.extent(cleanedData, d => d.value).reverse())


const arc = d3.arc()
    .innerRadius(yScale(0))
    .outerRadius(d => yScale(d.value))
    .startAngle(d => xScale(new Date(d.timestamp)))
    .endAngle(d => xScale(new Date(d.timestamp)) + xScale.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)



//svg
const svg = d3.select("#chart1").append("svg").attr("width", length).attr("height", length);
const g = svg.append("g").attr("transform", `translate(${length / 2},${length / 2})`);

g.selectAll('path')
    .data(cleanedData)
    .join('path')
    .attr('fill', d => colorScale(d.value))
    .attr('stroke', d => colorScale(d.value))
    .attr('d', arc);

g.append('text')
    .attr('text-anchor', 'end')
    .attr('x', '-0.5em')
    .attr('y', d => -yScale(yScale.ticks(5).pop()) - 10)
    .attr('dy', '-1em')
    .style('fill', '#1a1a1a')
    .text('Temperature (°C)')

g.selectAll("circle")
    .data(yScale.ticks(5))
    .join('circle')
    .attr('fill', 'none')
    .style('stroke', '#aaa')
    .style('stroke-opacity', 0.5)
    .attr('r', yScale)

g.selectAll('text.xLabel')
    .data(yScale.ticks(5))
    .join('text')
    .attr('class', "xLabel")
    .attr('x', 0)
    .attr('y', d => -yScale(d))
    .attr('dy', '0.35em')
    .style("fill", '#1a1a1a')
    .text(yScale.tickFormat(6, 's'))


// create data for x-axis, every n years
// const start = 1880;
// const end = 2010; //2020 will
// const step = 10;
// const arrayLength = Math.floor(((end - start) / step)) + 1;
// const years = [...Array(arrayLength).keys()].map(d => (d * step) + start);


// g.selectAll("line.yGrid")
//     .data(years)
//     .join("line")
//     .attr("class", "yGrid")
//     .attr('transform', (d, i, arr) => `
//         rotate(${i * 360 / arr.length-360/4})
//         translate(${innerRadius},0)
//     `)
//     .attr('x1', -5)
//     .attr('x2', outerRadius - innerRadius + 10)
//     .style('stroke', '#aaa')

// g.selectAll("g.yLabel")
//     .data(years)
//     .join("g")
//     .attr("class", "yLabel")
//     .attr('transform', (d, i, arr) => `
//         rotate(${i * 360 / arr.length-360/4.1})
//         translate(${innerRadius-30},0)
//     `)
//     .append("text")
//     .style('font-family', 'sans-serif')
//     .style('font-size', 10)
//     .text(d => d)