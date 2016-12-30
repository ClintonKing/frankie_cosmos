//Start with selecting the body and creating svg and axes
var body = d3.select('body');

//Set variables for height and width of svg
var width = 500;
var height = 500;

//Create SVG
var svg = body.append('svg')
  .attr("width", width)
  .attr("height", height);

var albums;

// var x = d3.time.scale()
//   .domain([new Date('2009'),new Date('2016')])
//   .range([0, width]);


//Define format for dates
var format = d3.time.format("%Y-%m-%dT%H:%M:%SZ")

//Variables for number of albums within each year.

var count2009 = 0;
var count2010 = 0;
var count2011 = 0;
var count2012 = 0;
var count2013 = 0;
var count2014 = 0;
var count2015 = 0;
var count2016 = 0;

var counts;

//Now let's call our data
d3.json('albums.json', function(err,data){
  if (err) throw error;
  //Assign data to var
  albums = data;
  //Check to see if our data is coming in
  console.log(data);

  //Here's where we actually count the albums in each year for the vars above.
  for(var i = 0; i < data.length; ++i){
    var release = new Date(data[i].release);
    var year = release.getFullYear();
    if(year == 2009){
      count2009++;
    } else if(year == 2010){
      count2010++;
    } else if(year == 2011){
      count2011++;
    } else if(year == 2012){
      count2012++;
    } else if(year == 2013){
      count2013++;
    } else if(year == 2014){
      count2014++;
    } else if(year == 2015){
      count2015++;
    } else if (year == 2016){
      count2016++;
    }
  };
  //Let's see if those look right...

  counts = [
    {
      "year": 2009,
      "albums": count2009
    },
    {
      "year": 2010,
      "albums": count2010
    },
    {
      "year": 2011,
      "albums": count2011
    },
    {
      "year": 2012,
      "albums": count2012
    },
    {
      "year": 2013,
      "albums": count2013
    },
    {
      "year": 2014,
      "albums": count2014
    },
    {
      "year": 2015,
      "albums": count2015
    },
    {
      "year": 2016,
      "albums": count2016
    }
  ];

  console.log(counts);

  var x = d3.scale.ordinal()
    .domain(counts.map(function(d){return d.year}))
    .rangeRoundBands([0, width], 0.4);

  //Time to make some axes
  var y = d3.scale.linear()
    .domain([0, 30])
    .range([0, height]);

  var yInv = d3.scale.linear()
    .domain([30, 0])
    .range([0, height]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yInv)
    .orient('left');

  //Add and position the xAxis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);
  //Add and position the yAxis
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  //Onto our bars
  var yearGraph = svg.append("g");

  var yearBars = yearGraph
    .selectAll("rect")
    .data(counts)
    .enter()
    .append("rect");

  yearBars
    .attr("x", function(d){return x(d.year)})
    .attr("y", function(d){return height - y(d.albums)})
    .attr("height", function(d){return y(d.albums)})
    .attr("width", x.rangeBand())
    .attr("class", "shape yearBar")
    .attr("id", function(d){return d.year});

    // Informational text for bars
    var yearBarText = yearGraph.selectAll("text")
        .data(counts)
        .enter()
        .append("text");

     yearBarText
      .attr("x", function(d){return x(d.year) + (x.rangeBand()/2)}) //Needs extra padding of half the bar width to center text
      .attr("y", function(d){return height -y(d.albums) - 10})
      .attr("text-anchor", "middle")
      .attr("class", "barText")
      .attr("id", function(d){return "text" + d.year})
      .text(function(d){return d.albums.toFixed(0)})
      .style("fill", "black")
      .style("font-family", "sans-serif")
      .style("font-size", "14px");

    //Let's make info for a specific bar appear on hovering on that bar.
    $(".shape").mouseenter(function(){
      var num = this.id;
      $("#text" + num).show();
    });
    $(".shape").mouseleave(function(){
      var num = this.id;
      $("#text" + num).hide();
    });
    

});
