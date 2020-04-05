console.log("D3 running");

var tiers_width = 900,
tiers_height = 500,
tiers_padding = 20;

var tiers_dataset = [
	{name: "The Ten", value: 895.64, color: "#FF6E1B", image: "af1.png"},
	{name: "Jan 2018 – Oct 2018", value: 713.22, color: "#191C20", image: "blazer.png"},
	{name: "Nov 2018 – Feb 2019", value: 334.90, color: "#F3487A", image: "vaporfly.png"}
]

var tiers_svg = d3.select("#tiers-chart")
.append("svg")
.attr("width", tiers_width)
.attr("height", tiers_height);

var tiers_xScale = d3.scaleBand()
.domain(d3.range(tiers_dataset.length))
.rangeRound([0,tiers_width])
.paddingInner(0.05);

var tiers_yScale = d3.scaleLinear()
.domain([0, d3.max(tiers_dataset, function(d) { return d.value })])
.rangeRound([0,tiers_height-200]);

var tiers_rects = tiers_svg.selectAll("rect")
.data(tiers_dataset)
.enter()
.append("rect")
.attr("x", function(d, i) {
	return tiers_xScale(i)
})
.attr("y", function(d) {
	return tiers_height-tiers_yScale(d.value)
})
.attr("width", tiers_xScale.bandwidth())
.attr("height", function(d) {
	return tiers_yScale(d.value)
})
.attr("fill", function(d) {
	return d.color;
})

var tiers_text = tiers_svg.selectAll("text")
.data(tiers_dataset)
.enter()
.append("text")
.text(function(d) {
	return d.name;
})
.attr("x", function(d, i) {
	return tiers_xScale(i) + tiers_xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return tiers_height - tiers_yScale(d.value) - 25;
})
.attr("font-size", "1.1em")
.attr("fill", "black")
.attr("text-anchor", "middle")
.style("font-weight", "bold")

var tiers_images = tiers_svg.selectAll("image")
.data(tiers_dataset)
.enter()
.append("svg:image")
.attr("xlink:href", function(d) {
	return "http://s3.amazonaws.com/stockx-sneaker-analysis/wp-content/uploads/2019/02/" + d.image;
})
.attr("width", tiers_width/5)
.attr("height", tiers_width/5/.8)
.attr("x", function(d, i) {
	return tiers_xScale(i) + tiers_xScale.bandwidth() / 5;
})
.attr("y", function(d) {
	if (d.name === "Jan 2018 – Oct 2018") {
		return tiers_height - tiers_yScale(d.value) - 236;
	} else {
		return tiers_height - tiers_yScale(d.value) - 220;
	}
})
.attr("pointer-events", "none")

//Add StockX logo
var tiers_stockx_logo = tiers_svg.append("svg:image")
.attr("xlink:href", "http://stockx-assets.imgix.net/logo/stockx-homepage-logo-dark.svg?auto=compress,format")
.attr("width", tiers_width / 6)
.attr("x", tiers_width - 100)
.attr("y", function() {
	return tiers_height - 430;
})
.attr("transform", "translate(0,-20)");

var tiers_value_text = tiers_svg.selectAll("value_text")
.data(tiers_dataset)
.enter()
.append("text")
.text(function(d) {
	return "$" + d.value;
})
.attr("x", function(d, i) {
	return tiers_xScale(i) + tiers_xScale.bandwidth() / 2;
})
.attr("y", function(d) {
	return tiers_height - 20;
})
.attr("font-family", "inherit, sans-serif")
.attr("font-size", "1em")
.attr("fill", "white")
.attr("text-anchor", "middle")
.attr("class", "value_text")
.style("pointer-events", "none")
.style("display", "none")

tiers_rects.on("mouseover", function() {

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
