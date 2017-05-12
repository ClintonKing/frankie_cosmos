//Start with selecting the body and creating svg and axes
var graphDiv = d3.select('div.chartOne');

//Set variables for height and width of svg
var width = parseInt(d3.select('div.chartOne').style("width"));
var height = 400;

//Create SVG
var svg = graphDiv.append('svg')
  .attr("width", width)
  .attr("height", height);

// var x = d3.time.scale()
//   .domain([new Date('2009'),new Date('2016')])
//   .range([0, width]);


//Variables for number of albums within each year.
var allYears = [];
var yearSpan = [];
var countArray = [];
var counts = [];

//Now let's call our data
d3.json('chastity.json', function(err,data){
  if (err) throw error;
  //Check to see if our data is coming in
  console.log(data);

  //Here's where we actually count the albums in each year for the vars above.
  for(var i = 0; i < data.length; ++i){
    var release = data[i].release;
    var year = release.substring(0,4);
    yearInt = Number(year);
    allYears.push(yearInt);
  };
  allYears.sort();

  //Finds largest and smallest year of release for any album in list, then creates an array with span of all years, and one that will hold count for albums released that year.
  var largestYear = Math.max.apply(Math, allYears);
  var smallestYear = Math.min.apply(Math, allYears);
  for (var i = smallestYear; i <= largestYear; i++) {
      yearSpan.push(i);
  }
  for(var i = 0; i < yearSpan.length; i++){
  	countArray[i] = 0;
  }

  //Now counts number of albums with any particular release year...
  for(var i = 0; i < allYears.length; i++){
        var count = yearSpan.indexOf(allYears[i]);
        countArray[count]++
  }

  //...and make object array
  for(var i = 0; i < yearSpan.length; i++){
    var yearValue = yearSpan[i];
    var countValue = countArray[i];

    item = {};
    item ["year"] = yearValue;
    item ["albums"] = countValue;

    counts.push(item);
  }

  //Let's see if those final counts look right...
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
      .attr("y", function(d){return height -y(d.albums) - 10}) //-10 to float
      .attr("text-anchor", "middle")
      .attr("class", "barText")
      .attr("id", function(d){return "text" + d.year})
      .text(function(d){return d.albums.toFixed(0)})
      .style("fill", "white")
      .style("font-family", "sans-serif")
      .style("font-size", "16px");

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
