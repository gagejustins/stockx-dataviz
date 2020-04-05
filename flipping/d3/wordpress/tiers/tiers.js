console.log("D3 running");

var premiums_base_div = d3.select("#premiums-chart-container")
.append("div")
.attr("class", "chart");

var premiums_width = parseInt(premiums_base_div.style("width")),
premiums_height = 500,
premiums_padding = 20,
premiums_yOffset = 35;

var premiums_dataset = [
	{name: "< 1x", value: 27.7, id:1},
	{name: "1x - 2x", value: 57.5, id:2},
	{name: "2x - 3x", value: 9.1, id:3},
	{name: "3x - 5x", value: 4.5, id:4},
	{name: "5x - 10x", value: 1, id:5},
	{name: "> 10x", value: 0.1, id:6}
]

var premiums_svg = d3.select("#tiers-chart")
.append("svg")
.attr("width", premiums_width)
.attr("height", premiums_height);

var premiums_container = d3.select(premiums_svg.node().parentNode),
premiums_container_width = parseInt(premiums_svg.style("width"));

if (parseInt(premiums_container.style("width")) < 480) {
	premiums_svg.remove();
	premiums_container.append("img")
	.attr("src", "images/resale.gif")
	.attr("width", "100%")
}

var premiums_xScale = d3.scaleBand()
.domain(d3.range(premiums_dataset.length))
.rangeRound([0,premiums_width])
.paddingInner(0.05);

var premiums_yScale = d3.scaleLinear()
.domain([0, d3.max(premiums_dataset, function(d) { return d.value })])
.rangeRound([0,premiums_height-200]);

var premiums_rects = premiums_svg.selectAll("rect")
.data(premiums_dataset)
.enter()
.append("rect")
.attr("x", function(d, i) {
	return premiums_xScale(i);
})
.attr("y", function(d) {
	return premiums_height-premiums_yScale(d.value) - premiums_yOffset;
})
.attr("width", premiums_xScale.bandwidth())
.attr("height", function(d) {
	return premiums_yScale(d.value)
})
.attr("fill", function(d) {
	return d.color;
})
.attr("id", function(d) {
	return "rect" + d.id;
})

var premiums_text = premiums_svg.selectAll("text")
.data(premiums_dataset)
.enter()
.append("text")
.text(function(d) {
	return d.name.toUpperCase();
})
.attr("x", function(d, i) {
	return premiums_xScale(i) + premiums_xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return premiums_height - 5;
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
var premiums_stockx_logo = premiums_svg.append("svg:image")
.attr("xlink:href", "images/stockx_logo.png")
.attr("width", premiums_width / 10)
.attr("height", premiums_width / 10 * .75)
.attr("x", premiums_width - 100)
.attr("y", function() {
	return premiums_height - 430;
})
.attr("transform", "translate(0,-20)");

var premiums_value_text = premiums_svg.selectAll("value_text")
.data(premiums_dataset)
.enter()
.append("text")
.text(function(d) {
	return d.value + "%";
})
.attr("x", function(d, i) {
	return premiums_xScale(i) + premiums_xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return premiums_height - premiums_yScale(d.value) - premiums_yOffset - premiums_padding;
})
.attr("id", function(d) {
	return "value_text" + d.id;
})
.attr("class", "value_text")
.style("display", "none")

premiums_rects.on("mouseover", function(d) {

	//Lighten all rects that aren't the current one
	var current_rect_id = d3.select(this).attr("id");

	d3.selectAll("rect")
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

	d3.select(value_text_selector)
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

})
