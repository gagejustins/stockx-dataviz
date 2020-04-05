console.log("D3 running");

var all_off_white_sneakers_link = "https://gist.githubusercontent.com/gagejustins/1aa4589df18c1b07b64a825bd561b23d/raw/c672abec8013585538a1870aa2d0128af987d6b3/nikexoff_white_new.csv"

var all_off_white_base_div = d3.select("#all-off-white-container")
.append("div")
.attr("class", "chart");

var all_off_white_width = parseInt(all_off_white_base_div.style("width")) * 0.97,
all_off_white_height = 600,
all_off_white_padding = 20;

var all_off_white_legend_width = parseInt(all_off_white_base_div.style("width")) * 0.3,
all_off_white_legend_height = 600;

var all_off_white_offset = 65;

var all_off_white_dataset;

//Colors dictionary
var all_off_white_colors_dict = {
	'AF1 Low (The Ten)': "#A52126",
	'AF1 Low (Black)': "#25252A",
	'AF1 Low (Volt)': "#BEFB47" ,
	'AF1 Low (ComplexCon)': "#5B5B5B",
	'Air Max 90 (The Ten)': "#A52126",
  	'Air Max 90 (Black)': "#25252A",
  	'Air Max 90 (Desert Ore)': "#968467",
	'Air Max 97 (The Ten)': "#A52126",
	'Air Max 97 (Black)': "#25252A",
	'Air Max 97 (Menta)' :"#62E2C0", 
	'Air Presto (The Ten)': "#A52126",
	'Air Presto (Black)': "#25252A",
	'Air Presto (White)': "#FE7B2D",
	'Air VaporMax (The Ten)': "#A52126", 
	'Air VaporMax (Black)': "#25252A",
	'Converse Chuck Taylor 70s Hi': "#25252A", 
	'Converse Chuck Taylor Hi (The Ten)': "#FE7B2D",
	'Jordan 1 High (Chicago)': "#A73738", 
	'Jordan 1 High (University Blue)': "#7DBEEA", 
	'Jordan 1 High (White)': "#1B4192",
	'Blazer Mid (The Ten)': "#A52126", 
	'Blazer Mid (All Hallow\'s Eve)': "#E3CE99", 
	'Blazer Mid (Grim Reaper)': "#25252A",
	'Blazer Mid (Serena Pack)': "#816EAB",
	'Air Max 97 (Serena Pack)': "#816EAB",
	'Mercurial Vapor 360': "#FE7B2D", 
	'React Hyperdunk (The Ten)': "#A52126",
	'Zoom Fly Mercurial (Black)': "#25252A", 
	'Zoom Fly Mercurial (Total Orange)': "#FE7B2D", 
	'Zoom Fly (The Ten)': "#A52126",
	'Zoom Fly (Black)': "#25252A", 
	'Zoom Fly (Tulip Pink)': "#C54169"
};

var all_off_white_svg = d3.select("#all-off-white-container .chart")
.append('svg')
.attr("width", all_off_white_width)
.attr("height", all_off_white_height);

//Create legend div 
var all_off_white_legend_div = d3.select("#all-off-white-container")
.append("div")
.attr("height", "500px")
.attr("class", "legend-container");

var all_off_white_legend_svg = all_off_white_legend_div.append('svg')
.attr("height", all_off_white_legend_height)
.attr("class", "legend");

var all_off_white_xScale = d3.scaleTime()
.range([0, all_off_white_width - (all_off_white_width / 9)])

var all_off_white_yScale = d3.scaleLinear()
.rangeRound([all_off_white_height - 100 - all_off_white_padding, 0]);

var parseDate = d3.timeParse("%Y-%m-%d");

//Define line generator
var all_off_white_line = d3.line()
.curve(d3.curveCardinal)
.defined(function (d) { return d.sale_price; })
.x(function(d) { return all_off_white_xScale(d.sale_date); })
.y(function(d) { return all_off_white_yScale(d.sale_price); });

//Create bisect to get y from x for tooltip
var all_off_white_bisectDate = d3.bisector(function(d) { return d.sale_date; }).left;

