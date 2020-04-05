console.log("D3 running");

var collabs_width = 900,
collabs_height = 500,
collabs_padding = 20,
collabs_offset_x = 230,
collabs_height_level = 5;

var collabs_dataset = [
	{name: "Nike x Off-White", id: 'nike_x_off-white', value: 3.96, color: "#FF6E1B"},
	{name: "Adidas x Bape", id: 'adidas_x_bape', value: 2.12, color: "#012605"},
	{name: "Nike Basketball x Fear of God", id: 'nike_x_fog', value: 2.01, color: "#C0C2C3"},
	{name: "Nike x Travis Scott", id: 'nike_x_travis_scott' , value: 1.93, color: "#654321"},
	{name: "Adidas x Yeezy", value: 1.65, id: 'adidas_x_yeezy', color: "#BDBCA8"},
	{name: "Adidas x Pharrell Williams", id: 'adidas_x_pharrell_williams', value: 1.38, color: "#EFBB0F"}
]

var collabs_svg = d3.select("#collabs-chart")
.append("svg")
.attr("width", collabs_width)
.attr("height", collabs_height);

var collabs_xScale = d3.scaleLinear()
.domain([0, d3.max(collabs_dataset, function(d) { return d.value })])
.rangeRound([0,collabs_width-collabs_offset_x]);

var collabs_yScale = d3.scaleBand()
.domain(d3.range(collabs_dataset.length))
.rangeRound([0,collabs_height])
.paddingInner(0.05);

var collabs_rects = collabs_svg.selectAll("rect")
.data(collabs_dataset)
.enter()
.append("rect")
.attr("x", collabs_offset_x)
.attr("y", function(d, i) {
	return collabs_yScale(i)
})
.attr("width", function(d) {
	return collabs_xScale(d.value)
})
.attr("height", function(d) {
	return collabs_yScale.bandwidth()
})
.style("fill", function(d) {
	return d.color;
})
.attr("id", function(d) {
	return d.id
})

var collabs_text = collabs_svg.selectAll("text")
.data(collabs_dataset)
.enter()
.append("text")
.text(function(d) {
	return d.name
})
.attr("x", 0)
.attr("y", function(d, i) {
	return collabs_yScale(i) + collabs_yScale.bandwidth() / 2 + collabs_height_level;
})
.attr("font-size", "1.1em")
.attr("fill", "black")
.attr("text-anchor", "left")
.attr("font-weight", "bold")

//Add StockX logo
var collabs_stockx_logo = collabs_svg.append("svg:image")
.attr("xlink:href", "images/stockx_logo.png")
.attr("width", collabs_width / 10)
.attr("height", collabs_width / 10 * .75)
.attr("x", collabs_width - 100)
.attr("y", function() {
	return collabs_height - 50;
})
.attr("transform", "translate(0,-20)");

var collabs_value_text = collabs_svg.selectAll("value_text")
.data(collabs_dataset)
.enter()
.append("text")
.text(function(d) {
	return d.value + "x";
})
.attr("x", collabs_offset_x + 20 )
.attr("y", function(d,i) {
	return collabs_yScale(i) + collabs_yScale.bandwidth() / 2 + collabs_height_level
})
.attr("fill", "white")
.attr("text-anchor", "left")
.attr("font-weight", "bold")
.attr("class", "value_text")
.style("pointer-events", "none")
.style("display", "none")

collabs_rects.on("mouseover", function() {

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
