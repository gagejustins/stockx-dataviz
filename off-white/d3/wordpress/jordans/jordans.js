console.log("D3 running");

var jordans_link = "https://gist.githubusercontent.com/gagejustins/71be5a9fca05d8a869aa9cb27d497cb2/raw/7e6c39d72f12b137b87f5f8804474174daef48bb/jordans_weekly.csv"

var jordans_base_div = d3.select("#jordans-chart-container")
.append("div")
.attr("class", "chart");

var jordans_width = parseInt(jordans_base_div.style("width")),
jordans_height = 600,
jordans_padding = 20;

var jordans_offset = 55;

var jordans_dataset;

//Colors dictionary
var jordans_colors_dict = {
	"chicago": "#A43737",
	"blue": "#57A7DE",
	"white": "#AC9B87"
};

var jordans_svg = d3.select("#jordans-chart-container .chart")
.append('svg')
.attr("width", jordans_width)
.attr("height", jordans_height);

var jordans_xScale = d3.scaleTime()
.range([0, jordans_width - 150])

var jordans_yScale = d3.scaleLinear()
.rangeRound([jordans_height - 100 - jordans_padding, 0]);

var parseDate = d3.timeParse("%Y-%m-%d");

//Define line generator
var jordans_line = d3.line()
.curve(d3.curveCardinal)
.defined(function (d) { return d.sale_price; })
.x(function(d) { return jordans_xScale(d.sale_date); })
.y(function(d) { return jordans_yScale(d.sale_price); });

//Create bisect to get y from x for tooltip
var jordans_bisectDate = d3.bisector(function(d) { return d.sale_date; }).left;

//Function to create graph
function jordans_createGraph(jordans) {

	//Create x axis
	var jordans_xAxis = d3.axisBottom(jordans_xScale)
	.ticks(6)
	.tickSizeOuter(0);

	//Create y axis
	var jordans_yAxis = d3.axisLeft(jordans_yScale)
	.ticks(10)
	.tickFormat(d3.format("$,.0f"));

	//Append x axis
	jordans_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + (jordans_height - 100) + ")")
	.call(jordans_xAxis);

	//Append y axis
	jordans_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + jordans_padding + ")")
	.call(jordans_yAxis);

	//Draw line for each object
	jordans.forEach(function(d,i) {

		var jordan_line = jordans_svg.append("path")
		.attr("class", "line")
		.style("stroke", function() {
			return jordans_colors_dict[d.name];
		})
		.attr("id", function() {
			return "id" + i;
		})
		.attr("d", jordans_line(d.values))
		.attr("transform", "translate(51," + jordans_padding + ")");

	});

	//Add sneaker image at the end of each line
	jordans.forEach(function(d,i) {

		var sneaker_image = jordans_svg.append("svg:image")
		.attr("xlink:href", function() {
			return "http://s3.amazonaws.com/stockx-sneaker-analysis/wp-content/uploads/2019/02/jordan_" + d.name + ".png";
		})
		.attr("width", jordans_width / 10)
		.attr("x", jordans_width - 102)
		.attr("y", function() {
			return jordans_yScale(d.values[d.values.length - 1].sale_price);
		})
		.attr("transform", "translate(0,-20)");

	});

	//Add StockX logo
	var stockx_logo = jordans_svg.append("svg:image")
	.attr("xlink:href", "http://stockx-assets.imgix.net/logo/stockx-homepage-logo-dark.svg?auto=compress,format")
	.attr("width", jordans_width / 6)
	.attr("x", jordans_width - (jordans_width/4.5))
	.attr("y", function() {
		return jordans_height - (jordans_height/4);
	})
	.attr("transform", "translate(0,-20)");

    //Group to contain circles and text for tooltip
  	var jordans_focus = jordans_svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(" + jordans_offset + ",0)")
  	.style("display", "none");

  	//Group to contain circles
  	var jordans_circle_per_line = jordans_focus.selectAll(".circle-per-line")
  	.data(jordans)
  	.enter()
  	.append("g")
  	.attr("class", "circle-per-line");

  	//Tooltip line
  	var jordans_tooltip_line = jordans_svg.append("rect")
  	.attr("class", "tooltip-line")
  	.attr("height", jordans_height - 100)
  	.attr("width", "1px")
  	.attr("y", 0)
  	.attr("transform", "translate(" + jordans_offset + ",0)")
  	.style("display", "none");

  	//Tooltip circles
  	jordans_circle_per_line.append("circle")
  	.attr("r", 6.5)
  	.style("stroke", function(d) {
  		return jordans_colors_dict[d.name];
  	});

  	jordans_circle_per_line.append("text")
  	.attr("x", 9)
  	.attr("dy", ".35em");

  	//Rectangle over over entire svg 
  	var jordans_overlay = jordans_svg.append("rect")
	.attr("class", "overlay")
	.attr("width", jordans_width)
	.attr("height", jordans_height)
	.attr("transform", "translate(" + jordans_offset + ",0)")
	.on("mouseover", function() { 
		//Set the focus set and the tooltip line to display themselves
		jordans_focus.style("display", null);
		jordans_tooltip_line.style("display", null);
	})
	.on("mouseout", function() { 
		//Set the focus set and the tooltip line to disappear
		jordans_focus.style("display", "none");
		jordans_tooltip_line.style("display", "none"); 
	})
	.on("mousemove", function() {

		//Get x value for current mouse position
		jordans_mouse_x = d3.mouse(this)[0]
		var jordans_dataset_x = jordans_xScale.invert(jordans_mouse_x);

		//Update circle location
		jordans_focus.selectAll(".circle-per-line")
		.style("display", function(d) {
			if (d.visible === false) {
				return "none";
			} else {
				return null;
			}
		})
		.attr("transform", function(d) {

			if (d.visible === true) {
				//Use dataset x to get dataset y
				//Declare as global variable to tooltip line can reference it without having data attached
				window.data_item = d.values[jordans_bisectDate(d.values, jordans_dataset_x)]

				//Don't display circle if its line hasn't started yet
				if (isNaN(data_item.sale_price)) {
					//If there's no sale price yet, put the circle a million miles away
					return "translate(-1000,-1000)";
				} else {
					//Translate circles
					return "translate(" + jordans_xScale(data_item.sale_date) + "," + (jordans_yScale(data_item.sale_price) + jordans_padding) + ")"
				}
			}

		})

		//Update location of tooltip line using global data_item
		jordans_tooltip_line.attr("x", jordans_xScale(data_item.sale_date));

		//Update text value
	    jordans_focus.selectAll("text")
	    .text(function(d) {

	    	if (d.visible === true) {
		    	//Use dataset x to get dataset y
				var data_item = d.values[jordans_bisectDate(d.values, jordans_dataset_x)]
				//If there's enough room left, display shoe name AND price
				return d3.format("$,.0f")(data_item.sale_price) 
	    	}
	    })
      	.attr("transform", function(d) {
          	var data_item = d.values[jordans_bisectDate(d.values, jordans_dataset_x)]
        	if (jordans_width - jordans_mouse_x < 150) {
            	if (data_item.sale_price > 1000) {
            		return "translate(-64,0)"
                } else {
                	return "translate(-51,0)"
                }
            } else {
            	return "translate(0,0)"
            }
        });

	});

};

