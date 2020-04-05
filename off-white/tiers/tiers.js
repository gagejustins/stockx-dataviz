console.log("D3 running");

var width = 900,
height = 500,
padding = 20;

var dataset = [
	{name: "The Ten", value: 895.64, color: "#FF6E1B", image: "af1.png"},
	{name: "Tier Two", value: 713.22, color: "#191C20", image: "blazer.png"},
	{name: "Last Five", value: 334.90, color: "#F3487A", image: "vaporfly.png"}
]

var svg = d3.select("#tiers-chart")
.append("svg")
.attr("width", width)
.attr("height", height);

var container = d3.select(svg.node().parentNode),
width = parseInt(svg.style("width"));

if (parseInt(container.style("width")) < 480) {
	svg.remove();
	container.append("img")
	.attr("src", "images/resale.gif")
	.attr("width", "100%")
}

var xScale = d3.scaleBand()
.domain(d3.range(dataset.length))
.rangeRound([0,width])
.paddingInner(0.05);

var yScale = d3.scaleLinear()
.domain([0, d3.max(dataset, function(d) { return d.value })])
.rangeRound([0,height-200]);

var rects = svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attr("x", function(d, i) {
	return xScale(i)
})
.attr("y", function(d) {
	return height-yScale(d.value)
})
.attr("width", xScale.bandwidth())
.attr("height", function(d) {
	return yScale(d.value)
})
.attr("fill", function(d) {
	return d.color;
})

var text = svg.selectAll("text")
.data(dataset)
.enter()
.append("text")
.text(function(d) {
	return "\"" + (d.name).toUpperCase() + "\"";
})
.attr("x", function(d, i) {
	return xScale(i) + xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return height - yScale(d.value) - 25;
})
.attr("font-family", "Helvetica, sans-serif")
.attr("font-size", "1.1em")
.attr("fill", "black")
.attr("text-anchor", "middle")
.attr("font-weight", "bold")

var images = svg.selectAll("image")
.data(dataset)
.enter()
.append("svg:image")
.attr("xlink:href", function(d) {
	return "images/" + d.image;
})
.attr("width", width/5)
.attr("height", width/5/.8)
.attr("x", function(d, i) {
	return xScale(i) + xScale.bandwidth() / 5;
})
.attr("y", function(d) {
	if (d.name === "Tier Two") {
		return height - yScale(d.value) - 235;
	} else {
		return height - yScale(d.value) - 220;
	}
})
.attr("pointer-events", "none")

//Add StockX logo
var stockx_logo = svg.append("svg:image")
.attr("xlink:href", "images/stockx_logo.png")
.attr("width", width / 10)
.attr("height", width / 10 * .75)
.attr("x", width - 100)
.attr("y", function() {
	return height - 430;
})
.attr("transform", "translate(0,-20)");

var value_text = svg.selectAll("value_text")
.data(dataset)
.enter()
.append("text")
.text(function(d) {
	return "$" + d.value;
})
.attr("x", function(d, i) {
	return xScale(i) + xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return height - 20;
})
.attr("font-family", "Ringside, sans-serif")
.attr("font-size", "1em")
.attr("fill", "white")
.attr("text-anchor", "middle")
.attr("font-weight", "bold")
.attr("class", "value_text")
.style("pointer-events", "none")
.style("display", "none")

rects.on("mouseover", function() {

	d3.select(this)
	.transition()
	.duration(200)
	.style("opacity", .5);

	d3.selectAll(".value_text")
	.style("display", "inline");

})
.on("mouseout", function() {

	d3.select(this)
	.transition()
	.duration(200)
	.style("opacity", 1);

	d3.selectAll(".value_text")
	.style("display", "none");

})
