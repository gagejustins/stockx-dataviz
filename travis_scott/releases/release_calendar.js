// TODO:
// Fix scrolling issue that causes sneakers tooltips to appear too high on the canvas
// Fix magic numbers (they're everywhere!)

console.log("D3 running");

var link = "https://gist.githubusercontent.com/gagejustins/c3e585cf0228500cf06127c95ce75b59/raw/86a5614190e6901dc3379aab72ec649e3d47d393/travis_scott_releases.csv"

var width = 950,
height = 800,
padding = 20,
offset = 50
graphOffset = 200;

const albums_svg = d3.select("#album-container")
.style("width", width - 150 + "px")
.style("left", 67 + padding + "px")
.style("top", height - 110 + "px")
.append("svg")
.attr("width", width - 150 + "px")
.attr("height", 120 + "px");

var svg = d3.select("#releases-chart")
.append("svg")
.attr("width", width)
.attr("height", height);

var dataset;

//Text tooltip
var tooltip_div = d3.select("#releases-chart")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0)

// gridlines in x axis function
function make_x_gridlines() {		
    return d3.axisBottom(xScale)
        .ticks(6)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(yScale)
        .ticks(6)
}

var xScale = d3.scaleTime()
.range([0, width - 150])

var yScale = d3.scaleLinear()
.rangeRound([height - 100 - padding - graphOffset, 0]);

var parseDate = d3.timeParse("%Y-%m-%d");

//Define line generator
var sneakers_line = d3.line()
.defined(function (d) { return d.avg_resale_multiple; })
.x(function(d) { return xScale(d.release_date); })
.y(function(d) { return yScale(d.avg_resale_multiple); });

// Function to draw an album image and hover properties
function releaseImage(image, release_date, name, description) {
	
	albums_svg
	.append("rect")
	.attr("fill", "#ff6961")
	.attr("x", xScale(parseDate(release_date)) - 25 - 2)
	.attr("y", 23)
	.attr("opacity", 0)
	.attr("width", 74)
	.attr("height", 74)
	.on("mouseover", function() {
		// add hover effect
		d3.select(this)
		.transition()
		.attr("opacity", 1)

		//Move and display the tooltip
		tooltip_div
		.style("left", `${(this.getBoundingClientRect().x + window.scrollX)}px`)
		.style("top", `${(this.getBoundingClientRect().y + window.scrollY) - offset*1.7}px`)
		.html(`
			  <h4>${name}</h4>
			  <p>Release Date: ${release_date}</p>
			  <p class="description-text">${description}</p>
			  `)
		.attr("transform", `translate(${offset},${padding})`);
		
		tooltip_div
		.transition()
		.style("opacity", 1)

	})
	.on("mouseout", function() {
		d3.select(this)
		.transition()
		.attr("opacity", 0)

		// hide tooltip
		tooltip_div
		.transition()
		.style("opacity", 0)
	})

	var img = albums_svg.append("svg:image")
	.attr("id", image)
	.attr("xlink:href", `images/${image}`)
	.attr("x", xScale(parseDate(release_date)) - 25)
	.attr("y", 25)
	.attr("width", 70)
	.style("pointer-events", "none")

}

//Function to create graph
function createGraph(data, tooltip_div) {

	//Create x axis
	var xAxis = d3.axisBottom(xScale)
	.ticks(10)
	.tickSize(0);

	//Create y axis
	var yAxis = d3.axisLeft(yScale)
	.ticks(10)
	.tickFormat(function(d) { return d + "x" });

	//Append x axis
	svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50," + (height - graphOffset - 100) + ")")
	.call(xAxis);

	//Append y axis
	svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(50,0)")
	.call(yAxis);

    // add the X gridlines
	svg.append("g")			
	.attr("class", "grid")
	.attr("transform", "translate(50," + (height - graphOffset - 100 - padding/3) + ")")
	.call(make_x_gridlines()
		.tickSize(-height)
		.tickFormat("")
	)

	// add the Y gridlines
	svg.append("g")			
	.attr("class", "grid")
	.attr("transform", "translate(50,0)")
	.call(make_y_gridlines()
		.tickSize(-width+150)
		.tickFormat("")
	)

	//Add darker x line
	svg.append("line")
	.attr("stroke-width", "1px")
	.attr("stroke", "black")
	.attr("y1", height - graphOffset - 100 - padding)
	.attr("y2", height - graphOffset - 100 - padding)
	.attr("x1", 50)
	.attr("x2", width - 100)

	//Draw line 
	svg.append("path")
	.attr("class", "line")
	.style("stroke", "#ff6961")
	.attr("d", sneakers_line(data))
	.attr("transform", `translate(${offset},${padding})`);

	//Draw points
	var points = svg.selectAll("circles")
	.data(data)
	.enter()
	.append("circle")
		.attr("fill", "red")
		.attr("stroke", "black")
		.attr("stroke-width", 35)
		.attr("stroke-opacity", 0)
		.attr("cx", function(d) { return xScale(d.release_date); })
		.attr("cy", function(d) { return yScale(d.avg_resale_multiple); })
		.attr("r", 4)
		.attr("transform", `translate(${offset},${padding})`)
	.on("mouseover", function(d) {
		//Size up the point
		d3.select(this)
		.transition()
		.attr("r", 8);

		const cx = d3.select(this).attr("cx");
		const cy = d3.select(this).attr("cy");

		//Move and display the tooltip
		tooltip_div
		.style("left", (cx < width - 200) ? `${(this.getBoundingClientRect().x + window.scrollX)}px` : `${(this.getBoundingClientRect().x + window.scrollX) - offset*3.15}px`)
		.style("top", (cy > 130) ? `${(this.getBoundingClientRect().y + window.scrollY) - offset*2.8}px` : `${(this.getBoundingClientRect().y + window.scrollY) + offset/1.5}px`)
		.html(`<h4>${d.url_key}</h4>
			   <p>Release Date: ${d3.timeFormat("%m-%d-%Y")(d.release_date)}</p>
			   <p>Average Resale: ${d3.format("$.0f")(d.avg_resale_price)}</p>
			   <img src="images/${d.image_slug}.jpg" width="80px">  
			   `)
		.attr("transform", `translate(${offset},${padding})`);
		
		tooltip_div
		.transition()
		.style("opacity", 1)
	})
	.on("mouseout", function() {
		//Size down point
		d3.select(this)
		.transition()
		.attr("r", 4);

		//Hide toooltip
		tooltip_div
		.transition()
		.style("opacity", 0)
	});

	//Add StockX logo
	var stockx_logo = svg.append("svg:image")
	.attr("xlink:href", "images/stockx_logo.png")
	.attr("width", width / 15)
	.attr("height", width / 15 * .75)
	.attr("x", width - 180)
	.attr("y", function() {
		return height - 350;
	})
	.attr("transform", "translate(0,-20)");

};