//Function to create graph
function all_off_white_createGraph(sneakers) {

	//Create x axis
	var all_off_white_xAxis = d3.axisBottom(all_off_white_xScale)
	.ticks(6)
	.tickSizeOuter(0);

	//Create y axis
	var all_off_white_yAxis = d3.axisLeft(all_off_white_yScale)
	.ticks(10)
	.tickFormat(d3.format("$,.0f"));

	//Append x axis
	all_off_white_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + all_off_white_offset + "," + (all_off_white_height - 100) + ")")
	.call(all_off_white_xAxis);

	//Append y axis
	all_off_white_svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + all_off_white_offset + "," + all_off_white_padding + ")")
	.call(all_off_white_yAxis);

	//Draw line for each object
	sneakers.forEach(function(d,i) {

		if (d.visible === true) {
			var sneaker_line = all_off_white_svg.append("path")
			.attr("class", "line")
			.style("stroke", function() {
				return all_off_white_colors_dict[d.name];
			})
			.attr("id", function() {
				return "id" + i;
			})
			.attr("d", all_off_white_line(d.values))
			.attr("transform", "translate(" + (all_off_white_offset + 1) + "," + all_off_white_padding + ")");
		}

	});

	//Add StockX logo
	var stockx_logo = all_off_white_svg.append("svg:image")
	.attr("xlink:href", "http://stockx-assets.imgix.net/logo/stockx-homepage-logo-dark.svg?auto=compress,format")
	.attr("width", all_off_white_width / 4)
	.attr("height", all_off_white_width / 4 * .75)
	.attr("x", all_off_white_width - (all_off_white_width/5))
	.attr("y", function() {
		return all_off_white_height - (all_off_white_height/3.3);
	})
	.attr("transform", "translate(0,-20)");

    //Group to contain circles and text for tooltip
  	var all_off_white_focus = all_off_white_svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(" + all_off_white_offset + ",0)")
  	.style("display", "none");

  	//Group to contain circles
  	var all_off_white_circle_per_line = all_off_white_focus.selectAll(".circle-per-line")
  	.data(sneakers)
  	.enter()
  	.append("g")
  	.attr("class", "circle-per-line");

  	//Tooltip line
  	var all_off_white_tooltip_line = all_off_white_svg.append("rect")
  	.attr("class", "tooltip-line")
  	.attr("height", all_off_white_height - 100)
  	.attr("width", "1px")
  	.attr("y", 0)
  	.attr("transform", "translate(" + all_off_white_offset + ",0)")
  	.style("display", "none");

  	//Tooltip circles
  	all_off_white_circle_per_line.append("circle")
  	.attr("r", 6.5)
  	.style("stroke", function(d) {
  		return all_off_white_colors_dict[d.name];
  	});

  	all_off_white_circle_per_line.append("text")
  	.attr("x", 9)
  	.attr("dy", ".35em");

  	//Rectangle over over entire svg 
  	var all_off_white_overlay = all_off_white_svg.append("rect")
	.attr("class", "overlay")
	.attr("width", all_off_white_width)
	.attr("height", all_off_white_height)
	.attr("transform", "translate(" + all_off_white_offset + ",0)")
	.on("mouseover", function() { 
		//Set the focus set and the tooltip line to display themselves
		all_off_white_focus.style("display", null);
		all_off_white_tooltip_line.style("display", null);
	})
	.on("mouseout", function() { 
		//Set the focus set and the tooltip line to disappear
		all_off_white_focus.style("display", "none");
		all_off_white_tooltip_line.style("display", "none"); 
	})
	.on("mousemove", function() {

		//Get x value for current mouse position
		all_off_white_mouse_x = d3.mouse(this)[0]
		var all_off_white_dataset_x = all_off_white_xScale.invert(all_off_white_mouse_x);

		//Update circle location
		all_off_white_focus.selectAll(".circle-per-line")
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
				window.data_item = d.values[all_off_white_bisectDate(d.values, all_off_white_dataset_x)]

				//Don't display circle if its line hasn't started yet
				if (isNaN(data_item.sale_price)) {
					//If there's no sale price yet, put the circle a million miles away
					return "translate(-1000,-1000)";
				} else {
					//Translate circles
					return "translate(" + all_off_white_xScale(data_item.sale_date) + "," + (all_off_white_yScale(data_item.sale_price) + all_off_white_padding) + ")"
				}
			}

		})

		//Update location of tooltip line using global data_item
		all_off_white_tooltip_line.attr("x", all_off_white_xScale(data_item.sale_date));

		//Update text value
	    all_off_white_focus.selectAll("text")
	    .text(function(d) {

	    	if (d.visible === true) {
		    	//Use dataset x to get dataset y
				var data_item = d.values[all_off_white_bisectDate(d.values, all_off_white_dataset_x)]
				//If there's enough room left, display shoe name AND price
				if (all_off_white_mouse_x < (all_off_white_width - (all_off_white_width/2))) {
		    		return d.name + ": " + d3.format("$,.0f")(data_item.sale_price);
				} else if (all_off_white_width - all_off_white_mouse_x < 150) {
                  	return d3.format("$,.0f")(data_item.sale_price)
                } else {
					return d3.format("$,.0f")(data_item.sale_price) + " – " + d.name;
				}
	    	}
	    })
      	.attr("transform", function(d) {
          	var data_item = d.values[all_off_white_bisectDate(d.values, all_off_white_dataset_x)]
        	if (all_off_white_width - all_off_white_mouse_x < 150) {
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
function all_off_white_createLegend(sneakers) {
  
  	sneakers = sneakers.sort(function(x,y) {
      return d3.descending(x.name, y.name);
    });

    var all_off_white_legend = all_off_white_legend_svg.selectAll("legend")
	.data(sneakers)
	.enter()
	.append("g")
	.attr("class", "legend")
	.on("click", function(d) {
		//Reverse visible on chosen series
		d.visible ? d.visible = false : d.visible = true;
		//Update graph
		all_off_white_update(sneakers);
	});

 	all_off_white_legend.append('rect')
	.attr('x', 0)
	.attr('y', function(d, i) {
		return all_off_white_legend_height - 40 - (i * 18);
	})
	.attr('width', 15)
	.attr('height', 15)
	.style('fill', function(d) {
		if (d.visible === false) {
			return "black"
		} else {
			return all_off_white_colors_dict[d.name];
		}
	})
	.on("mouseover", function(d) {
		d3.select(this).style("fill", function(d) {
			if (d.visible === false) {
				return all_off_white_colors_dict[d.name];
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
				return all_off_white_colors_dict[d.name];
			}
		});
	});

   	all_off_white_legend.append('text')
	.attr('x', 25)
	.attr('y', function(d, i) {
		return all_off_white_legend_height - 28 - (i * 18);
	})
	.text(function(d) {
		if (d.name === 'blue') {
			return "\"" + "UNIVERSITY BLUE" + "\""
		} else {
			return "\"" + d.name.toUpperCase() + "\"";
		}
	});
}

d3.csv(all_off_white_sneakers_link, function(data) {

	data.forEach(function(d) {
        d.sale_date = parseDate(moment.utc(d.sale_date).format("YYYY-MM-DD")); 

        all_off_white_colnames = ['AF1 Low (The Ten)', 'AF1 Low (Black)', 'AF1 Low (Volt)', 
		'AF1 Low (ComplexCon)', 'Air Max 90 (The Ten)', 'Air Max 90 (Black)', 'Air Max 90 (Desert Ore)', 'Air Max 97 (The Ten)',
		'Air Max 97 (Black)', 'Air Max 97 (Serena Pack)', 'Air Max 97 (Menta)', 'Air Presto (The Ten)',
		'Air Presto (Black)', 'Air Presto (White)', 'Air VaporMax (The Ten)', 'Air VaporMax (Black)',
		'Converse Chuck Taylor 70s Hi', 'Converse Chuck Taylor Hi (The Ten)', 
		'Jordan 1 High (Chicago)', 'Jordan 1 High (University Blue)', 'Jordan 1 High (White)',
		'Blazer Mid (The Ten)', 'Blazer Mid (All Hallow\'s Eve)', 'Blazer Mid (Grim Reaper)',
		'Blazer Mid (Serena Pack)', 'Mercurial Vapor 360', 'React Hyperdunk (The Ten)',
		'Zoom Fly Mercurial (Black)', 'Zoom Fly Mercurial (Total Orange)', 'Zoom Fly (The Ten)',
		'Zoom Fly (Black)', 'Zoom Fly (Tulip Pink)']

		for (const name of all_off_white_colnames) {
			d[name] = parseFloat(d[name]);
		}

 	});

 	//Extract columns names
 	var all_off_white_data_keys = d3.keys(data[0]).filter(function(key) { return key !== 'sale_date'; })

 	//Create sneakers array with object for each color
 	var sneakers = all_off_white_data_keys.map(function(name) {
 		return {
 			name: name,
 			values: data.map(function(d) { 
 				return {sale_date: d.sale_date, sale_price: d[name]};
 			}),
 			//Default is not visible
 			visible: false
 		};
 	});

 	//Set classic (jordan 1 chicago to be visible by default)
 	sneakers.map(function(d) {
 		if (d.name === 'Jordan 1 High (Chicago)') {
 			d.visible = true;
 		}
 	});

	//Set domains for x and y scales
	all_off_white_xScale.domain([
		d3.min(sneakers, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(sneakers, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	all_off_white_yScale.domain([0, 
		d3.max(sneakers, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

 	//Create graph
 	all_off_white_createGraph(sneakers);
 	//Create legend
 	all_off_white_createLegend(sneakers);

});

//This function gets called whenever a series in the legend is clicked on
function all_off_white_update(sneakers) {

	//Update the sneakers array to only contain series where visible is set to true
	all_off_white_sneakers_filtered = sneakers.filter(function(sneaker) {
		return sneaker['visible'] === true;
	});

	//Update domains of x and y scales
	all_off_white_xScale.domain([
		d3.min(all_off_white_sneakers_filtered, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(all_off_white_sneakers_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	all_off_white_yScale.domain([0, 
		d3.max(all_off_white_sneakers_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

	//console.log(xScale.domain())
	//console.log(yScale.domain())

	//Remove previous lines
	all_off_white_svg.selectAll(".line").remove();

	//Remove previous axis
	all_off_white_svg.selectAll(".axis").remove();

	//Remove previous legend
	all_off_white_legend_svg.selectAll(".legend").remove()

	//Remove previous tooltip items
	all_off_white_svg.selectAll(".focus").remove();
	all_off_white_svg.selectAll(".tooltip-line").remove();

	//Create rest of graph - as per filtered sneakers
	all_off_white_createGraph(all_off_white_sneakers_filtered);
	//Create legend - as per full sneakers dataframe
	all_off_white_createLegend(sneakers);

}