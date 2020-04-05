console.log("D3 running");

var box_logo_categories_width = 900,
box_logo_categories_height = 500,
box_logo_categories_padding = 20,
box_logo_categories_yOffset = 35;

var box_logo_categories_dataset = [
	{name: "T-Shirts", value: 12.87, id:1},
	{name: "Skate", value: 4.87, id:2},
	{name: "Tops / Sweatshirts", value: 4.66, id:3},
	{name: "Headwear", value: 2.88, id:4}
]

var box_logo_categories_svg = d3.select("#box_logo_categories-chart")
.append("svg")
.attr("width", box_logo_categories_width)
.attr("height", box_logo_categories_height);

var box_logo_categories_container = d3.select(box_logo_categories_svg.node().parentNode),
box_logo_categories_container_width = parseInt(box_logo_categories_svg.style("width"));

if (parseInt(box_logo_categories_container.style("width")) < 480) {
	box_logo_categories_svg.remove();
	box_logo_categories_container.append("img")
	.attr("src", "images/box_logo_categories.gif")
	.attr("width", "100%")
}

var box_logo_categories_xScale = d3.scaleBand()
.domain(d3.range(box_logo_categories_dataset.length))
.rangeRound([0,box_logo_categories_width])
.paddingInner(0.05);

var box_logo_categories_yScale = d3.scaleLinear()
.domain([0, d3.max(box_logo_categories_dataset, function(d) { return d.value })])
.rangeRound([0,box_logo_categories_height-200]);

var box_logo_categories_rects = box_logo_categories_svg.selectAll("rect")
.data(box_logo_categories_dataset)
.enter()
.append("rect")
.attr("x", function(d, i) {
	return box_logo_categories_xScale(i)
})
.attr("y", function(d) {
	return box_logo_categories_height-box_logo_categories_yScale(d.value) - box_logo_categories_yOffset;
})
.attr("width", box_logo_categories_xScale.bandwidth())
.attr("height", function(d) {
	return box_logo_categories_yScale(d.value)
})
.attr("fill", "red")
.attr("id", function(d) {
	return "rect" + d.id;
})

var box_logo_categories_text = box_logo_categories_svg.selectAll("text")
.data(box_logo_categories_dataset)
.enter()
.append("text")
.text(function(d) {
	return d.name;
})
.attr("x", function(d, i) {
	return box_logo_categories_xScale(i) + box_logo_categories_xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return box_logo_categories_height - 5;
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
var box_logo_categories_stockx_logo = box_logo_categories_svg.append("svg:image")
.attr("xlink:href", "images/stockx_logo.png")
.attr("width", box_logo_categories_width / 10)
.attr("height", box_logo_categories_width / 10 * .75)
.attr("x", box_logo_categories_width - 100)
.attr("y", function() {
	return box_logo_categories_height - 430;
})
.attr("transform", "translate(0,-20)");

var box_logo_categories_value_text = box_logo_categories_svg.selectAll("value_text")
.data(box_logo_categories_dataset)
.enter()
.append("text")
.text(function(d) {
	return d.value + "x";
})
.attr("x", function(d, i) {
	return box_logo_categories_xScale(i) + box_logo_categories_xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return box_logo_categories_height - box_logo_categories_yScale(d.value) - box_logo_categories_yOffset - box_logo_categories_padding;
})
.attr("id", function(d) {
	return "value_text" + d.id;
})
.attr("class", "value_text")
.style("display", "none")

box_logo_categories_rects.on("mouseover", function(d) {

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
