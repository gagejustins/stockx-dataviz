console.log("D3 running");

var jordans_link = "https://gist.githubusercontent.com/gagejustins/71be5a9fca05d8a869aa9cb27d497cb2/raw/7e6c39d72f12b137b87f5f8804474174daef48bb/jordans_weekly.csv"

var width = 950,
height = 600,
padding = 20;

var dataset;

//Colors dictionary
var colors_dict = {
	"chicago": "#A43737",
	"blue": "#57A7DE",
	"white": "#AC9B87"
};

var svg = d3.select("#jordans-chart")
.append("svg")
.attr("width", width)
.attr("height", height);

var xScale = d3.scaleTime()
.range([0, width - 150])

var yScale = d3.scaleLinear()
.rangeRound([height - 100 - padding, 0]);

var parseDate = d3.timeParse("%Y-%m-%d");

//Define line generator
var line = d3.line()
.curve(d3.curveCardinal)
.defined(function (d) { return d.sale_price; })
.x(function(d) { return xScale(d.sale_date); })
.y(function(d) { return yScale(d.sale_price); });

//Create bisect to get y from x for tooltip
var bisectDate = d3.bisector(function(d) { return d.sale_date; }).left;

//Function to create graph
function createGraph(jordans) {

	//Create x axis
	var xAxis = d3.axisBottom(xScale)
	.ticks(6)
	.tickSizeOuter(0);

	//Create y axis
	var yAxis = d3.axisLeft(yScale)
	.ticks(10)
	.tickFormat(d3.format("$,.0f"));

	//Append x axis
	svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + (height - 100) + ")")
	.call(xAxis);

	//Append y axis
	svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + padding + ")")
	.call(yAxis);

	//Draw line for each object
	jordans.forEach(function(d,i) {

		var jordan_line = svg.append("path")
		.attr("class", "line")
		.style("stroke", function() {
			return colors_dict[d.name];
		})
		.attr("id", function() {
			return "id" + i;
		})
		.attr("d", line(d.values))
		.attr("transform", "translate(51," + padding + ")");

	});

	//Add sneaker image at the end of each line
	jordans.forEach(function(d,i) {

		var sneaker_image = svg.append("svg:image")
		.attr("xlink:href", function() {
			return "images/jordan_" + d.name + ".png";
		})
		.attr("width", width / 10)
		.attr("height", width / 10 * .75)
		.attr("x", width - 101)
		.attr("y", function() {
			return yScale(d.values[d.values.length - 1].sale_price);
		})
		.attr("transform", "translate(0,-20)");

	});

	//Add StockX logo
	var stockx_logo = svg.append("svg:image")
	.attr("xlink:href", "images/stockx_logo.png")
	.attr("width", width / 10)
	.attr("height", width / 10 * .75)
	.attr("x", width - 200)
	.attr("y", function() {
		return height - 160;
	})
	.attr("transform", "translate(0,-20)");

    //Group to contain circles and text for tooltip
  	var focus = svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Group to contain circles
  	var circle_per_line = focus.selectAll(".circle-per-line")
  	.data(jordans)
  	.enter()
  	.append("g")
  	.attr("class", "circle-per-line");

  	//Tooltip line
  	var tooltip_line = svg.append("rect")
  	.attr("class", "tooltip-line")
  	.attr("height", height - 100)
  	.attr("width", "1px")
  	.attr("y", 0)
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Tooltip circles
  	circle_per_line.append("circle")
  	.attr("r", 6.5)
  	.style("stroke", function(d) {
  		return colors_dict[d.name];
  	});

  	circle_per_line.append("text")
  	.attr("x", 9)
  	.attr("dy", ".35em");

  	//Rectangle over over entire svg 
  	var overlay = svg.append("rect")
	.attr("class", "overlay")
	.attr("width", width - 100)
	.attr("height", height)
	.attr("transform", "translate(50,0)")
	.on("mouseover", function() { 
		//Set the focus set and the tooltip line to display themselves
		focus.style("display", null);
		tooltip_line.style("display", null);
	})
	.on("mouseout", function() { 
		//Set the focus set and the tooltip line to disappear
		focus.style("display", "none");
		tooltip_line.style("display", "none"); 
	})
	.on("mousemove", function() {

		//Get x value for current mouse position
		var dataset_x = xScale.invert(d3.mouse(this)[0]);

		//Update circle location
		focus.selectAll(".circle-per-line")
		.attr("transform", function(d) {

			//Use dataset x to get dataset y
			//Declare as global variable to tooltip line can reference it without having data attached
			window.data_item = d.values[bisectDate(d.values, dataset_x)]

			//Don't display circle if its line hasn't started yet
			if (isNaN(data_item.sale_price)) {
				//If there's no sale price yet, put the circle a million miles away
				return "translate(-1000,0)";
			} else {
				//Translate circles
				return "translate(" + xScale(data_item.sale_date) + "," + (yScale(data_item.sale_price) + padding) + ")"
			}

		})

		//Update location of tooltip line using global data_item
		tooltip_line.attr("x", xScale(data_item.sale_date));

		//Update text value
	    focus.selectAll("text")
	    .text(function(d) {
	    	//Use dataset x to get dataset y
			var data_item = d.values[bisectDate(d.values, dataset_x)]
	    	return d3.format("$,.0f")(data_item.sale_price);
	    });

	});
};