//Function to create legend
function jordans_createLegend(jordans) {

	//Create legend
    var jordans_legend = jordans_svg.selectAll("legend")
	.data(jordans)
	.enter()
	.append("g")
	.attr("class", "legend")
	.on("click", function(d) {
		//Reverse visible on chosen series
		d.visible ? d.visible = false : d.visible = true;
		//Update graph
		jordans_update(jordans);
	});

 	jordans_legend.append('rect')
	.attr('x', 80)
	.attr('y', function(d, i) {
		return jordans_height - 140 - (i * 18);
	})
	.attr('width', 15)
	.attr('height', 15)
	.style('fill', function(d) {
		if (d.visible === false) {
			return "black"
		} else {
			return jordans_colors_dict[d.name];
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
				return jordans_colors_dict[d.name];
			}
		});
	});

   jordans_legend.append('text')
	.attr('x', 100)
	.attr('y', function(d, i) {
		return jordans_height - 127 - (i * 18);
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
 	var jordans_data_keys = d3.keys(data[0]).filter(function(key) { return key !== 'sale_date'; })

 	//Create Jordans array with object for each color
 	var jordans = jordans_data_keys.map(function(name) {
 		return {
 			name: name,
 			values: data.map(function(d) { 
 				return {sale_date: d.sale_date, sale_price: d[name]};
 			}),
 			visible: true
 		};
 	});

	//Set domains for x and y scales
	jordans_xScale.domain([
		d3.min(jordans, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(jordans, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	jordans_yScale.domain([0, 
		d3.max(jordans, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

 	//Create graph
 	jordans_createGraph(jordans);
 	//Create legend
 	jordans_createLegend(jordans);

});

//This function gets called whenever a series in the legend is clicked on
function jordans_update(jordans) {

	//Update the jordans array to only contain series where visible is set to true
	jordans_filtered = jordans.filter(function(jordan) {
		return jordan['visible'] === true;
	});

	//Update domains of x and y scales
	jordans_xScale.domain([
		d3.min(jordans_filtered, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(jordans_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	jordans_yScale.domain([0, 
		d3.max(jordans_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

	//console.log(xScale.domain())
	//console.log(yScale.domain())

	//Remove previous lines
	jordans_svg.selectAll(".line").remove();

	//Remove previous axis
	jordans_svg.selectAll(".axis").remove();

	//Remove previous legend
	jordans_svg.selectAll(".legend").remove()

	//Remove images
	jordans_svg.selectAll("image").remove()

	//Remove previous tooltip items
	jordans_svg.selectAll(".focus").remove();
	jordans_svg.selectAll(".tooltip-line").remove();

	//Create rest of graph - as per filtered jordans
	jordans_createGraph(jordans_filtered);
	//Create legend - as per full jordan dataframe
	jordans_createLegend(jordans);

}