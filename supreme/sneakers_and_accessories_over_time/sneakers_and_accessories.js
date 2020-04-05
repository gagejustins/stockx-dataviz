console.log("D3 running");

var data_link = "https://gist.githubusercontent.com/gagejustins/93ced0986396dff047143f3d2407bd18/raw/1b244f37a4d5d0b42bee881288e2538a6c460e17/sneakers_and_accessories.csv"

var width = 950,
height = 600,
padding = 20;

//Colors dictionary
var colors_dict = {
	"sneakers": "black",
	"accessories": "red",
};

var svg = d3.select("#sneakers_and_accessories-chart")
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
.defined(function (d) { return d.multiple; })
.x(function(d) { return xScale(d.date); })
.y(function(d) { return yScale(d.multiple); });

//Create bisect to get y from x for tooltip
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

//Function to create graph
function createGraph(data) {

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
	.attr("transform", "translate(50," + padding + ")")
	.call(yAxis);

	//Draw line for each object
	data.forEach(function(d,i) {

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
	.attr("width", width / 11)
	.attr("x", width - 200)
	.attr("y", function() {
		return height - 140;
	})
	.attr("transform", "translate(0,-20)");

    //Group to contain circles and text for tooltip
  	var focus = svg.append("g")
  	.attr("class", "focus")
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Group to contain circles
  	var circle_per_line = focus.selectAll(".circle-per-line")
  	.data(data)
  	.enter()
  	.append("g")
  	.attr("class", "circle-per-line");

  	//Tooltip line
  	var tooltip_line = svg.append("rect")
  	.attr("class", "tooltip-line")
  	.attr("height", height - 100 - padding)
  	.attr("width", "1px")
  	.attr("y", padding)
  	.attr("transform", "translate(50,0)")
  	.style("display", "none");

  	//Tooltip circles
  	circle_per_line.append("circle")
  	.attr("r", 6.5)
  	.style("stroke", function(d) {
  		return colors_dict[d.name];
  	});
	
	//Supreme background rect
	circle_per_line.append("rect")
	.attr("x", 9)
	.attr("y", -10)
	.attr("width", 42)
	.attr("height", 20)
	.attr("fill", "red")
	.attr("class", "supreme_rect");

	circle_per_line.append("text")
	.attr("x", 11)
	.attr("dy", ".35em")
	.attr("fill", "white");

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
			if (isNaN(data_item.multiple)) {
				//If there's no sale price yet, put the circle a million miles away
				return "translate(-1000,0)";
			} else {
				//Translate circles
				return "translate(" + xScale(data_item.date) + "," + (yScale(data_item.multiple) + padding) + ")"
			}

		})

		//Update location of tooltip line using global data_item
		tooltip_line.attr("x", xScale(data_item.date));

		//Update supreme background color
		focus.selectAll(".supreme_rect")
		.attr("fill", function(d) {
			//Use dataset x to get dataset y
			return colors_dict[d.name];
		});

		//Update text value
	    focus.selectAll("text")
	    .text(function(d) {
	    	//Use dataset x to get dataset y
			var data_item = d.values[bisectDate(d.values, dataset_x)]
	    	return d3.format(",.2f")(data_item.multiple) + "x";
		});
		

	});
};

//Function to create legend
function createLegend(data) {

	//Create legend
    var legend = svg.selectAll("legend")
	.data(data)
	.enter()
	.append("g")
	.attr("class", "legend")
	.on("click", function(d) {
		//Reverse visible on chosen series
		d.visible ? d.visible = false : d.visible = true;
		//Update graph
		update(data);
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
		d3.select(this).style("opacity", 0.5);
	})
	.on("mouseout", function(d) {
		d3.select(this).style("opacity", 1);
	});

   	legend.append('text')
	.attr('x', 100)
	.attr('y', function(d, i) {
		return height - 127 - (i * 18);
	})
	.text(function(d) {
		return d.name[0].toUpperCase() + d.name.slice(1,);
	});
}

d3.csv(data_link, function(data) {

	data.forEach(function(d) {
        d.date = parseDate(moment.utc(d.date).format("YYYY-MM-DD")); 
        d.sneakers = parseFloat(d.sneakers);
		d.accessories = parseFloat(d.accessories);
 	});

 	//Extract columns names
 	var data_keys = d3.keys(data[0]).filter(function(key) { return key !== 'date'; })

 	//Create data array with object for each color
 	var data = data_keys.map(function(name) {
 		return {
 			name: name,
 			values: data.map(function(d) { 
 				return {date: d.date, multiple: d[name]};
 			}),
 			visible: true
 		};
 	});

	//Set domains for x and y scales
	xScale.domain([
		d3.min(data, function(d) { return d3.min(d.values, function(v) { return v.date; } ) }),
		d3.max(data, function(d) { return d3.max(d.values, function(v) { return v.date; } ) })
	]);
	yScale.domain([0, 
		d3.max(data, function(d) { return d3.max(d.values, function(v) { return v.multiple; } ) })
	]);

 	//Create graph
 	createGraph(data);
 	//Create legend
 	createLegend(data);

});

//This function gets called whenever a series in the legend is clicked on
function update(data) {

	//Update the data array to only contain series where visible is set to true
	data_filtered = data.filter(function(jordan) {
		return jordan['visible'] === true;
	});

	//Update domains of x and y scales
	xScale.domain([
		d3.min(data_filtered, function(d) { return d3.min(d.values, function(v) { return v.date; } ) }),
		d3.max(data_filtered, function(d) { return d3.max(d.values, function(v) { return v.date; } ) })
	]);
	//Add 50 to max multiple as padding
	yScale.domain([0, 
		d3.max(data_filtered, function(d) { return d3.max(d.values, function(v) { return v.multiple} ) })
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

	//Create rest of graph - as per filtered data
	createGraph(data_filtered);
	//Create legend - as per full jordan dataframe
	createLegend(data);

}












