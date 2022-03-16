import React from 'react';

import { Margins } from './types/Margins';

import * as d3 from 'd3'


import { useRef, useState, useEffect } from 'react'
import { select, Selection } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'


const DEFAULT_MARGINS: Margins = {
    left: 100,
    top: 50,
    bottom: 70,
    right: 20,
};

// interface Props {
//     data: DataArray;
//     width: number;
//     height: number;
//     margins?: Margins;
// }

// const Visualization: React.FunctionComponent<Props> = ({ data, width, height, margins = DEFAULT_MARGINS }: Props) => {
    // figure bounds
//     const xMax = width - margins.left - margins.right;
//     const yMax = height - margins.top - margins.bottom;
//     const colors = ['yellow', '#FF0000']; //or 'red' 
//     // scales


// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

/* // append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);



  // X axis: scale and draw:
  const x = d3.scaleLinear()
      .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  const histogram = d3.histogram()
      .value(function(d) { return d.price; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  const bins = histogram(data);

  // Y axis: scale and draw:
  const y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", 1)
    .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")



} */



//     const xValues = data.map((d) => d.X1);
//     const xScale = scaleLinear<number>()
//         .domain([Math.min(...xValues), Math.max(...xValues)])
//         .range([0, xMax]);
    
//     const yValues = data.map((d) => d.X2);
//     const yScale = scaleLinear<number>()
//         .domain([Math.min(...yValues), Math.max(...yValues)])
//         .range([0, yMax]);

//     //const dataValues = data.map((d) => d.value);
//     //const valueScale = scaleLinear<number>()
//     //    .domain([Math.min(...dataValues), Math.max(...dataValues)])
//     //    .range([0, 10]);

//     return (
//         <svg width={width} height={height}>
//             <Group left={margins.left} top={margins.top}>

//                 {/* <GridRows scale={yScale} width={xMax} height={yMax} stroke="#eaf0f6" /> */}
//                 {/* <GridColumns scale={xScale} width={xMax} height={yMax} stroke="#eaf0f6" /> */}
//                 {/* <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="white" /> */}
//                 <AxisBottom top={yMax} scale={xScale} stroke='white' />
//                 <AxisLeft scale={yScale} stroke='white' />
//                 <text x="-200" y="-70" transform="rotate(-90)" fontSize={30} fill='white'>
//                     x2
//                 </text>
//                 <text x="500" y="500" transform="rotate(0)" fontSize={30} fill='white'>
//                     x1
//                 </text>
//                 {data.map((d, idx) => (
//                     <DataPointComponent key={idx} x={xScale(d.X1)} y={yScale(d.X2)} color={colors[d.cluster]} />
//                 ))}
//             </Group>
//         </svg>
//     );
// };


const dummyFeatureInfo = {name: "HR", pct_avail_pp:[{patient_id:0, pct_avail:0.98}, {patient_id:134, pct_avail:0.85}]}

const Axis: React.FC = () => {
    const data = dummyFeatureInfo.pct_avail_pp.map(o=>o.pct_avail)
    const title = "Feature shown: "+dummyFeatureInfo.name
    const dimensions = {
        width: 600,
        height: 600,
        marginLeft: 100,
        marginBottom: 100,
        chartHeight: 500,
        chartWidth: 500,
    }
    const svgRef = useRef<null | SVGSVGElement>(null)
    const [selection, setSelection] = useState<null | Selection<
        SVGSVGElement | null,
        unknown,
        null,
        undefined
    >>(null)

    const y = scaleLinear()
        .domain([0, max(data)!])
        .range([dimensions.width - dimensions.marginBottom, 0])

    const x = scaleBand()
        .domain(data.map((_,i) => (""+i)))
        .range([0, dimensions.width - dimensions.marginLeft])
        .padding(0.1)

    /**
     * generates axis functions for the given scales
     * when called, axis are rendered at the origin
     * appy transforms to place the axis where they need to be
     * modifications can be aplied to the functions to style the axis
     */
    const xAxis = axisBottom(x)
    const yAxis = axisLeft(y)
        .ticks(3)
        .tickFormat(d => `${d}`)

    useEffect(() => {
        if (!selection) {
            setSelection(select(svgRef.current))
        } else {
            /**
             * we need to call so we can pass in the current selection
             * calling an axis will return the current seleciton
             * i have separated the groups and put them into variables
             * for readability
             */
            const xAxisGroup = selection
                .append('g')
                .attr(
                    'transform',
                    `translate(${dimensions.marginLeft}, ${
                        dimensions.chartHeight
                    })`
                )
                .call(xAxis)
            /**
             * you can grab the selection of texts
             * in the xAxisGroup to style them
             */
            xAxisGroup
                .selectAll('text')
                .attr('transform', 'rotate(-40)')
                .attr('text-anchor', 'end')
                .attr('font-size', '15px')

            const yAxisGroup = selection
                .append('g')
                .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
                .call(yAxis)

            const charts = selection
                .append('g')
                .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
                .selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('width', x.bandwidth)
                .attr('height', d => dimensions.chartHeight - y(d))
                .attr('x',(_,i) => x(""+i)!)
                //translate the bars
                .attr('y', d => y(d))
        }
    }, [selection])
    return (<>
        <h1>{title}</h1>
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        </>
    )
}

export default Axis