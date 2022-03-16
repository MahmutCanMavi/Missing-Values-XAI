import React from 'react';

import { Margins } from './types/Margins';

import * as d3 from 'd3'


import { useRef, useState, useEffect } from 'react'
import { select, Selection } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'

import SecondHistogram  from './VizObservable'

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

/*
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

 // append the svg object to the body of the page
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
    
  var bin = d3.bin()
      .domain(x.domain())
      .thresholds(x.ticks(20));
  // And apply this function to data to get the bins
  const bins = bin(data);

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


const dummyFeatureInfo = { "feature_name" : "HR",
                            "pct_avail_pp" :
                                [{"patient_id":1, "pct_avail": 0.9375}, {"patient_id":2, "pct_avail": 1.0}, {"patient_id":3, "pct_avail": 1.0}, {"patient_id":4, "pct_avail": 1.0}, {"patient_id":5, "pct_avail": 1.0}, {"patient_id":6, "pct_avail": 1.0}, {"patient_id":7, "pct_avail": 0.9375}, {"patient_id":8, "pct_avail": 0.9895833333333334}, {"patient_id":9, "pct_avail": 1.0}, {"patient_id":10, "pct_avail": 1.0}, {"patient_id":11, "pct_avail": 1.0}, {"patient_id":12, "pct_avail": 1.0}, {"patient_id":13, "pct_avail": 1.0}, {"patient_id":14, "pct_avail": 1.0}, {"patient_id":15, "pct_avail": 1.0}, {"patient_id":16, "pct_avail": 1.0}, {"patient_id":17, "pct_avail": 0.9895833333333334}, {"patient_id":18, "pct_avail": 0.9895833333333334}, {"patient_id":19, "pct_avail": 1.0}, {"patient_id":20, "pct_avail": 0.9895833333333334}, {"patient_id":21, "pct_avail": 0.9791666666666666}, {"patient_id":22, "pct_avail": 1.0}, {"patient_id":23, "pct_avail": 0.9791666666666666}, {"patient_id":24, "pct_avail": 1.0}, {"patient_id":25, "pct_avail": 1.0}, {"patient_id":26, "pct_avail": 1.0}, {"patient_id":27, "pct_avail": 1.0}, {"patient_id":28, "pct_avail": 1.0}, {"patient_id":29, "pct_avail": 0.9583333333333334}, {"patient_id":30, "pct_avail": 1.0}, {"patient_id":31, "pct_avail": 1.0}, {"patient_id":32, "pct_avail": 1.0}, {"patient_id":33, "pct_avail": 0.9895833333333334}, {"patient_id":34, "pct_avail": 1.0}, {"patient_id":35, "pct_avail": 1.0}, {"patient_id":36, "pct_avail": 1.0}, {"patient_id":37, "pct_avail": 1.0}, {"patient_id":38, "pct_avail": 1.0}, {"patient_id":39, "pct_avail": 1.0}, {"patient_id":40, "pct_avail": 1.0}, {"patient_id":41, "pct_avail": 0.9791666666666666}, {"patient_id":42, "pct_avail": 1.0}, {"patient_id":43, "pct_avail": 1.0}, {"patient_id":44, "pct_avail": 0.9895833333333334}, {"patient_id":45, "pct_avail": 1.0}, {"patient_id":46, "pct_avail": 1.0}, {"patient_id":47, "pct_avail": 0.9583333333333334}, {"patient_id":48, "pct_avail": 1.0}, {"patient_id":49, "pct_avail": 1.0}, {"patient_id":50, "pct_avail": 1.0}, {"patient_id":51, "pct_avail": 1.0}, {"patient_id":52, "pct_avail": 1.0}, {"patient_id":53, "pct_avail": 1.0}, {"patient_id":54, "pct_avail": 1.0}, {"patient_id":55, "pct_avail": 1.0}, {"patient_id":56, "pct_avail": 1.0}, {"patient_id":57, "pct_avail": 0.96875}, {"patient_id":58, "pct_avail": 1.0}, {"patient_id":59, "pct_avail": 1.0}, {"patient_id":60, "pct_avail": 1.0}, {"patient_id":61, "pct_avail": 1.0}, {"patient_id":62, "pct_avail": 0.9895833333333334}, {"patient_id":63, "pct_avail": 1.0}, {"patient_id":64, "pct_avail": 1.0}, {"patient_id":65, "pct_avail": 0.9895833333333334}, {"patient_id":66, "pct_avail": 0.9166666666666666}, {"patient_id":67, "pct_avail": 1.0}, {"patient_id":68, "pct_avail": 1.0}, {"patient_id":69, "pct_avail": 1.0}, {"patient_id":70, "pct_avail": 0.9895833333333334}, {"patient_id":71, "pct_avail": 0.9479166666666666}, {"patient_id":72, "pct_avail": 0.9791666666666666}, {"patient_id":73, "pct_avail": 1.0}, {"patient_id":74, "pct_avail": 1.0}, {"patient_id":75, "pct_avail": 1.0}, {"patient_id":76, "pct_avail": 1.0}, {"patient_id":77, "pct_avail": 0.9895833333333334}, {"patient_id":78, "pct_avail": 0.9895833333333334}, {"patient_id":79, "pct_avail": 1.0}, {"patient_id":80, "pct_avail": 1.0}, {"patient_id":81, "pct_avail": 0.96875}, {"patient_id":82, "pct_avail": 1.0}, {"patient_id":83, "pct_avail": 1.0}, {"patient_id":84, "pct_avail": 1.0}, {"patient_id":85, "pct_avail": 1.0}, {"patient_id":86, "pct_avail": 0.9583333333333334}, {"patient_id":87, "pct_avail": 1.0}, {"patient_id":88, "pct_avail": 1.0}, {"patient_id":89, "pct_avail": 1.0}, {"patient_id":90, "pct_avail": 1.0}, {"patient_id":91, "pct_avail": 1.0}, {"patient_id":92, "pct_avail": 1.0}, {"patient_id":93, "pct_avail": 1.0}, {"patient_id":94, "pct_avail": 1.0}, {"patient_id":95, "pct_avail": 1.0}, {"patient_id":96, "pct_avail": 0.9479166666666666}, {"patient_id":97, "pct_avail": 1.0}, {"patient_id":98, "pct_avail": 1.0}, {"patient_id":99, "pct_avail": 1.0}, {"patient_id":100, "pct_avail": 1.0}, {"patient_id":101, "pct_avail": 1.0}, {"patient_id":102, "pct_avail": 1.0}, {"patient_id":103, "pct_avail": 0.90625}, {"patient_id":104, "pct_avail": 1.0}, {"patient_id":105, "pct_avail": 0.9479166666666666}, {"patient_id":106, "pct_avail": 0.8958333333333334}, {"patient_id":107, "pct_avail": 1.0}, {"patient_id":108, "pct_avail": 1.0}, {"patient_id":109, "pct_avail": 0.9791666666666666}, {"patient_id":110, "pct_avail": 0.9583333333333334}, {"patient_id":111, "pct_avail": 1.0}, {"patient_id":112, "pct_avail": 0.9895833333333334}, {"patient_id":113, "pct_avail": 1.0}, {"patient_id":114, "pct_avail": 1.0}, {"patient_id":115, "pct_avail": 1.0}, {"patient_id":116, "pct_avail": 1.0}, {"patient_id":117, "pct_avail": 0.8541666666666666}, {"patient_id":118, "pct_avail": 0.9895833333333334}, {"patient_id":119, "pct_avail": 1.0}, {"patient_id":120, "pct_avail": 1.0}, {"patient_id":121, "pct_avail": 0.9895833333333334}, {"patient_id":122, "pct_avail": 1.0}, {"patient_id":123, "pct_avail": 1.0}, {"patient_id":124, "pct_avail": 1.0}, {"patient_id":125, "pct_avail": 1.0}, {"patient_id":126, "pct_avail": 1.0}, {"patient_id":127, "pct_avail": 1.0}, {"patient_id":128, "pct_avail": 1.0}, {"patient_id":129, "pct_avail": 1.0}, {"patient_id":130, "pct_avail": 1.0}, {"patient_id":131, "pct_avail": 1.0}, {"patient_id":132, "pct_avail": 1.0}, {"patient_id":133, "pct_avail": 0.9791666666666666}, {"patient_id":134, "pct_avail": 1.0}, {"patient_id":135, "pct_avail": 1.0}, {"patient_id":136, "pct_avail": 1.0}, {"patient_id":137, "pct_avail": 1.0}, {"patient_id":138, "pct_avail": 1.0}, {"patient_id":139, "pct_avail": 1.0}, {"patient_id":140, "pct_avail": 1.0}, {"patient_id":141, "pct_avail": 0.9479166666666666}, {"patient_id":142, "pct_avail": 1.0}, {"patient_id":143, "pct_avail": 1.0}, {"patient_id":144, "pct_avail": 1.0}, {"patient_id":145, "pct_avail": 1.0}, {"patient_id":146, "pct_avail": 0.9895833333333334}, {"patient_id":147, "pct_avail": 1.0}, {"patient_id":148, "pct_avail": 1.0}, {"patient_id":149, "pct_avail": 0.9791666666666666}, {"patient_id":150, "pct_avail": 1.0}, {"patient_id":151, "pct_avail": 0.9791666666666666}, {"patient_id":152, "pct_avail": 1.0}, {"patient_id":153, "pct_avail": 1.0}, {"patient_id":154, "pct_avail": 1.0}, {"patient_id":155, "pct_avail": 1.0}, {"patient_id":156, "pct_avail": 1.0}, {"patient_id":157, "pct_avail": 1.0}, {"patient_id":158, "pct_avail": 1.0}, {"patient_id":159, "pct_avail": 1.0}, {"patient_id":160, "pct_avail": 1.0}, {"patient_id":161, "pct_avail": 0.96875}, {"patient_id":162, "pct_avail": 1.0}, {"patient_id":163, "pct_avail": 1.0}, {"patient_id":164, "pct_avail": 1.0}, {"patient_id":165, "pct_avail": 1.0}, {"patient_id":166, "pct_avail": 0.9583333333333334}, {"patient_id":167, "pct_avail": 1.0}, {"patient_id":168, "pct_avail": 1.0}, {"patient_id":169, "pct_avail": 0.9895833333333334}, {"patient_id":170, "pct_avail": 1.0}]
                            }

const Axis: React.FC = () => {
    const data = dummyFeatureInfo.pct_avail_pp.map(o=>o.pct_avail)
    const title = "Feature shown: "+dummyFeatureInfo.feature_name
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


    const domain = [0.5, 1.01] 
    const x = d3.scaleLinear()
        .domain(domain)     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, dimensions.width - dimensions.marginLeft])
     // Y axis: scale and draw:
        
    // set the parameters for the histogram
    
    var bin = d3.bin()
    .domain([domain[0], domain[1]])
    .thresholds(x.ticks(60));
    // And apply this function to data to get the bins
    const bins = bin(data);

    const y = scaleLinear()
        .domain([0, d3.max(bins, b=> b.length)!])
        .range([dimensions.height - dimensions.marginBottom, 0])
        
    

    /**
     * generates axis functions for the given scales
     * when called, axis are rendered at the origin
     * appy transforms to place the axis where they need to be
     * modifications can be aplied to the functions to style the axis
     */
    const xAxis = axisBottom(x)
    const yAxis = axisLeft(y)


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


              
              // append the bar rectangles to the svg element
              
              
            /**
             * you can grab the selection of texts
             * in the xAxisGroup to style them
             
            xAxisGroup
                .selectAll('text')
                .attr('transform', 'rotate(-40)')
                .attr('text-anchor', 'end')
                .attr('font-size', '15px')
                */
            const yAxisGroup = selection
                .append('g')
                .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
                .call(yAxis)

            const charts = selection
                .append('g')
                .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
                .selectAll("rect")
                .data(bins)
                .join("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return `translate(${x(d.x0!)} , ${y(d.length)})`})
                .attr("width", function(d) { return x(d.x1!) - x(d.x0!) -1})!
                .attr("height", function(d) { return dimensions.height - dimensions.marginBottom - y(d.length); })!
                .style("fill", "#69b3a2")
                
            // Axis labels
            selection.append("text")
            .attr("transform", "translate(" + (dimensions.width / 2) + " ," + (dimensions.height - dimensions.marginBottom+40) + ")")
            .style("text-anchor", "middle")
            .text("% of available values for this variable")
            .style("fill", "black");   
            
            selection.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",  dimensions.marginLeft-50)
            .attr("x",0 - (dimensions.chartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("No. of patients")
            .style("fill", "black"); 
            
            selection.style("background-color", "#FFF")
            
            
            // Trying to include Observable vizualisations into React
            // TODO: the better SVG is available but we have to include it somehow with the "selection"          
            console.log(SecondHistogram())
                
                /*
                .selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('width', x.bandwidth)
                .attr('height', d => dimensions.chartHeight - y(d))
                .attr('x',(_,i) => x(""+i)!)
                //translate the bars
                .attr('y', d => y(d))*/
        }
    }, [selection])
    return (<>
        <h1>{title}</h1>
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        </>
    )
}

export default Axis
