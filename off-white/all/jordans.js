console.log("D3 running");

var sneakers_link = "https://gist.githubusercontent.com/gagejustins/54e8196f4a89078ca91ea59371a1b644/raw/86eb66010d4de9548ad6ce856603d5be9a1df080/nikexoff-white.csv"

var width = window.innerWidth * .7,
height = 600,
padding = 20;

var legend_width = window.innerWidth * .25,
legend_height = 600;

var dataset;

//Colors dictionary
var colors_dict = {
	'Air Force 1 Low (The Ten)': "#A52126",
	'Air Force 1 Low (Black)': "#25252A",
	'Air Force 1 Low (Volt)': "#BEFB47" ,
	'Air Force 1 Low (ComplexCon)': "#5B5B5B",
	'Air Max 90 (The Ten)': "#A52126",
	'Air Max 97 (The Ten)': "#A52126",
	'Air Max 97 (Black)': "#25252A",
	'Air Max 97 (Menta)' :"#62E2C0", 
	'Air Presto (The Ten)': "#A52126",
	'Air Presto (Black)': "#25252A",
	'Air Presto (White)': "#FE7B2D",
	'Air VaporMax (The Ten)': "#A52126", 
	'Air VaporMax (Black)': "#25252A",
	'Converse Chuck Taylor All-Star 70s Hi': "#25252A", 
	'Converse Chuck Taylor All-Star Hi (The Ten)': "#FE7B2D",
	'Jordan 1 Retro High (Chicago)': "#A73738", 
	'Jordan 1 Retro High (University Blue)': "#7DBEEA", 
	'Jordan 1 Retro High (White)': "#1B4192",
	'Nike Blazer Mid (The Ten)': "#A52126", 
	'Nike Blazer Mid (All Hallow\'s Eve)': "#E3CE99", 
	'Nike Blazer Mid (Grim Reaper)': "#25252A",
	'Nike Blazer Mid (Serena Pack)': "#816EAB",
	'Air Max 97 (Serena Pack)': "#816EAB",
	'Nike Mercurial Vapor 360': "#FE7B2D", 
	'Nike React Hyperdunk 2017 Flyknit (The Ten)': "#A52126",
	'Nike Zoom Fly Mercurial (Black)': "#25252A", 
	'Nike Zoom Fly Mercurial (Total Orange)': "#FE7B2D", 
	'Nike Zoom Fly (The Ten)': "#A52126",
	'Nike Zoom Fly (Black)': "#25252A", 
	'Nike Zoom Fly (Tulip Pink)': "#C54169"
};

var svg = d3.select("#chart")
.append("svg")
.attr("width", width)
.attr("height", height);

//Create legend div 
var legend_svg = d3.select("#chart")
.append("div")
.attr("width", legend_width)
.attr("height", "500px")
.attr("class", "legend")
.attr("id", "legend");

//Create legend svg 
var legend_svg = d3.select("#legend")
.append("svg")
.attr("width", legend_width)
.attr("height", legend_height)
.attr("class", "legend");

var xScale = d3.scaleTime()
.range([0, width - 100])

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
function createGraph(sneakers) {

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
	sneakers.forEach(function(d,i) {

		if (d.visible === true) {
			var sneaker_line = svg.append("path")
			.attr("class", "line")
			.style("stroke", function() {
				return colors_dict[d.name];
			})
			.attr("id", function() {
				return "id" + i;
			})
			.attr("d", line(d.values))
			.attr("transform", "translate(51," + padding + ")");
		}

	});

	//Add StockX logo
	var stockx_logo = svg.append("svg:image")
	.attr("xlink:href", "images/stockx_logo.png")
	.attr("width", width / 10)
	.attr("height", width / 10 * .75)
	.attr("x", width - 180)
	.attr("y", function() {
		return height - 170;
	})
	.attr("transform", "translate(0,-20)");

    //Group to contain circles and text for tooltip
  	var focus = svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Group to contain circles
  	var circle_per_line = focus.selectAll(".circle-per-line")
  	.data(sneakers)
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
  	.attr("dy", ".35em")
  	.attr("class", "shadow");

  	circle_per_line.append("text")
  	.attr("x", 9)
  	.attr("dy", ".35em");

  	//Rectangle over over entire svg 
  	var overlay = svg.append("rect")
	.attr("class", "overlay")
	.attr("width", width)
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
		mouse_x = d3.mouse(this)[0]
		var dataset_x = xScale.invert(mouse_x);

		//Update circle location
		focus.selectAll(".circle-per-line")
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
				window.data_item = d.values[bisectDate(d.values, dataset_x)]

				//Don't display circle if its line hasn't started yet
				if (isNaN(data_item.sale_price)) {
					//If there's no sale price yet, put the circle a million miles away
					return "translate(-1000,-1000)";
				} else {
					//Translate circles
					return "translate(" + xScale(data_item.sale_date) + "," + (yScale(data_item.sale_price) + padding) + ")"
				}
			}

		})

		//Update location of tooltip line using global data_item
		tooltip_line.attr("x", xScale(data_item.sale_date));

		//Update text value
	    focus.selectAll("text")
	    .text(function(d) {

	    	if (d.visible === true) {
		    	//Use dataset x to get dataset y
				var data_item = d.values[bisectDate(d.values, dataset_x)]
				//If there's enough room left, display shoe name AND price
				if (mouse_x < (width - 380)) {
		    		return d.name + ": " + d3.format("$,.0f")(data_item.sale_price);
				} else {
					return d3.format("$,.0f")(data_item.sale_price) + " – " + d.name;
				}
	    	}
	    })
	    .attr("transform", function(d) {
        	if (width - mouse_x < 150) {
            	return "translate(-40,0)"
            } else {
            	return "translate(0,0)"
            }
        });

	});

};

