sort_by_k_rank = function(a, b) {
  return +a["k_rank"] - +b["k_rank"];
}

highlight = function(data) {
  const margin = {
    top: 30,
    right: 10,
    bottom: 20,
    left: 20
  };

  const svg = d3.select("#highlight");
  const bounds = svg.node().getBoundingClientRect();
  const plotWidth = bounds.width - margin.right - margin.left;
  const plotHeight = bounds.height - margin.top - margin.bottom;

  data = data.sort(sort_by_k_rank);  // move highlight to top

  let plot = svg.append("g");
  plot.attr("id", "plot");
  plot.attr("transform", translate(margin.left, margin.top));

  let x = d3.scalePoint().range([0, plotWidth]).padding(0.08);
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

  let minimum = getMin(x, dimensions) - margin.left;

  // draw lines and colors
  let background = plot.append("g")
    .attr("class", "line")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", function(d) {
      if (+d["k_rank"] > 0.9) {
        return colors[d["tier_name"]];
      } else {
        return "#F0F0F0";
      }
    });

  // draw axises
  let dimension = plot.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return translate(x(d) - minimum, 0); });

  // axis titles
  dimension.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -10)
    .text(function(d) { return d; });

  function path(d) {
    return d3.line()(dimensions.map(function(p) { return [x(p) - minimum, y[p](+d[p])]; }));
  }
}
