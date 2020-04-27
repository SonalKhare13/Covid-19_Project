// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
  center: [38.30, -98.00],
  zoom: 3.8
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
// L.tileLayer("https://api.mapbox.com/styles/v1/mauma/ck8y47lqu03m31it4vnm9v7d9.html?fresh=true&title=copy&access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);


var link = "static/data/usstates.geojson";

d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data).addTo(myMap);
});

// Load in geojson data
var geoData = "static/data/usstates.geojson";
var stateData="/data/state";

// Define a dictionary to hold key-value pairs,
// where the key is the state name and the value is
// the number of ICU beds in that state. 
var icuBedsLookup = {};


// Define a function that populates the dictionary 
// of ICU beds. This function should be called once
// when the page loads. 
function countIcuBeds() {
  d3.json(stateData).then((data) => {

    data.forEach((state) => {
      if (!(state.state in icuBedsLookup)) {
        icuBedsLookup[state.state] = state.beds;
       
      }
    }); 

    // console.log(icuBedsLookup); 
  }); 
}
// Populate the dictionary of ICU beds 
countIcuBeds();


// Define a function that populates the dictionary 
// of population. This function should be called once
// when the page loads.
var populationLookup = {};

function countpopulation() {
  d3.json(stateData).then((data) => {

    data.forEach((state) => {
      if (!(state.state in populationLookup)) {
        populationLookup[state.state] = state.Population;
      }
    }); 

    // console.log(populationLookup); 
  }); 
}
// Populate the dictionary of ICU beds 
countpopulation();

  //  create a function that will return state name from geogyson file
  function myFunction(e) {

 
   console.log(e.sourceTarget.feature.properties.NAME);
   addState(e.sourceTarget.feature.properties.NAME)
   DrawPieChart(e.sourceTarget.feature.properties.NAME);
   DrawLineChart(e.sourceTarget.feature.properties.NAME);
   }
  
  
   //Feed in the state from the geojyson file to return state graph values
    //Feed in the state from the geojyson file to return state graph values
    function addState(stateN){
      // console.log(stateN)
     return stateN;
   };
 


var geojson;

// Grab data with d3
d3.json(geoData).then((data) => {
// console.log(data);

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "CENSUSAREA",

    // Set color scale
    // scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
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
      // console.log(feature.properties.NAME);
      layer.on({click:myFunction})

      // Use the state name to lookup the number of ICU beds - DOM
      var numBeds = icuBedsLookup[feature.properties.NAME]; 
      var numPop = populationLookup[feature.properties.NAME]; 
      layer.bindPopup("State: " + feature.properties.NAME + "<br>Population: "
        + numPop + "<br>ICU Beds: " + numBeds); 
      
}
 
}).addTo(myMap);

// Add a legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = geojson.options.limits;
  var colors = geojson.options.colors;
  var labels = [];
  // Add min & max
  var legendInfo = "<h2>Census Area</h2>" 
  div.innerHTML = legendInfo;
  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};
// Adding legend to the map
legend.addTo(myMap);


});


// DrawPieChart
function DrawPieChart(state) {
  
  console.log("DrawPieChart Started")

  d3.json("/data/casessummary").then(function(data) {
  // filter samples by state
  var newState = data.filter((x)=>x.state === state);
   // console.log(newState)
  newState.forEach(function(d) {
    
    d.confirmed = +d.confirmed;
    d.deaths = +d.deaths;
    d.recovered = +d.recovered;
  });

  keys = ["Confirmed","Deaths" ,"Recovered"]
  // beds_var1 = [newState.map(function(d) { return d.beds;})];
  // // console.log(values1)
  // beds_var2 = beds_var1[0]
  // nocounties_var1 = [newState.map(function(d) { return d.county_count;})];
  // nocounties_var2 = nocounties_var1[0]
  confirmed_var1 = [newState.map(function(d) { return d.confirmed;})];
  confirmedcases= confirmed_var1[0]

  deaths_var1 = [newState.map(function(d) { return d.deaths;})];
  deathcases=deaths_var1[0]

  recovered_var1 = [newState.map(function(d) { return d.recovered;})];
  recoveredcases=recovered_var1[0]
  console.log("death"+deathcases);
  console.log("Recovered"+recoveredcases);
  
      // create trace0 Data  for bar chart for one state
  var trace = [{
      values : [confirmedcases[0], deathcases[0],recoveredcases[0]],
      labels : keys,
        
      type:"pie",
      orientation: "v",
  }];

    

// Define a layout object
  var layout = {
      title: "confirmed Vs recovered Vs dead cases",
      labels : keys,
      width: 400,
      height: 300,
      
    };  
    Plotly.newPlot("Piechart", trace);



  });
}  //End Function DrawPieChart


// draw line chart
function DrawLineChart(state) {

  console.log("DrawLineChart Started")

  d3.json("/data/cases").then(function(data) {

  var newState = data.filter((x)=>x.state === state);
  // var parsedate = d3.timeFormat('%H:%M:%S %L'); 

  // console.log("test test"+newState)
  newState.forEach(function(d) {
    d.month = +d.month;
    d.confirmed = +d.confirmed;
    d.deaths = +d.deaths;
    d.recovered = +d.recovered;
  });
 
  keys = ["months", "cases"]
  confirmed_var1 = [newState.map(function(d) { return d.confirmed;})];
  confirmedcases= confirmed_var1[0]

  month_var1 = [newState.map(function(d) { return d.month;})];
  months = month_var1[0]

  deaths_var1 = [newState.map(function(d) { return d.deaths;})];
  deathcases=deaths_var1[0]

  recovered_var1 = [newState.map(function(d) { return d.recovered;})];
  recoveredcases=recovered_var1[0]
 
      // create trace0 Data  line graph1
  var trace2 = [{
    
      x: [months[0],months[1],months[2]],
      //  y: [confirmedo[0],confirmedo[1],confirmedo[2]],
      y: [confirmedcases[0],confirmedcases[1],confirmedcases[2]],

      mode: 'lines+markers',
      name: 'confirmed'
  }];

  // var trace3 = [{
  //     x: [months[0],months[1],months[2]],
  //     y: [deathcases[0],deathcases[1],deathcases[2]],
  //     //  color:"blue",
  //     mode: 'lines',
  //     name: 'deaths'
   
  // }];

  // var trace4 = [{
  //     x: [months[0],months[1],months[2]],
  //     y: [recoveredcases[0],recoveredcases[1],recoveredcases[2]],
  //   // color:"yellow",
  //   mode: 'Scatter',
  //   name: 'recovered'

  // }];

  var data=trace2
  // ,trace3,trace4
// Define a layout object
  var layout = {
      title: "Covid 19 confirmed Cases",
      
      width: 500,
      height: 300,
      xaxis: {
        title: 'Month',
        showgrid: false,
        zeroline: false
      },
      yaxis: {
        title: 'Number of Cases',
        showline: false,
        zeroline: false
      },
      
    }; 

Plotly.newPlot("lineGraph", data,layout);


  });

}

//Initialize state

function init() {
  var Initial_State = "Minnesota"

  DrawPieChart(Initial_State);

  DrawLineChart(Initial_State);
  
}


init();