//Function to create legend
function createLegend(jordans) {

	//Create legend
    var legend = svg.selectAll("legend")
	.data(jordans)
	.enter()
	.append("g")
	.attr("class", "legend")
	.on("click", function(d) {
		//Reverse visible on chosen series
		d.visible ? d.visible = false : d.visible = true;
		//Update graph
		update(jordans);
	});

 	legend.append('rect')
	.attr('x', 80)
	.attr('y', function(d, i) {
		return height - 140 - (i * 18);
	})
	.attr('width', 15)
	.attr('height', 15)
	.style('fill', function(d) {
		if (d.visible === false) {
			return "black"
		} else {
			return colors_dict[d.name];
		}
	})
	.on("mouseover", function(d) {
		d3.select(this).style("fill", function(d) {
			if (d.visible === false) {
				return colors_dict[d.name];
			} else {
				return "black";
			}
		});
	})
	.on("mouseout", function(d) {
		d3.select(this).style("fill", function(d) {
			if (d.visible === false) {
				return "black"
			} else {
				return colors_dict[d.name];
			}
		});
	});

   	legend.append('text')
	.attr('x', 100)
	.attr('y', function(d, i) {
		return height - 127 - (i * 18);
	})
	.text(function(d) {
		if (d.name === 'blue') {
			return "\"" + "UNIVERSITY BLUE" + "\""
		} else {
			return "\"" + d.name.toUpperCase() + "\"";
		}
	});
}

d3.csv(jordans_link, function(data) {

	data.forEach(function(d) {
        d.sale_date = parseDate(moment.utc(d.sale_date).format("YYYY-MM-DD")); 
        d.chicago = parseFloat(d.chicago);
		d.white = parseFloat(d.white);
		d.blue = parseFloat(d.blue);
 	});

 	//Extract columns names
 	var data_keys = d3.keys(data[0]).filter(function(key) { return key !== 'sale_date'; })

 	//Create Jordans array with object for each color
 	var jordans = data_keys.map(function(name) {
 		return {
 			name: name,
 			values: data.map(function(d) { 
 				return {sale_date: d.sale_date, sale_price: d[name]};
 			}),
 			visible: true
 		};
 	});

	//Set domains for x and y scales
	xScale.domain([
		d3.min(jordans, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(jordans, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	yScale.domain([0, 
		d3.max(jordans, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

 	//Create graph
 	createGraph(jordans);
 	//Create legend
 	createLegend(jordans);

});

//This function gets called whenever a series in the legend is clicked on
function update(jordans) {

	//Update the jordans array to only contain series where visible is set to true
	jordans_filtered = jordans.filter(function(jordan) {
		return jordan['visible'] === true;
	});

	//Update domains of x and y scales
	xScale.domain([
		d3.min(jordans_filtered, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(jordans_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	yScale.domain([0, 
		d3.max(jordans_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

	//console.log(xScale.domain())
	//console.log(yScale.domain())

	//Remove previous lines
	svg.selectAll(".line").remove();

	//Remove previous axis
	svg.selectAll(".axis").remove();

	//Remove previous legend
	svg.selectAll(".legend").remove()

	//Remove images
	svg.selectAll("image").remove()

	//Remove previous tooltip items
	svg.selectAll(".focus").remove();
	svg.selectAll(".tooltip-line").remove();

	//Create rest of graph - as per filtered jordans
	createGraph(jordans_filtered);
	//Create legend - as per full jordan dataframe
	createLegend(jordans);

}












