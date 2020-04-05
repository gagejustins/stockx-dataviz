console.log("D3 running");

var csv_link = "https://gist.githubusercontent.com/gagejustins/d9325a11d36a5c138576d6b47fe32250/raw/b90e074247ef0e397e95a9ce1f0aee959cf60e7f/jordan_releases.csv"

var jordan_releases_base_div = d3.select("#jordan-releases-container")
.append("div")
.attr("class", "chart")

function graphJordanReleases(base_div) {

	var width = parseInt(base_div.style("width")),
	height = 600,
	padding = 20;

	var dataset;

	var svg = base_div.append("svg")
	.attr("width", width)
	.attr("height", height);

	var xScale = d3.scaleTime()
	.range([0, width - 230])

	var yScale = d3.scaleLinear()
	.rangeRound([height - 100, 0]);

	var parseDate = d3.timeParse("%Y-%m-%d");

	//Create bisect to get y from x for tooltip
	var bisectDate = d3.bisector(function(d) { return d.date; }).left;

	d3.csv(csv_link, function(data) {

		data.forEach(function(d) {
					d.date = parseDate(moment.utc(d.date).format("YYYY-MM-DD")); 
					d.value = parseFloat(d.value)
		});

		//Set domains for x and y scales
		xScale.domain(d3.extent(data, function(d) { return d.date }));
		yScale.domain([0, d3.max(data, function(d) { return d.value + 1})]);

		//Create x axis
		var xAxis = d3.axisBottom(xScale)
		.ticks(6)
		.tickSizeOuter(0);

		//Create y axis
		var yAxis = d3.axisLeft(yScale)
		.ticks(10);

		//Append x axis
		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(50," + (height - 100) + ")")
		.call(xAxis);

		//Append y axis
		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(50,0)")
		.call(yAxis);

		// define the line
		var line = d3.line()
		.curve(d3.curveCardinal)
			.x(function(d) { return xScale(d.date); })
			.y(function(d) { return yScale(d.value); });

		//Add line path
		var path = svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line)
		.attr("transform", "translate(51,0)");

	});

	//Add StockX logo
	var stockx_logo = svg.append("svg:image")
	.attr("xlink:href", "images/stockx_logo.png")
	.attr("width", width / 12)
	.attr("height", width / 5)
	.attr("x", 70)
	.attr("y", -70)

}

graphJordanReleases(jordan_releases_base_div);