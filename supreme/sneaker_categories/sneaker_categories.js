console.log("D3 running");

var width = 900,
height = 500,
padding = 20,
offset_x = 150,
height_level = 5;

var dataset = [
	{ name: "Foamposite", id: 'foamposite', value: 2.99 },
	{ name: "Basketball", id: 'basketball', value: 2.29 },
	{ name: "Air Jordan", id: 'air_jordan', value: 2.31 },
	{ name: "Air Force", id: 'air_force', value: 1.67 },
	{ name: "Air Max", id: 'air_max', value: 1.62 },
	{ name: "SB", id: 'sb' , value: 1.47 },
]

var svg = d3.select("#tiers-chart")
.append("svg")
.attr("width", width)
.attr("height", height);

var xScale = d3.scaleLinear()
.domain([0, d3.max(dataset, function(d) { return d.value })])
.rangeRound([0,width/1.3-offset_x]);

var yScale = d3.scaleBand()
.domain(d3.range(dataset.length))
.rangeRound([0,height])
.paddingInner(0.05);

var rects = svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attr("x", offset_x)
.attr("y", function(d, i) {
	return yScale(i)
})
.attr("width", function(d) {
	return xScale(d.value)
})
.attr("height", function(d) {
	return yScale.bandwidth()
})
.style("fill", "red")
.attr("id", function(d) {
	return d.id;
})

var text = svg.selectAll("text")
.data(dataset)
.enter()
.append("text")
.text(function(d) {
	return d.name
})
.attr("x", 0)
.attr("y", function(d, i) {
	return yScale(i) + yScale.bandwidth() / 2 + height_level;
})
.attr("font-size", "1.1em")
.attr("fill", "black")
.attr("text-anchor", "left")
.attr("font-weight", "bold")

//Add StockX logo
var stockx_logo = svg.append("svg:image")
.attr("xlink:href", "images/stockx_logo.png")
.attr("width", width / 10)
.attr("height", width / 10 * .75)
.attr("x", width - 100)
.attr("y", function() {
	return height - 50;
})
.attr("transform", "translate(0,-20)");

var value_text = svg.selectAll("value_text")
.data(dataset)
.enter()
.append("text")
.text(function(d) {
	return d.value + "x";
})
.attr("x", offset_x + 20 )
.attr("y", function(d,i) {
	return yScale(i) + yScale.bandwidth() / 2 + height_level
})
.attr("id", function(d) {
	return "value_text" + d.id;
})
.attr("fill", "white")
.attr("text-anchor", "left")
.attr("font-weight", "bold")
.attr("class", "value_text")
.style("pointer-events", "none")
.style("display", "none")

rects.on("mouseover", function(d) {

	var current_rect_id = d.id;

	d3.selectAll("rect")
	.transition()
	.duration(200)
	.style("opacity", function(d) {
		return (d3.select(this).attr("id") == current_rect_id) ? 1.0 : 0.5;
	})

	var value_text_selector = "#value_text" + d.id;

	d3.select(value_text_selector)
	.style("display", "inline");

})
.on("mouseout", function() {

	d3.selectAll("rect")
	.transition()
	.duration(200)
	.style("opacity", 1);

	d3.selectAll(".value_text")
	.style("display", "none");

})
