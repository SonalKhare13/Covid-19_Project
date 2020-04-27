// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [38.30, -98.00],
    zoom: 4
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // L.tileLayer("https://api.mapbox.com/styles/v1/mauma/ck8y47lqu03m31it4vnm9v7d9.html?fresh=true&title=copy&access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Uncomment this link local geojson for when data.beta.nyc is down
  var link = "static/data/usstates.geojson";
  
  // // Grabbing our GeoJSON data..
  // d3.json(link, function(data) {
  //   // Creating a GeoJSON layer with the retrieved data
  //   L.geoJson(data).addTo(myMap);
  // });
  
  // Load in geojson data
  var geoData = "static/data/usstates.geojson";
  var stateData="/data/state";
  var defaultState = "Minnesota";
  
  
  //   create a function that will return state name from geogyson file
  function myFunction(e) {
    //  console.log(e.sourceTarget.feature.properties.NAME);
   addState(e.sourceTarget.feature.properties.NAME)
   
   }
  
  
   //Feed in the state from the geojyson file to return state graph values
   function addState(stateN){
     console.log(stateN)
    d3.json(stateData).then(function(sdata) {
      // Loop through data
    for (var i = 0; i < sdata.length; i++) {
      var location = sdata[i].state;
      // console.log(location)
    
    if (sdata[i].state == stateN){
    console.log(stateN)
    //now make pie chart
    }
     };
    
      }
    )};
  
    //Read Geojson file
    var geojson;
  
    d3.json(geoData, function(data) {
      // Create a new choropleth layer
      geojson = L.choropleth(data, {
        // Define what  property in the features to use
        valueProperty: "CENSUSAREA",
        // Set color scale      // scale: ["#FFFFB2", "#B10026"],     // Number of breaks in step range
        steps: 10,
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
        layer.on({click:myFunction})
        // console.log(feature.properties.NAME)
        // layer.bindPopup("State: " + feature.properties.NAME + "<br>population:<br>" +
        // + feature.properties.CENSUSAREA);
    }
    }).addTo(myMap);
  
  
    var dataset = {}
    function init(){
      console.log("initializing dashboard");
    
    
      d3.json("/data/state").then(function(jsonData){
        dataset = jsonData;
    
        
        // initializeLineChart(defaultState);
        initializePieChart(defaultState);
  
      })
    }
  
    function initializePieChart(state) {
  
      console.log(`Calling initializePieChart ${state}`);
  
      d3.json("/data/state").then((data) => {
  
        console.log(data);
          // var samples = data.state;
          // var resultArray = samples.filter(s => s.id == state);
  
          // var result = resultArray[0];
  
          // var beds = result.otu_ids;
          // var otu_labels = result.otu_labels;
          // var sample_values = result.sample_values;
  
          // yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
  
          // var barData = {
          //     x: sample_values.slice(0, 10).reverse(),
          //     y: yticks,
          //     type: "bar",
          //     text: otu_labels.slice(0, 10).reverse(),
          //     orientation: "h"
          // };
  
          // barArray = [barData];
  
          // var barLayout = {
          //     title: "Top 10 Bacteria Cultures Found",
          //     margin: { t: 30, l: 150 }
          // };
  
          // Plotly.newPlot("bar", barArray, barLayout);
  
  
      });
  
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
    // // Set up the legend
    // var legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    //   var div = L.DomUtil.create("div", "info legend");
    //   var limits = geojson.options.limits;
    //   var colors = geojson.options.colors;
    //   var labels = [];
  
    //   // Add min & max
    //   var legendInfo = "<h1>Median Income</h1>" +
    //     "<div class=\"labels\">" +
    //       "<div class=\"min\">" + limits[0] + "</div>" +
    //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //     "</div>";
  
    //   div.innerHTML = legendInfo;
  
    //   limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //   });
  
    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //   return div;
    // };
  
    // // Adding legend to the map
    // legend.addTo(myMap);
  
  });
  
  
  