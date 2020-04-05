console.log("D3 running");

var width = 900,
height = 500,
padding = 20,
offset_x = 120,
height_level = 5;

var dataset = [
	{ name: "Nike", id: 'nike', value: 81 },
	{ name: "Vans", id: 'vans', value: 30 },
	{ name: "Timberland", id: 'timberland' , value: 11 },
	{ name: "Dr. Martens", id: 'dr_martens', value: 7 },
	{ name: "Louis Vuitton", id: 'louis_vuitton', value: 7 },
	{ name: "Clarks", id: 'clarks', value: 5 },
	{ name: "The North Face", id: 'the_north_face', value: 2 },
]

var svg = d3.select("#supreme-sneaker-brands-chart")
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

var images = svg.selectAll("image")
.data(dataset)
.enter()
.append("svg:image")
.attr("xlink:href", function(d) {
	return "images/" + d.id + ".png";
})
.attr("width", 75)
.attr("height", 75)
.attr("x", 0)
.attr("y", function(d, i) {
	return yScale(i);
})
.attr("pointer-events", "none")

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
	return d.value;
})
.attr("x", function(d) {
	if (d.value <= 3) {
		return offset_x + 30;
	} else {
		return offset_x + 20;
	}
})
.attr("y", function(d,i) {
	return yScale(i) + yScale.bandwidth() / 2 + height_level
})
.attr("fill", function(d) {
	if (d.value <= 3) {
		return "black";
	} else {
		return "white";
	}
})
.attr("id", function(d) {
	return "value_text" + d.id;
})
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
