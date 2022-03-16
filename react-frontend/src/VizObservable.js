import * as d3 from 'd3'

// Trying to include Observable vizualisations into React

const dummyFeatureInfo = { "feature" : "HR",
                            "pct_avail_pp" :
                                [{"patient_id":1, "pct_avail": 0.9375}, {"patient_id":2, "pct_avail": 1.0}, {"patient_id":3, "pct_avail": 1.0}, {"patient_id":4, "pct_avail": 1.0}, {"patient_id":5, "pct_avail": 1.0}, {"patient_id":6, "pct_avail": 1.0}, {"patient_id":7, "pct_avail": 0.9375}, {"patient_id":8, "pct_avail": 0.9895833333333334}, {"patient_id":9, "pct_avail": 1.0}, {"patient_id":10, "pct_avail": 1.0}, {"patient_id":11, "pct_avail": 1.0}, {"patient_id":12, "pct_avail": 1.0}, {"patient_id":13, "pct_avail": 1.0}, {"patient_id":14, "pct_avail": 1.0}, {"patient_id":15, "pct_avail": 1.0}, {"patient_id":16, "pct_avail": 1.0}, {"patient_id":17, "pct_avail": 0.9895833333333334}, {"patient_id":18, "pct_avail": 0.9895833333333334}, {"patient_id":19, "pct_avail": 1.0}, {"patient_id":20, "pct_avail": 0.9895833333333334}, {"patient_id":21, "pct_avail": 0.9791666666666666}, {"patient_id":22, "pct_avail": 1.0}, {"patient_id":23, "pct_avail": 0.9791666666666666}, {"patient_id":24, "pct_avail": 1.0}, {"patient_id":25, "pct_avail": 1.0}, {"patient_id":26, "pct_avail": 1.0}, {"patient_id":27, "pct_avail": 1.0}, {"patient_id":28, "pct_avail": 1.0}, {"patient_id":29, "pct_avail": 0.9583333333333334}, {"patient_id":30, "pct_avail": 1.0}, {"patient_id":31, "pct_avail": 1.0}, {"patient_id":32, "pct_avail": 1.0}, {"patient_id":33, "pct_avail": 0.9895833333333334}, {"patient_id":34, "pct_avail": 1.0}, {"patient_id":35, "pct_avail": 1.0}, {"patient_id":36, "pct_avail": 1.0}, {"patient_id":37, "pct_avail": 1.0}, {"patient_id":38, "pct_avail": 1.0}, {"patient_id":39, "pct_avail": 1.0}, {"patient_id":40, "pct_avail": 1.0}, {"patient_id":41, "pct_avail": 0.9791666666666666}, {"patient_id":42, "pct_avail": 1.0}, {"patient_id":43, "pct_avail": 1.0}, {"patient_id":44, "pct_avail": 0.9895833333333334}, {"patient_id":45, "pct_avail": 1.0}, {"patient_id":46, "pct_avail": 1.0}, {"patient_id":47, "pct_avail": 0.9583333333333334}, {"patient_id":48, "pct_avail": 1.0}, {"patient_id":49, "pct_avail": 1.0}, {"patient_id":50, "pct_avail": 1.0}, {"patient_id":51, "pct_avail": 1.0}, {"patient_id":52, "pct_avail": 1.0}, {"patient_id":53, "pct_avail": 1.0}, {"patient_id":54, "pct_avail": 1.0}, {"patient_id":55, "pct_avail": 1.0}, {"patient_id":56, "pct_avail": 1.0}, {"patient_id":57, "pct_avail": 0.96875}, {"patient_id":58, "pct_avail": 1.0}, {"patient_id":59, "pct_avail": 1.0}, {"patient_id":60, "pct_avail": 1.0}, {"patient_id":61, "pct_avail": 1.0}, {"patient_id":62, "pct_avail": 0.9895833333333334}, {"patient_id":63, "pct_avail": 1.0}, {"patient_id":64, "pct_avail": 1.0}, {"patient_id":65, "pct_avail": 0.9895833333333334}, {"patient_id":66, "pct_avail": 0.9166666666666666}, {"patient_id":67, "pct_avail": 1.0}, {"patient_id":68, "pct_avail": 1.0}, {"patient_id":69, "pct_avail": 1.0}, {"patient_id":70, "pct_avail": 0.9895833333333334}, {"patient_id":71, "pct_avail": 0.9479166666666666}, {"patient_id":72, "pct_avail": 0.9791666666666666}, {"patient_id":73, "pct_avail": 1.0}, {"patient_id":74, "pct_avail": 1.0}, {"patient_id":75, "pct_avail": 1.0}, {"patient_id":76, "pct_avail": 1.0}, {"patient_id":77, "pct_avail": 0.9895833333333334}, {"patient_id":78, "pct_avail": 0.9895833333333334}, {"patient_id":79, "pct_avail": 1.0}, {"patient_id":80, "pct_avail": 1.0}, {"patient_id":81, "pct_avail": 0.96875}, {"patient_id":82, "pct_avail": 1.0}, {"patient_id":83, "pct_avail": 1.0}, {"patient_id":84, "pct_avail": 1.0}, {"patient_id":85, "pct_avail": 1.0}, {"patient_id":86, "pct_avail": 0.9583333333333334}, {"patient_id":87, "pct_avail": 1.0}, {"patient_id":88, "pct_avail": 1.0}, {"patient_id":89, "pct_avail": 1.0}, {"patient_id":90, "pct_avail": 1.0}, {"patient_id":91, "pct_avail": 1.0}, {"patient_id":92, "pct_avail": 1.0}, {"patient_id":93, "pct_avail": 1.0}, {"patient_id":94, "pct_avail": 1.0}, {"patient_id":95, "pct_avail": 1.0}, {"patient_id":96, "pct_avail": 0.9479166666666666}, {"patient_id":97, "pct_avail": 1.0}, {"patient_id":98, "pct_avail": 1.0}, {"patient_id":99, "pct_avail": 1.0}, {"patient_id":100, "pct_avail": 1.0}, {"patient_id":101, "pct_avail": 1.0}, {"patient_id":102, "pct_avail": 1.0}, {"patient_id":103, "pct_avail": 0.90625}, {"patient_id":104, "pct_avail": 1.0}, {"patient_id":105, "pct_avail": 0.9479166666666666}, {"patient_id":106, "pct_avail": 0.8958333333333334}, {"patient_id":107, "pct_avail": 1.0}, {"patient_id":108, "pct_avail": 1.0}, {"patient_id":109, "pct_avail": 0.9791666666666666}, {"patient_id":110, "pct_avail": 0.9583333333333334}, {"patient_id":111, "pct_avail": 1.0}, {"patient_id":112, "pct_avail": 0.9895833333333334}, {"patient_id":113, "pct_avail": 1.0}, {"patient_id":114, "pct_avail": 1.0}, {"patient_id":115, "pct_avail": 1.0}, {"patient_id":116, "pct_avail": 1.0}, {"patient_id":117, "pct_avail": 0.8541666666666666}, {"patient_id":118, "pct_avail": 0.9895833333333334}, {"patient_id":119, "pct_avail": 1.0}, {"patient_id":120, "pct_avail": 1.0}, {"patient_id":121, "pct_avail": 0.9895833333333334}, {"patient_id":122, "pct_avail": 1.0}, {"patient_id":123, "pct_avail": 1.0}, {"patient_id":124, "pct_avail": 1.0}, {"patient_id":125, "pct_avail": 1.0}, {"patient_id":126, "pct_avail": 1.0}, {"patient_id":127, "pct_avail": 1.0}, {"patient_id":128, "pct_avail": 1.0}, {"patient_id":129, "pct_avail": 1.0}, {"patient_id":130, "pct_avail": 1.0}, {"patient_id":131, "pct_avail": 1.0}, {"patient_id":132, "pct_avail": 1.0}, {"patient_id":133, "pct_avail": 0.9791666666666666}, {"patient_id":134, "pct_avail": 1.0}, {"patient_id":135, "pct_avail": 1.0}, {"patient_id":136, "pct_avail": 1.0}, {"patient_id":137, "pct_avail": 1.0}, {"patient_id":138, "pct_avail": 1.0}, {"patient_id":139, "pct_avail": 1.0}, {"patient_id":140, "pct_avail": 1.0}, {"patient_id":141, "pct_avail": 0.9479166666666666}, {"patient_id":142, "pct_avail": 1.0}, {"patient_id":143, "pct_avail": 1.0}, {"patient_id":144, "pct_avail": 1.0}, {"patient_id":145, "pct_avail": 1.0}, {"patient_id":146, "pct_avail": 0.9895833333333334}, {"patient_id":147, "pct_avail": 1.0}, {"patient_id":148, "pct_avail": 1.0}, {"patient_id":149, "pct_avail": 0.9791666666666666}, {"patient_id":150, "pct_avail": 1.0}, {"patient_id":151, "pct_avail": 0.9791666666666666}, {"patient_id":152, "pct_avail": 1.0}, {"patient_id":153, "pct_avail": 1.0}, {"patient_id":154, "pct_avail": 1.0}, {"patient_id":155, "pct_avail": 1.0}, {"patient_id":156, "pct_avail": 1.0}, {"patient_id":157, "pct_avail": 1.0}, {"patient_id":158, "pct_avail": 1.0}, {"patient_id":159, "pct_avail": 1.0}, {"patient_id":160, "pct_avail": 1.0}, {"patient_id":161, "pct_avail": 0.96875}, {"patient_id":162, "pct_avail": 1.0}, {"patient_id":163, "pct_avail": 1.0}, {"patient_id":164, "pct_avail": 1.0}, {"patient_id":165, "pct_avail": 1.0}, {"patient_id":166, "pct_avail": 0.9583333333333334}, {"patient_id":167, "pct_avail": 1.0}, {"patient_id":168, "pct_avail": 1.0}, {"patient_id":169, "pct_avail": 0.9895833333333334}, {"patient_id":170, "pct_avail": 1.0}]
                            }


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/histogram                            
function Histogram(data
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
    let svg = d3.create("svg")
        .attr("width", width)
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

  const SecondHistogram = () => {
    const data = dummyFeatureInfo.pct_avail_pp.map(o=>o.pct_avail)
    return Histogram(data,{
        value: d => d,
        label: "Unemployment rate (%) →",
        width:800,
        height: 500,
        color: "steelblue"
      })
    
    
  }
  const ThirdHistogram = () => {
    d3.select("body").insert(SecondHistogram)
}
export default SecondHistogram