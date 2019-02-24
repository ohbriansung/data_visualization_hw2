// https://beta.observablehq.com/@jerdak/parallel-coordinates-d3-v4
const margin = {
  top: 70,
  right: 20,
  bottom: 100,
  left: 20
};

translate = function(a, b) {
  return "translate(" + a + ", " + b + ")";
}

sortAxis = function(a, b) {
  if (a == "region") {
    return -1;
  } else {
    return 0;
  }
}

getMin = function(x, dimensions) {
  let minimum = 0;

  for (let i = 0; i < dimensions.length; i++) {
    let temp = x(dimensions[i]);
    if (i == 0) {
      minimum = temp;
    } else {
      minimum = (minimum < temp) ? minimum : temp;
    }
  }

  return minimum;
}

parallelCoordinates = function(data) {
  const svg = d3.select("#vis");
  const bounds = svg.node().getBoundingClientRect();
  const plotWidth = bounds.width - margin.right - margin.left;
  const plotHeight = bounds.height - margin.top - margin.bottom;

  let plot = svg.append("g");
  plot.attr("id", "plot");
  plot.attr("transform", translate(margin.left, margin.top));

  let x = d3.scalePoint().range([0, plotWidth]).padding(.75);
  let y = {};

  let dimensions = d3.keys(data[0]).filter(function(d) {
    if (d == "region" || d == "tier" || d == "par_rank" || d == "k_rank") {
      y[d] = d3.scaleLinear()
          .domain(d3.extent(data, function(p) { return +p[d]; }))
          .range([plotHeight, 0]);

      return true;
    }

    return false;
  }).sort(sortAxis);

  x.domain(dimensions);

  let minimum = getMin(x, dimensions);
  let dimension = plot.selectAll("g")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return translate(x(d) - minimum + margin.left, 0); });

  dimension.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -10)
    .text(function(d) { return d; });

  /*background = plot.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path);

  function path(d) {
    return d3.line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }*/
}

d3.csv(
  "mrc_table2_edited.csv"
)
.then(function(d) {
  parallelCoordinates(d);
})
