import * as d3 from 'd3'

function groupcolor(id) {
  console.log(id)
  if (id == null) {
    return "#000";
  }
  else {
    const colors = ["#07c4b2", "#6f5ed3", "#ce3665", "#ffcd1c", "#3896e3", "#db61db", "#929a9b", "#59cb59", "#fc8943", "#db3e3e"];
    return colors[id % 10];
  }
}




// Source https://observablehq.com/@mbostock/the-impact-of-vaccines
function DetailSquares(svg, data, ylabel,setSelectedPatient) {
  // const data = JSON.parse(datastring.replaceAll("NaN","null"));
  // const sumNulls=(row)=>row.map(v=>v===null?1:0).reduce((a,b)=>a+b,0);
  // data.values=data.values.sort((row1,row2)=>sumNulls(row1) > sumNulls(row2));

  if (ylabel==="feature name"){
    // const isTextVar=false;
    // data.colorvalues= data.values.map(row=>{
    //   let istextrow= row.map(v => typeof (v) === "string").reduce((a, b) => a || b);
    //   let rowcolor 
    //   if (istextrow) {
        
    //     rowcolor = d3.scaleOrdinal().domain(row)
    //     .range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"])
        
    //   }
    //   else {
    //     rowcolor = d3.scaleSequential([d3.min(row), d3.max(row)], d3.interpolatePuRd)
    //   }
    //   return row.map(v=>rowcolor(v))
    // })
  }
  else{
    // data.colorvalues=values;
  }
  const isTextVar = data.values.map(r => r.map(v => typeof (v) === "string").reduce((a, b) => a || b)).reduce((a, b) => a || b);
   

  let margin = {}
  margin = { top: 40, right: 1, bottom: 40, left: 50 };
  const height = 10;
  const width = 1000;
  const innerHeight = height * data.names.length;
  const format = (() => {
    return (d) => d;
    const f = d3.format(",d");
    return d => isNaN(d) ? "N/A cases"
      : d === 0 ? "0 cases"
        : d < 1 ? "<1 case"
          : d < 1.5 ? "1 case"
            : `${f(d)} cases`;
  })()


  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .attr("id","yAxis")
    .call(d3.axisLeft(y).tickSize(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .attr("transform", `translate(-35,60) rotate(-90)`)
      .text(ylabel));

  const xAxis = g => g
    .call(g => g.append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(null, "d"))
      .call(g => g.select(".domain").remove()))
      .call(g => g.append("text")
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .attr("transform", `translate(${margin.left + 30},${margin.top-20})`)
      .text("hours"));
    // .call(g => g.append("g")
    //   .attr("transform", `translate(0,${innerHeight + margin.top + 4})`)
    //   .call(d3.axisBottom(x)
    //     .tickValues([data.year])
    //     .tickFormat(x => x)
    //     .tickSize(-innerHeight - 10))
      // .call(g => g.select(".tick text")
      //     .clone()
      //     .attr("dy", "2em")
      //     .style("font-weight", "bold")
      //     .text("Measles vaccine introduced"))
      // .call(g => g.select(".domain").remove()));

  let color = d3.scaleSequential([0, d3.max(data.values, d => d3.max(d))], d3.interpolatePuRd)
  if (isTextVar) {
    
    color = d3.scaleOrdinal().domain(data.values.reduce((a,b)=>[...a,...b]))
    .range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"])
    
  }
  const y = d3.scaleBand()
    .domain(data.names)
    .rangeRound([margin.top, margin.top + innerHeight])

  const x = d3.scaleLinear()
    .domain([d3.min(data.years), d3.max(data.years) + 1])
    .rangeRound([margin.left, width - margin.right])


  svg
    .attr("viewBox", [0, 0, width, innerHeight + margin.top + margin.bottom])
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);

  svg.append("g")
    .call(xAxis)


  svg.append("g")
    .call(yAxis);


  svg.append("g")
    .selectAll("g")
    .data(data.values)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${y(data.names[i])})`)
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", (d, i) => x(data.years[i]) + 1)
    .attr("width", (d, i) => x(data.years[i] + 1) - x(data.years[i]) - 1)
    .attr("height", y.bandwidth() - 1)
    .attr("fill", (d) => d===null? "#000": d === 0 ? "#fff" : color(d))
    .append("title")
    .text((d) => {return `${format(d)}`});
  
    if (ylabel==="patient_id"){
      svg.select("#yAxis").selectAll(".tick").on("click",(d)=>{setSelectedPatient(d.srcElement.__data__)})
    }
  return svg.node();



}

export default DetailSquares