//Function to create legend
function createLegend(sneakers) {

    var legend = legend_svg.selectAll("legend")
	.data(sneakers)
	.enter()
	.append("g")
	.attr("class", "legend")
	.on("click", function(d) {
		//Reverse visible on chosen series
		d.visible ? d.visible = false : d.visible = true;
		//Update graph
		update(sneakers);
	});

 	legend.append('rect')
	.attr('x', 0)
	.attr('y', function(d, i) {
		return legend_height - 40 - (i * 18);
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
	.attr('x', 25)
	.attr('y', function(d, i) {
		return legend_height - 28 - (i * 18);
	})
	.text(function(d) {
		if (d.name === 'blue') {
			return "\"" + "UNIVERSITY BLUE" + "\""
		} else {
			return "\"" + d.name.toUpperCase() + "\"";
		}
	});
}

d3.csv(sneakers_link, function(data) {

	data.forEach(function(d) {
        d.sale_date = parseDate(moment.utc(d.sale_date).format("YYYY-MM-DD")); 

        colnames = ['Air Force 1 Low (The Ten)', 'Air Force 1 Low (Black)', 'Air Force 1 Low (Volt)', 
		'Air Force 1 Low (ComplexCon)', 'Air Max 90 (The Ten)', 'Air Max 90 (Black)', 'Air Max 97 (The Ten)',
		'Air Max 97 (Black)', 'Air Max 97 (Serena Pack)', 'Air Max 97 (Menta)', 'Air Presto (The Ten)',
		'Air Presto (Black)', 'Air Presto (White)', 'Air VaporMax (The Ten)', 'Air VaporMax (Black)',
		'Converse Chuck Taylor All-Star 70s Hi', 'Converse Chuck Taylor All-Star Hi (The Ten)', 
		'Jordan 1 Retro High (Chicago)', 'Jordan 1 Retro High (University Blue)', 'Jordan 1 Retro High (White)',
		'Nike Blazer Mid (The Ten)', 'Nike Blazer Mid (All Hallow\'s Eve)', 'Nike Blazer Mid (Grim Reaper)',
		'Nike Blazer Mid (Serena Pack)', 'Nike Mercurial Vapor 360', 'Nike React Hyperdunk 2017 Flyknit (The Ten)',
		'Nike Zoom Fly Mercurial (Black)', 'Nike Zoom Fly Mercurial (Total Orange)', 'Nike Zoom Fly (The Ten)',
		'Nike Zoom Fly (Black)', 'Nike Zoom Fly (Tulip Pink)']

		for (const name of colnames) {
			d[name] = parseFloat(d[name]);
		}

 	});

 	//Extract columns names
 	var data_keys = d3.keys(data[0]).filter(function(key) { return key !== 'sale_date'; })

 	//Create sneakers array with object for each color
 	var sneakers = data_keys.map(function(name) {
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
 		if (d.name === 'Jordan 1 Retro High (Chicago)') {
 			d.visible = true;
 		}
 	});

	//Set domains for x and y scales
	xScale.domain([
		d3.min(sneakers, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(sneakers, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	yScale.domain([0, 
		d3.max(sneakers, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

 	//Create graph
 	createGraph(sneakers);
 	//Create legend
 	createLegend(sneakers);

});

//This function gets called whenever a series in the legend is clicked on
function update(sneakers) {

	//Update the sneakers array to only contain series where visible is set to true
	sneakers_filtered = sneakers.filter(function(sneaker) {
		return sneaker['visible'] === true;
	});

	//Update domains of x and y scales
	xScale.domain([
		d3.min(sneakers_filtered, function(d) { return d3.min(d.values, function(v) { return v.sale_date; } ) }),
		d3.max(sneakers_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_date; } ) })
	]);
	//Add 50 to max sale_price as padding
	yScale.domain([0, 
		d3.max(sneakers_filtered, function(d) { return d3.max(d.values, function(v) { return v.sale_price + 50; } ) })
	]);

	//console.log(xScale.domain())
	//console.log(yScale.domain())

	//Remove previous lines
	svg.selectAll(".line").remove();

	//Remove previous axis
	svg.selectAll(".axis").remove();

	//Remove previous legend
	legend_svg.selectAll(".legend").remove()

	//Remove previous tooltip items
	svg.selectAll(".focus").remove();
	svg.selectAll(".tooltip-line").remove();

	//Create rest of graph - as per filtered sneakers
	createGraph(sneakers_filtered);
	//Create legend - as per full sneakers dataframe
	createLegend(sneakers);

}












