"use strict";
// load the world map data
d3.json("/static/data/countries.geo.json", draw);

function draw(geo_data) {
  // set the svg size
  var margin = 50,
    width = 1400 - margin,
    height = 600 - margin;

  // add title
  d3.select("body")
    .append("h2")
    .text("Global Terrorism ");

  // initialize the svg
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin)
    .attr("height", height + margin)
    .append('g')
    .attr('class', 'map');

  // initialize mercator projection
  var projection = d3.geo.mercator()
    .scale(200)
    .translate([width / 2, height / 1.5]);

  var path = d3.geo.path().projection(projection);

  // draw the world map
  var map = svg.selectAll('path')
    .data(geo_data.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill', '#1B1D1E')
    .style('stroke', '#1B1D1E')
    .style('stroke-width', 0.5);

  // add legend about circle radius meaning
  var comment = d3.select("body")
    .append("div")
    .attr("class", "comment")
    .append('div')
    .text("the combination of fatalities and injuries");

  var legend = svg.append('g')
    .attr("class", "legend");

  legend.append("circle")
    .attr('cx', 170)
    .attr('cy', 440)
    .attr('r', 5);

  legend.append("circle")
    .attr('cx', 170)
    .attr('cy', 465)
    .attr('r', 10);

  legend.append("circle")
    .attr('cx', 170)
    .attr('cy', 500)
    .attr('r', 15);

  // store the years that would be animated
  var years = [];

  for (var i = 1970; i <= 2017; i += 1) {
    if (i !== 1993) {
      years.push(i);
    }
  };

  // draw the terrorism event point on map
  function plot_points(data) {
    var radius = d3.scale.sqrt()
      .domain([0, 8750])
      .range([0, 40]);

    // initialize tooltip to popup event information
    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "toolTip");

    svg.append('g')
      .attr('class', 'bubble');

    data.forEach(function (d) {
      d.coords = projection([d.lon, d.lat]);
      return d;
    });
    /* animate the world map yearly
       the year 2017 will show a text mask with some statistics
       otherwise just show data points year by year
    */
    function update(year) {
      var filtered = data.filter(function(d) {
          if (year == 2017) {
            return d.year == 2016;
          } else {
            return d.year == year;
          }
      });

      if (year == 2017) {
        d3.select("h2")
          .text("global Terrorism since 1970");
      } else {
        d3.select("h2")
          .text("global Terrorism " + year);
      }

      // add data points on map
      var circles = svg.select('g.bubble')
        .selectAll('circle')
        .data(filtered, function(d) {
          return d.id;
        });

      circles.enter()
        .append("circle")
        .transition()
        .duration(500)
        .attr('cx', function(d) {
          return d.coords[0];
        })
        .attr('cy', function(d) {
          return d.coords[1];
        })
        .attr('r', function(d) {
          return radius(d.intensity);
        });

      circles.exit().remove();

      // add tooltip to show terrorism information
      if (year !== 2017) {
        circles.on("mouseover", function(d) {
            tooltip.style("visibility", "visible")
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY - 25 + "px")
              .html("<span style='color:#EFA747'>" + d.summary + "</span><br>" +
                "<strong>Attack type:</strong> <span style='color:#EFA747'>" + d.attack + "</span><br>" +
                "<strong>Target:</strong> <span style='color:#EFA747'>" + d.target + "</span><br>" +
                "<strong>Fatalities:</strong> <span style='color:#EFA747'>" + d.fatalities + "  " + "</span>" +
                "<strong>Injuries:</strong> <span style='color:#EFA747'>" + d.injuries + "</span>")
          })
          .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
          });
      };

      // set a text mask to show some statistics
      if (year == 2017) {
        // firstly, hidden the distracted legend
        d3.select('div.comment')
          .style('visibility', 'hidden');
        d3.select('g.legend circle')
          .style('visibility', 'hidden');

        // add rectagle mask
        svg.append('rect')
          .attr("class", "mask")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 1400)
          .attr("height", 600);

        svg.append("text")
          .transition()
          .duration(500)
          .attr("x", 100)
          .attr("y", 100)
          .text("What Terrorism Done these years?")
          .style('fill', '#EFA747')
          .style('font-size', "70px");

        svg.append("text")
          .transition()
          .duration(500)
          .delay(500)
          .attr("x", 175)
          .attr("y", 200)
          .text("In 205 countries, Terrorists")
          .style('fill', '#EFA747')
          .style('font-size', "60px");

        svg.append("text")
          .transition()
          .duration(500)
          .delay(1000)
          .attr("x", 250)
          .attr("y", 300)
          .text("Kill")
          .style('fill', '#EFA747')
          .style('font-size', "60px");

        // animate fatalities number
        svg.append("text")
          .attr('id', 'fatalities')
          .attr("x", 700)
          .attr("y", 300)
          .style('fill', '#EFA747')
          .style('font-size', "60px");

        d3.select('#fatalities')
          .transition()
          .duration(1500)
          .delay(1500)
          .tween("#fatalities", function() {
            var i = d3.interpolateRound(0, 383554);
            return function(t) {
              this.textContent = i(t);
            };
          });

        // animater injuries number
        svg.append("text")
          .transition()
          .duration(500)
          .delay(3000)
          .attr("x", 320)
          .attr("y", 400)
          .text("Wound")
          .style('fill', '#EFA747')
          .style('font-size', "60px");

        svg.append("text")
          .attr('id', 'injuries')
          .attr("x", 800)
          .attr("y", 400)
          .style('fill', '#EFA747')
          .style('font-size', "60px");

        d3.select('#injuries')
          .transition()
          .duration(1500)
          .delay(3500)
          .tween("text", function() {
            var i = d3.interpolateRound('0', '496117');
            return function(t) {
              this.textContent = i(t);
            };
          });

        // encourage reader to explore the map by themselves
        svg.append("text")
          .attr("x", 380)
          .attr("y", 500)
          .transition()
          .duration(500)
          .delay(5000)
          .text("Click to explore more detail")
          .style('fill', '#EFA747')
          .style('font-size', "60px");
      };
    };

    var year_idx = 0;

    // update the map year by year
    var year_interval = setInterval(function() {
      update(years[year_idx]);

      year_idx++;

      if (year_idx >= years.length) {
        clearInterval(year_interval);

        var rect = svg.select('rect');

        /* after clicking, remove the text mask, and then
           add year selection button for user to explore in detail
        */

        rect.on("click", function(d) {
          d3.select(this).remove();
          d3.selectAll('text').remove();

          // show legend again
          d3.select('div.comment')
            .style('visibility', 'visible');
          d3.selectAll('g.legend circle')
            .style('visibility', 'visible');

          var buttons = d3.select("body")
            .append("div")
            .attr("class", "years_buttons")
            .selectAll("div")
            .data(years.slice(0, -1))
            .enter()
            .append("div")
            .text(function(d) {
              return d;
            });

          buttons.on("click", function(d) {
            d3.select(".years_buttons")
              .selectAll("div")
              .transition()
              .duration(200)
              .style("color", "white")
              .style("background", "#1B1D1E");

            d3.select(this)
              .transition()
              .duration(200)
              .style("background", "#1B1D1E")
              .style("color", "#EFA747");
            update(d);
          });
        });
      }
    }, 1000);
  };
  // load and preprocess the global terrorism data
  d3.json("/static/data/global_terrorism_map.json", plot_points);
};
