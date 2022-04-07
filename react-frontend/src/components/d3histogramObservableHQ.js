import * as d3 from 'd3'

// Trying to include Observable vizualisations into React

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/histogram                            
function Histogram(svg,data
     ) {
    const xLabel = "Share of available values ->"
    const value = (d) => d; // convenience alias for x
    const type = d3.scaleLinear; // convenience alias for xType
    const x = value; // given d in data, returns the (quantitative) x-value
    const y = () => 1; // given d in data, returns the (quantitative) weight
    const thresholds = 20; // approximate number of bins to generate, or threshold function
    const marginTop = 20; // top margin, in pixels
    const marginRight = 30; // right margin, in pixels
    const marginBottom = 30; // bottom margin, in pixels
    const marginLeft = 40; // left margin, in pixels
    const width = 640; // outer width of chart, in pixels
    const height = 400; // outer height of chart, in pixels
    const insetLeft = 0.5; // inset left edge of bar
    const insetRight = 0.5; // inset right edge of bar
    const xType = type; // type of x-scale
    
    const xFormat = "r"
    let yFormat = "r"
    // [xmin, xmax]
    const xRange = [marginLeft, width - marginRight]; // [left, right]
    const yType = d3.scaleLinear; // type of y-scale
    const yRange = [height - marginBottom, marginTop]; // [bottom, top]
    const yLabel = "↑ Frequency"; // a label for the y-axis
    const color = "currentColor" // bar fill color



    console.log(data)
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);
  
    // Compute bins.
    const bins = d3.bin().thresholds(thresholds).value(i => X[i])(I);
  
    // Compute default domains.
    const xDomain = [bins[0].x0, bins[bins.length - 1].x1];
    const yDomain = [0, d3.max(bins, I => d3.sum(I, i => Y[i]))];
  
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
     yFormat = yScale.tickFormat(100, yFormat);
  
    //svg = d3.select("#mysvg")
    //let svg = d3.create("svg")

        svg.attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    svg.append("g")
        .attr("fill", color)
      .selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", d => xScale(d.x0) + insetLeft)
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - insetLeft - insetRight))
        .attr("y", d => yScale(d3.sum(d, i => Y[i])))
        .attr("height", d => yScale(0) - yScale(d3.sum(d, i => Y[i])))
      .append("title")
        .text((d, i) => [`${d.x0} ≤ x < ${d.x1}`, yFormat(d3.sum(d, i => Y[i]))].join("\n"));
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width - marginRight)
            .attr("y", 27)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));
  
    return svg.node();
  }


export default Histogram
