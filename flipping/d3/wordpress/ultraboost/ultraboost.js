console.log("D3 running");

var ultraboost_csv_link = "https://gist.githubusercontent.com/gagejustins/818095827e4bd04765a96022374a390f/raw/36f5699c2d08c38f6fc70e47cf1254da3d8ca36a/ultraboost.csv"

var ultraboost_base_div = d3.select("#ultraboost-chart-container")
.append("div")
.attr("class", "chart");

var ultraboost_width = parseInt(ultraboost_base_div.style("width")),
ultraboost_height = 600,
ultraboost_padding = 20;

var ultraboost_dataset;

var ultraboost_svg = d3.select("#ultraboost-chart-container .chart")
.append("svg")
.attr("width", ultraboost_width)
.attr("height", ultraboost_height);

var ultraboost_xScale = d3.scaleTime()
.range([0, ultraboost_width - 200])

var ultraboost_yScale = d3.scaleLinear()
.rangeRound([ultraboost_height - 100, ultraboost_padding]);

var ultraboost_parseDate = d3.timeParse("%Y-%m-%d");

//Create bisect to get y from x for tooltip
var ultraboost_bisectDate = d3.bisector(function(d) { return d.sale_date; }).left;

d3.csv(ultraboost_csv_link, function(data) {

	data.forEach(function(d) {
        d.sale_date = ultraboost_parseDate(moment.utc(d.sale_date).format("YYYY-MM-DD")); 
        d.sale_price = parseFloat(d.sale_price)
 	});

	//Set domains for x and y scales
	ultraboost_xScale.domain(d3.extent(data, function(d) { return d.sale_date }));
	ultraboost_yScale.domain([0, d3.max(data, function(d) { return d.sale_price + 100 })]);

	//Create x axis
	var ultraboost_xAxis = d3.axisBottom(ultraboost_xScale)
	.ticks(6)
	.tickSizeOuter(0);

	//Create y axis
	var ultraboost_yAxis = d3.axisLeft(ultraboost_yScale)
	.ticks(10);

	//Append x axis
	ultraboost_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + (ultraboost_height - 100) + ")")
	.call(ultraboost_xAxis);

	//Append y axis
	ultraboost_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50,0)")
	.call(ultraboost_yAxis);

	// define the line
	var ultraboost_line = d3.line()
	.curve(d3.curveCardinal)
    .x(function(d) { return ultraboost_xScale(d.sale_date); })
    .y(function(d) { return ultraboost_yScale(d.sale_price); });

    //Add line path
    var ultraboost_path = ultraboost_svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", ultraboost_line)
    .attr("transform", "translate(51,0)");

    //Group to contain circle and text for tooltip
  	var ultraboost_focus = ultraboost_svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Tooltip line
  	var ultraboost_tooltip_line = ultraboost_svg.append("rect")
  	.attr("height", ultraboost_height - 100)
  	.attr("width", "1px")
  	.attr("y", 0)
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Tooltip circle
  	ultraboost_focus.append("circle")
  	.attr("r", 6.5);

  	ultraboost_focus.append("text")
  	.attr("x", 9)
  	.attr("dy", ".35em");

  	//Rectangle over over entire svg 
  	ultraboost_svg.append("rect")
	.attr("class", "overlay")
	.attr("width", ultraboost_width - 100)
	.attr("height", ultraboost_height)
	.attr("transform", "translate(50,0)")
	.on("mouseover", function() { 
		//Set the focus set and the tooltip line to display themselves
		ultraboost_focus.style("display", null);
		ultraboost_tooltip_line.style("display", null);
	})
	.on("mouseout", function() { 
		//Set the focus set and the tooltip line to disappear
		ultraboost_focus.style("display", "none");
		ultraboost_tooltip_line.style("display", "none"); 
	})
	.on("mousemove", mousemove);

  	function mousemove() {

  		//Use current mouse x to get dataset x (by inverting the xScale)
	    var ultraboost_dataset_x = ultraboost_xScale.invert(d3.mouse(this)[0]);

	    //Use dataset x to get dataset y
	    var ultraboost_data_item = data[ultraboost_bisectDate(data, ultraboost_dataset_x)];

	    //Update location of line
	    ultraboost_tooltip_line.attr("x", ultraboost_xScale(ultraboost_data_item.sale_date));

	    //Update location of circle
	    ultraboost_focus.attr("transform", "translate(" + (ultraboost_xScale(ultraboost_data_item.sale_date) + 50) + "," + ultraboost_yScale(ultraboost_data_item.sale_price) + ")");
	    
	    //Update text value
	    ultraboost_focus.select("text").text("$" + d3.format(",.0f")(ultraboost_data_item.sale_price));
    }

    //Add ultraboost image
	var ultraboost_image = ultraboost_svg.append("svg:image")
	.attr("xlink:href", "https://s3.amazonaws.com/stockx-sneaker-analysis/wp-content/uploads/2019/02/ultraboost.png")
	.attr("width", ultraboost_width/7)
	.attr("x", ultraboost_width - 159)
	.attr("y", function() {
		return ultraboost_yScale(data[data.length - 1].sale_price) - 40;
	})
	.attr("pointer-events", "none");

});

//Add StockX logo
var ultraboost_stockx_logo = ultraboost_svg.append("svg:image")
.attr("xlink:href", "http://stockx-assets.imgix.net/logo/stockx-homepage-logo-dark.svg?auto=compress,format")
.attr("width", ultraboost_width / 6)
.attr("x", ultraboost_width - (ultraboost_width/4))
.attr("y", ultraboost_height - 170)