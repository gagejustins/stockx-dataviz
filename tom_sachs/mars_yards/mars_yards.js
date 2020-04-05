console.log("D3 running");

var mars_yards_link = "https://gist.githubusercontent.com/gagejustins/0b16eccb13fdcc59465fe8ae35a6da53/raw/5267bbc6ceb95df07018f450110806af7f4906be/mars_yards.csv"

const width = 950,
height = 600,
padding = 20;
Y_OFFSET = 100;
X_OFFSET = 150;

var dataset;

//Colors dictionary
const colors_dict = {
	"mars_yard_1": "#9B6E4E",
	"mars_yard_2": "#A1232B",
};

const names_dict = {
	"mars_yard_1": "Mars Yard 1.0",
	"mars_yard_2": "Mars Yard 2.0"
}

var svg = d3.select("#mars_yards-chart")
.append("svg")
.attr("width", width)
.attr("height", height);

var xScale = d3.scaleTime()
.range([0, width - X_OFFSET])

var yScale = d3.scaleLinear()
.rangeRound([height - Y_OFFSET - padding, 0]);

var parseDate = d3.timeParse("%Y-%m-%d");

//Define line generator
var line = d3.line()
.defined(function (d) { return d.resale_multiple; })
.x(function(d) { return xScale(d.month); })
.y(function(d) { return yScale(d.resale_multiple); });

// gridlines in x axis function
function make_x_gridlines() {		
    return d3.axisBottom(xScale)
		.ticks(7)
		.tickSizeOuter(0)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(yScale)
        .ticks(8)
}

//Create bisect to get y from x for tooltip
var bisectDate = d3.bisector(function(d) { return d.month; }).left;

//Function to create graph
function createGraph(mars_yards) {

	//Create x axis
	var xAxis = d3.axisBottom(xScale)
	.ticks(7)
	.tickSizeOuter(0);

	//Create y axis
	var yAxis = d3.axisLeft(yScale)
	.ticks(10)
	.tickFormat(d3.format(".0f"));

	//Append x axis
	svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + (height - Y_OFFSET + padding) + ")")
	.call(xAxis);

	//Append y axis
	svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + padding + ")")
	.call(yAxis);

	// add the X gridlines
	svg.append("g")			
	.attr("class", "grid")
	.attr("transform", "translate(50," + (height-Y_OFFSET+padding-3) + ")")
	.call(make_x_gridlines()
		.tickSize(-height+Y_OFFSET+padding)
		.tickFormat("")
	)

	// add the Y gridlines
	svg.append("g")			
	.attr("class", "grid")
	.attr("transform", `translate(50,${padding})`)
	.call(make_y_gridlines()
		.tickSize(-width+X_OFFSET)
		.tickFormat("")
	)

	//Add darker x line
	svg.append("line")
	.attr("stroke-width", "2px")
	.attr("stroke", "black")
	.attr("y1", height - Y_OFFSET)
	.attr("y2", height - Y_OFFSET)
	.attr("x1", 50)
	.attr("x2", width - X_OFFSET + 51)

	//Draw line for each object
	mars_yards.forEach(function(d,i) {

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

	//Add StockX logo
	var stockx_logo = svg.append("svg:image")
	.attr("xlink:href", "images/stockx_logo.png")
	.attr("width", width / 14)
	.attr("x", width - 180)
	.attr("y", function() {
		return height - 130;
	})
	.attr("transform", "translate(0,-20)");

    //Group to contain circles and text for tooltip
  	var focus = svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Group to contain circles
  	var circle_per_line = focus.selectAll(".circle-per-line")
  	.data(mars_yards)
  	.enter()
  	.append("g")
  	.attr("class", "circle-per-line");

  	//Tooltip circles
  	circle_per_line.append("circle")
  	.attr("r", 4)
  	.style("fill", function(d) {
  		return colors_dict[d.name];
  	});

	circle_per_line.append("text")
	.attr("class", "background-text")
	.attr("x", 9)
	.attr("dy", ".4em");
	  
	circle_per_line.append("text")
  	.attr("x", 9)
  	.attr("dy", ".4em");

  	//Rectangle over over entire svg 
  	var overlay = svg.append("rect")
	.attr("class", "overlay")
	.attr("width", width - 100)
	.attr("height", height)
	.attr("transform", "translate(50,0)")
	.on("mouseover", function() { 
		//Set the focus set and the tooltip line to display themselves
		focus.style("display", null);
	})
	.on("mouseout", function() { 
		//Set the focus set and the tooltip line to disappear
		focus.style("display", "none");
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
			if (isNaN(data_item.resale_multiple)) {
				//If there's no sale price yet, put the circle a million miles away
				return "translate(-1000,0)";
			} else {
				//Translate circles
				return `translate(${xScale(data_item.month)},${yScale(data_item.resale_multiple) + padding})`
			}

		})

		//Update text value
	    focus.selectAll("text")
	    .text(function(d) {
	    	//Use dataset x to get dataset y
			var data_item = d.values[bisectDate(d.values, dataset_x)]
	    	return d3.format(".1f")(data_item.resale_multiple) + "x ($" + d3.format(".0f")(data_item.avg_gmv) + ")";
	    });

	});
};

//Function to create legend
function createLegend(mars_yards) {

	//Create legend
    var legend = svg.selectAll("legend")
	.data(mars_yards)
	.enter()
	.append("g")
	.attr("class", "legend")

 	legend.append('rect')
	.attr('x', 80)
	.attr('y', function(d, i) {
		return 70 - (i * 18);
	})
	.attr('width', 15)
	.attr('height', 15)
	.style('fill', function(d) {
		if (d.visible === false) {
			return "black"
		} else {
			return colors_dict[d.name];
		}
	});

   	legend.append('text')
	.attr('x', 100)
	.attr('y', function(d, i) {
		return 82 - (i * 18);
	})
	.text(function(d) { return names_dict[d.name] });
}

d3.csv(mars_yards_link, function(data) {

	data.forEach(function(d) {
        d.month = parseDate(moment.utc(d.month).format("YYYY-MM-DD")); 
		d.mars_yard_1 = {"avg_resale_multiple": parseFloat(d.avg_resale_multiple_1), "avg_gmv": parseFloat(d.avg_gmv_1)};
		d.mars_yard_2 = {"avg_resale_multiple": parseFloat(d.avg_resale_multiple_2), "avg_gmv": parseFloat(d.avg_gmv_2)};
 	});

 	//Extract columns names
 	var data_keys = ['mars_yard_1', 'mars_yard_2']

 	//Create mars_yards array with object for each color
 	var mars_yards = data_keys.map(function(name) {
 		return {
 			name: name,
 			values: data.map(function(d) { 
 				return {month: d.month, resale_multiple: d[name].avg_resale_multiple, avg_gmv: d[name].avg_gmv};
 			}),
 			visible: true
 		};
	 });

	//Set domains for x and y scales
	xScale.domain([
		d3.min(mars_yards, function(d) { return d3.min(d.values, function(v) { return v.month; } ) }),
		d3.max(mars_yards, function(d) { return d3.max(d.values, function(v) { return v.month; } ) })
	]);
	//Add 50 to max resale_multiple as padding
	yScale.domain([0, 
		d3.max(mars_yards, function(d) { return d3.max(d.values, function(v) { return v.resale_multiple; } ) })
	]);

 	//Create graph
 	createGraph(mars_yards);
 	//Create legend
 	createLegend(mars_yards);

});