d3.csv(link, function(data) {

	data.forEach(function(d) {
		d.release_date = parseDate(moment.utc(d.release_date).format("YYYY-MM-DD"));
	 })

	xScale.domain(d3.extent(data.map(x => x.release_date)));
	yScale.domain([0, d3.max(data.map(x => x.avg_resale_multiple))]);

 	//Create graph
	createGraph(data, tooltip_div);

	const media = [
		{
			image: 'astroworld.jpg',
			release_date: '2018-08-03',
			name: 'Astroworld',
			description: 'Triple platinum, 3 Grammy nominations'
		},
		{
			image: 'lookmom.jpg',
			release_date: '2019-08-28',
			name: 'Look Mom I Can Fly',
			description: 'Netflix documentary'
		},
		{
			image: 'jackboys.png',
			release_date: '2019-12-27',
			name: 'Jackboys',
			description: '#1 on US Billboard 200'
		},
		{
			image: 'power.png',
			release_date: '2019-04-18',
			name: 'Power is Power',
			description: 'From <i>For The Throne</i>'
		},
		{
			image: 'watch.png',
			release_date: '2018-05-04',
			name: 'Watch',
			description: '#16 on US Billboard Hot 100'
		}
	]

	media.forEach(function(d) {
		releaseImage(d.image, 
					 d.release_date, 
					 d.name, 
					 d.description)
	})

	albums_svg.append("svg:image")
	.attr("id", "travis-sticker")
	.attr("width", 20)
	.attr("xlink:href", "images/ts_shadow.png")
	.attr("x", 15)
	.attr("y", 40)
	.attr("width", 70)
	.style("pointer-events", "none")
	.attr("transform", "rotate(15)")
	

});

//Text tooltip
var album_text_div = d3.select("#releases-chart")
.append("div")
.attr("class", "text-overlay")
.style("width", 250 + "px")
.style("height", 250 + "px")
.style("left", 50 + "px")
.style("top", height - 145 + "px")
.append("svg")
.attr("width", 250)
.attr("height", 250);

album_text_div.append("text")
.attr("class", "music-text")
.text("Music and Media")
.attr("x", 10)
.attr("y", 55)
.attr("transform", "rotate(-10)")

album_text_div.append("text")
.attr("class", "music-text")
.attr("class", "music-subtext")
.text("Release timeline")
.attr("x", 10)
.attr("y", 72)
.attr("transform", "rotate(-10)")

album_text_div.append("text")
.attr("class", "music-text")
.attr("class", "music-subsubtext")
.text("(hover for details)")
.attr("x", 10)
.attr("y", 88)
.attr("transform", "rotate(-10)")

//Text tooltip
var sneakers_text_div = d3.select("#releases-chart")
.append("div")
.attr("class", "text-overlay")
.style("width", 250 + "px")
.style("height", 250 + "px")
.style("left", 75 + "px")
.style("top", 125 + "px")
.append("svg")
.attr("width", 250)
.attr("height", 250);

sneakers_text_div.append("text")
.attr("class", "music-text")
.text("Sneakers and Resale")
.attr("x", 10)
.attr("y", 55)
.attr("transform", "rotate(-10)")

sneakers_text_div.append("text")
.attr("class", "music-text")
.attr("class", "music-subtext")
.text("Release timeline")
.attr("x", 10)
.attr("y", 72)
.attr("transform", "rotate(-10)")

sneakers_text_div.append("text")
.attr("class", "music-text")
.attr("class", "music-subsubtext")
.text("(hover over points for details)")
.attr("x", 10)
.attr("y", 88)
.attr("transform", "rotate(-10)")