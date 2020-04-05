console.log("D3 running");

var width = 900,
height = 500,
padding = 20,
offset_x = 230,
height_level = 5;

var dataset = [
	{name: "Nike x Off-White", id: 'nike_x_off-white', value: 3.96, color: "#FF6E1B"},
	{name: "Adidas x Bape", id: 'adidas_x_bape', value: 2.12, color: "#012605"},
	{name: "Nike Basketball x Fear of God", id: 'nike_x_fog', value: 2.01, color: "#C0C2C3"},
	{name: "Nike x Travis Scott", id: 'nike_x_travis_scott' , value: 1.93, color: "#654321"},
	{name: "Adidas x Yeezy", value: 1.65, id: 'adidas_x_yeezy', color: "#BDBCA8"},
	{name: "Adidas x Pharrell Williams", id: 'adidas_x_pharrell_williams', value: 1.38, color: "#EFBB0F"}
]

var svg = d3.select("#tiers-chart")
.append("svg")
.attr("width", width)
.attr("height", height);

var xScale = d3.scaleLinear()
.domain([0, d3.max(dataset, function(d) { return d.value })])
.rangeRound([0,width-offset_x]);

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
.style("fill", function(d) {
	return d.color;
})
.attr("id", function(d) {
	return d.id
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

// var images = svg.selectAll("image")
// .data(dataset)
// .enter()
// .append("svg:image")
// .attr("xlink:href", function(d) {
// 	return "images/" + d.image;
// })
// .attr("width", width/5)
// .attr("height", width/5/.8)
// .attr("x", function(d, i) {
// 	return xScale(i) + xScale.bandwidth() / 5;
// })
// .attr("y", function(d) {
// 	if (d.name === "Tier Two") {
// 		return height - yScale(d.value) - 235;
// 	} else {
// 		return height - yScale(d.value) - 220;
// 	}
// })
// .attr("pointer-events", "none")

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
.attr("fill", "white")
.attr("text-anchor", "left")
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
