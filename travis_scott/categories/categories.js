function drawGraph(base) {

	var width = parseInt(base.style("width")),
	height = 700,
	padding = 20,
	yOffset = 145,
	xOffset = 50;

	var dataset = [
		{
			name: "Air Force 1", 
			description: "AF100, Sail, Cactus Jack",
			value: 3.05, 
			id:1,
			image: "af1-af100.jpg",
			resale: 472.98
		},
		{
			name: "Jordan", 
			description: "33, 4, AJ1s, 6",
			value: 4.14, 
			id:2,
			image: "jordan-1-high.jpg",
			resale: 733.19
		},
		{
			name: "Jordan (No AJ1 High)", 
			description: "33, 4, 6, AJ1 Low",
			value: 3.26, 
			id:3,
			image: "jordan-6.jpg",
			resale: 582.17
		},
	]

	var svg = base.append("svg")
	.attr("width", width)
	.attr("height", height);

	var container = d3.select(svg.node().parentNode),
	container_width = parseInt(svg.style("width"));

	if (parseInt(container.style("width")) < 480) {
		svg.remove();
		container.append("img")
		.attr("src", "images/categories.gif")
		.attr("width", "100%")
	}

	var xScale = d3.scaleBand()
	.domain(d3.range(dataset.length))
	.rangeRound([0,width-xOffset])
	.paddingInner(0.05);

	var yScale = d3.scaleLinear()
	.domain([0, d3.max(dataset, function(d) { return d.value }) + 3])
	.rangeRound([height, 180]);

	//Create y axis
	var yAxis = d3.axisLeft(yScale)
	.ticks(6)
	.tickFormat(function(d) { return d + "x" });

	//Append y axis
	svg.append("g")
	.attr("class", "axis")
	.attr("transform", `translate(30,${-yOffset-3.5})`)
	.call(yAxis);

	var rects = svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
		return xScale(i)
	})
	.attr("y", function(d) {
		return yScale(d.value) - yOffset;
	})
	.attr("width", xScale.bandwidth())
	.attr("height", function(d) {
		return height - yScale(d.value)
	})
	.attr("fill", "#474A37")
	.attr("id", function(d) {
		return "rect" + d.id;
	})
	.attr("transform", `translate(${xOffset},0)`)

	var text = svg.selectAll("header_text")
	.data(dataset)
	.enter()
	.append("text")
	.text(function(d) {
		return d.name;
	})
	.attr("x", function(d, i) {
		return xScale(i) + xScale.bandwidth() / 2;
	})
	.attr("y", function(d) {
		return height - yOffset + padding*1.5;
	})
	.attr("id", function(d) {
		return "label_text" + d.id; 
	})
	.attr("class", "label_text")
	.attr("transform", `translate(${xOffset},0)`)

	var subtext = svg.selectAll("subtext")
	.data(dataset)
	.enter()
	.append("text")
	.text(function(d) {
		return d.description;
	})
	.attr("x", function(d, i) {
		return xScale(i) + xScale.bandwidth() / 2;
	})
	.attr("y", function(d) {
		return height - yOffset + padding*2.7;
	})
	.attr("id", function(d) {
		return "label_text" + d.id; 
	})
	.attr("class", "sublabel_text")
	.attr("transform", `translate(${xOffset},0)`)

	var images = svg.selectAll("image")
	.data(dataset)
	.enter()
	.append("svg:image")
	.attr("xlink:href", function(d) { return `images/${d.image}` })
	.attr("x", function(d, i) {
		return xScale(i) + xScale.bandwidth() / 2 - padding*2.8;
	})
	.attr("y", function(d) {
		return height - yOffset + padding*3.2;
	})
	.attr("id", function(d) {
		return "label_text" + d.id; 
	})
	.attr("width", width/8)
	.attr("class", "sublabel_image")
	.attr("transform", `translate(${xOffset},0)`)

	//Add StockX logo
	var stockx_logo = svg.append("svg:image")
	.attr("xlink:href", "images/stockx_logo.png")
	.attr("width", width / 14)
	.attr("height", width / 10 * .75)
	.attr("x", width - 70)
	.attr("y", 20)
	.attr("transform", "translate(0,-20)");

	var value_text = svg.selectAll("value_text")
	.data(dataset)
	.enter()
	.append("text")
	.text(function(d) {
		return d.value + "x";
	})
	.attr("x", function(d, i) {
		return xScale(i) + xScale.bandwidth() / 2;
	})
	.attr("y", function(d) {
		return yScale(d.value) - yOffset - padding*1.8;
	})
	.attr("id", function(d) {
		return "value_text" + d.id;
	})
	.attr("class", "value_text")
	.style("display", "none")
	.attr("transform", `translate(${xOffset},0)`)

	var resale_text = svg.selectAll("resale_text")
	.data(dataset)
	.enter()
	.append("text")
	.text(function(d) {
		return "$" + d.resale;
	})
	.attr("x", function(d, i) {
		return xScale(i) + xScale.bandwidth() / 2;
	})
	.attr("y", function(d) {
		return yScale(d.value) - yOffset - padding/1.4;
	})
	.attr("id", function(d) {
		return "value_text" + d.id;
	})
	.attr("class", "value_text")
	.style("display", "none")
	.attr("transform", `translate(${xOffset},0)`)
	.style("font-family", "Ringside, sans-serif")

	rects.on("mouseover", function(d) {

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

		d3.selectAll(".label_text,.sublabel_text,.sublabel_image")
		.transition()
		.duration(200)
		.style("opacity", function(d) {
			return (d3.select(this).attr("id") == current_label_id) ? 1.0 : 0.3;
		});

		value_text_selector = "#" + "value_text" + d.id;

		d3.selectAll(value_text_selector)
		.style("display", "inline");

	})
	.on("mouseout", function() {

		//Darken all rects
		d3.selectAll("rect")
		.transition()
		.duration(200)
		.style("opacity", 1);

		//Darken all label text
		d3.selectAll(".label_text,.sublabel_text,.sublabel_image")
		.style("opacity", 1);

		d3.selectAll(".value_text, .resale_text")
		.style("display", "none");

	})
}

var graph_base = d3.select('#categories-chart')
.append("div")
.attr("class", "chart")