// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
    // Function to determine marker size based on magnitude
    function markerSize(magnitude) {
        return magnitude * 2; // Adjust the multiplier for size
    }

    // Function to determine marker color based on depth
    function getColor(depth) {
        return depth > 90 ? '#8B0000' :
               depth > 70 ? '#FF0000' :
               depth > 50 ? '#FF4500' :
               depth > 30 ? '#FFA500' :
               depth > 10 ? '#FFFF00' :
               depth > -10 ? '#00FF00' :
               '#00FFFF';
    }

    // Loop through the data and create markers
    data.features.forEach(function(feature) {
        var coords = feature.geometry.coordinates;
        var magnitude = feature.properties.mag;
        var depth = coords[2];

        // Create a circle marker
        var circle = L.circleMarker([coords[1], coords[0]], {
            radius: markerSize(magnitude),
            fillColor: getColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        // Bind a popup with additional information
        circle.bindPopup("Magnitude: " + magnitude + "<br>Depth: " + depth + " km");
    });

    // Create a legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<strong>Depth (km)</strong><br>';
        div.innerHTML += '<i style="background: #00FF00"></i> -10 - 10<br>';
        div.innerHTML += '<i style="background: #FFFF00"></i> 10 - 30<br>';
        div.innerHTML += '<i style="background: #FFA500"></i> 30 - 50<br>';
        div.innerHTML += '<i style="background: #FF4500"></i> 50 - 70<br>';
        div.innerHTML += '<i style="background: #FF0000"></i> 70 - 90<br>';
        div.innerHTML += '<i style="background: #8B0000"></i> +90<br>';
        return div;
    };
    legend.addTo(map);
});