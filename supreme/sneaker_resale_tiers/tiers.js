console.log("D3 running");

var width = 900,
height = 500,
padding = 20,
yOffset = 35;

var dataset = [
	{name: "< 1x", value: 25, id:1},
	{name: "1x - 2x", value: 45.6, id:2},
	{name: "2x - 3x", value: 14.4, id:3},
	{name: "3x - 5x", value: 8.1, id:4},
	{name: "5x - 10x", value: 4.4, id:5},
	{name: "> 10x", value: 2.5, id:6}
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
	return height-yScale(d.value) - yOffset;
})
.attr("width", xScale.bandwidth())
.attr("height", function(d) {
	return yScale(d.value)
})
.attr("fill", function(d) {
	return d.color;
})
.attr("id", function(d) {
	return "rect" + d.id;
})
.attr("class", "main_rect")

var text = svg.selectAll("text")
.data(dataset)
.enter()
.append("text")
.text(function(d) {
	return d.name.toUpperCase();
})
.attr("x", function(d, i) {
	return xScale(i) + xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return height - 5;
})
.attr("id", function(d) {
	return "label_text" + d.id; 
})
.attr("font-size", "1.1em")
.attr("class", "label_text")
.attr("fill", "black")
.attr("text-anchor", "middle")
.attr("font-weight", "bold")

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

//This is the background for the Supreme "red" on hover
var text_rects = svg.selectAll("textRect")
.data(dataset)
.enter()
.append("rect")
.attr("width", 60)
.attr("height", 28)
.attr("x", function(d, i) {
	return xScale(i) + xScale.bandwidth() / 2 - padding*1.5;
})
.attr("y", function(d) {
	return height - yScale(d.value) - yOffset - padding*2;
})
.attr("id", function(d) {
	return "value_rect" + d.id;
})
.attr("fill", "red")
.attr("class", "value_rect")
.attr("display", "none")

var value_text = svg.selectAll("value_text")
.data(dataset)
.enter()
.append("text")
.text(function(d) {
	return d.value + "%";
})
.attr("x", function(d, i) {
	return xScale(i) + xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return height - yScale(d.value) - yOffset - padding;
})
.attr("id", function(d) {
	return "value_text" + d.id;
})
.attr("class", "value_text")
.style("display", "none")

rects.on("mouseover", function(d) {

	//Lighten all rects that aren't the current one
	var current_rect_id = d3.select(this).attr("id");

	d3.selectAll(".main_rect")
	.transition()
	.duration(200)
	.style("opacity", function(d) {
		return (d3.select(this).attr("id") == current_rect_id) ? 1.0 : 0.5;
	});

	//Lighten all label text that isn't the current one
	var current_label_id = "label_text" + d.id; 

	d3.selectAll(".label_text")
	.transition()
	.duration(200)
	.style("opacity", function(d) {
		return (d3.select(this).attr("id") == current_label_id) ? 1.0 : 0.5;
	});

	value_text_selector = "#" + "value_text" + d.id;
	value_rect_selector = "#" + "value_rect" + d.id;

	d3.select(value_text_selector)
	.style("display", "inline");

	d3.select(value_rect_selector)
	.style("display", "inline");

})
.on("mouseout", function() {

	//Darken all rects
	d3.selectAll("rect")
	.transition()
	.duration(200)
	.style("opacity", 1);

	//Darken all label text
	d3.selectAll(".label_text")
	.style("opacity", 1);

	d3.selectAll(".value_text")
	.style("display", "none");

	d3.selectAll(".value_rect")
	.style("display", "none");

})
