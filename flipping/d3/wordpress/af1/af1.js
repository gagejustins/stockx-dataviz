console.log("D3 running");

var af1_csv_link = "https://gist.githubusercontent.com/gagejustins/94a304463e460e83601b12fc0033a5f3/raw/e617b9aa3733d1d9b5d3c0855da2e0be6fe0b6d4/af1.csv"

var af1_width = 1000,
af1_height = 600,
af1_padding = 20;

var af1_dataset;

var af1_svg = d3.select("#af1-chart")
.append("svg")
.attr("width", af1_width)
.attr("height", af1_height);

var af1_xScale = d3.scaleTime()
.range([0, af1_width - 200])

var af1_yScale = d3.scaleLinear()
.rangeRound([af1_height - 100, 0]);

var af1_parseDate = d3.timeParse("%Y-%m-%d");

//Create bisect to get y from x for tooltip
var af1_bisectDate = d3.bisector(function(d) { return d.sale_date; }).left;

d3.csv(af1_csv_link, function(data) {

	data.forEach(function(d) {
        d.sale_date = af1_parseDate(moment.utc(d.sale_date).format("YYYY-MM-DD")); 
        d.sale_price = parseFloat(d.sale_price)
 	});

	//Set domains for x and y scales
	af1_xScale.domain(d3.extent(data, function(d) { return d.sale_date }));
	af1_yScale.domain([0, d3.max(data, function(d) { return d.sale_price + 150 })]);

	//Create x axis
	var af1_xAxis = d3.axisBottom(af1_xScale)
	.ticks(6)
	.tickSizeOuter(0);

	//Create y axis
	var af1_yAxis = d3.axisLeft(af1_yScale)
	.ticks(10);

	//Append x axis
	af1_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + (af1_height - 100) + ")")
	.call(af1_xAxis);

	//Append y axis
	af1_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50,0)")
	.call(af1_yAxis);

	// define the line
	var af1_line = d3.line()
	.curve(d3.curveCardinal)
    .x(function(d) { return af1_xScale(d.sale_date); })
    .y(function(d) { return af1_yScale(d.sale_price); });

    //Add line path
    var af1_path = af1_svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", af1_line)
    .attr("transform", "translate(51,0)");

    //Group to contain circle and text for tooltip
  	var af1_focus = af1_svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Tooltip line
  	var af1_tooltip_line = af1_svg.append("rect")
  	.attr("height", af1_height - 100)
  	.attr("width", "1px")
  	.attr("y", 0)
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Tooltip circle
  	af1_focus.append("circle")
  	.attr("r", 6.5);

  	af1_focus.append("text")
  	.attr("x", 9)
  	.attr("dy", ".35em");

  	//Rectangle over over entire svg 
  	af1_svg.append("rect")
	.attr("class", "overlay")
	.attr("width", af1_width - 100)
	.attr("height", af1_height)
	.attr("transform", "translate(50,0)")
	.on("mouseover", function() { 
		//Set the focus set and the tooltip line to display themselves
		af1_focus.style("display", null);
		af1_tooltip_line.style("display", null);
	})
	.on("mouseout", function() { 
		//Set the focus set and the tooltip line to disappear
		af1_focus.style("display", "none");
		af1_tooltip_line.style("display", "none"); 
	})
	.on("mousemove", af1_mousemove);

  	function af1_mousemove() {

  		//Use current mouse x to get dataset x (by inverting the xScale)
	    var af1_dataset_x = af1_xScale.invert(d3.mouse(this)[0]);

	    //Use dataset x to get dataset y
	    var af1_data_item = data[af1_bisectDate(data, af1_dataset_x)];

	    //Update location of line
	    af1_tooltip_line.attr("x", af1_xScale(af1_data_item.sale_date));

	    //Update location of circle
	    af1_focus.attr("transform", "translate(" + (af1_xScale(af1_data_item.sale_date) + 50) + "," + af1_yScale(af1_data_item.sale_price) + ")");
	    
	    //Update text value
	    af1_focus.select("text").text("$" + d3.format(",.0f")(af1_data_item.sale_price));
    }

	//Add AF1 image
	var af1_image = af1_svg.append("svg:image")
	.attr("xlink:href", "images/af1.png")
	.attr("width", af1_width/7)
	.attr("x", af1_width - 153)
	.attr("y", function() {
		return af1_yScale(data[data.length - 1].sale_price) - 40;
	})
	.attr("pointer-events", "none");

});

//Add StockX logo
var af1_stockx_logo = af1_svg.append("svg:image")
.attr("xlink:href", "http://stockx-assets.imgix.net/logo/stockx-homepage-logo-dark.svg?auto=compress,format")
.attr("width", af1_width / 10)
.attr("height", af1_width / 5)
.attr("x", af1_width - 255)
.attr("y", af1_height - 250)