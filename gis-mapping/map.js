// ArcGIS libraries use AMD format.  To use the libraries, 
// we specify a list of modules (e.g. Map, MapView) in a list
// with the require.  The second parameter defines a function
// that will use these modules.  We specify the module names
// in order in the function parameter list.  When this javascript
// file is loaded by the html, it will run this function using these
// modules.

// Read more here: https://dojotoolkit.org/documentation/tutorials/1.10/modules/index.html

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Legend"
], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Locate, Search, Legend) {

    // setting the API key
    esriConfig.apiKey = "AAPK6dac111b06534f8c95f22f0ea4a2e13c5yxpgq7pA-iI6_VtK-_XgwOkuKpXkntOSldU_OSUc5cQPBuUX_Nz_2vNIPQSI7Go";

    // creates basemap
    var map = new Map({
        basemap: "gray-vector"
    });

    // create map from basemap
    var view = new MapView({
        map: map,
        
        
        center: [-5, 40],
        zoom: 3,
        container: "viewDiv"
    });

    // create a graphics layer for all the graphics
    var graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    var xmlhttp = new XMLHttpRequest();



    // Function to send http request to retrieve and loop through data to be added to map
    xmlhttp.onreadystatechange = function() {
        // response received returns 4 and successful response returns 200
        if (this.readyState == 4 && this.status == 200) {
            
            // Convert the JSON text to JSON object that we
            // can loop through
            var data = JSON.parse(this.responseText);

            // data used for reference:
            // https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson
            
            // Loop through each feature in the features list
            for (feature of data.features) {    

                // symbol color based on airport size
                var color;
                var type = feature.properties.type;
                if (type == "major") {
                    color = [0,0,139]; // dark blue for major
                }
                else if (type == "mid") {
                    color = [0,0,255]; // blue for medium
                }
                else if (type == "small") {
                    color = [173,216,230]; // light blue for small
                }
                else {
                    color = [0,255,0]; // green for military
                }

                // Create a marker for each airport               
                var marker = {
                    type: "simple-marker",
                    color: color 
                };

                // Input location of airport
                var location = {
                    type: "point",
                    longitude: feature.geometry.coordinates[0],
                    latitude: feature.geometry.coordinates[1]
                };

                // Define attributes to use in the popup
                var popupAttributes = {
                    name: feature.properties.name,
                    abbrev: feature.properties.abbrev,
                    size: feature.properties.type
                }

                // Organize the popup
                var popupTemplate = {
                    title: "{name} Airport",
                    content: "<br>Code</b>: {abbrev}<br><b>Size</b>: {size}"
                }
        
                // Create a graphic object
                // This contains the airport's location, marker, and popup
                var graphic = new Graphic({
                    geometry: location,
                    symbol: marker,
                    attributes: popupAttributes,
                    popupTemplate: popupTemplate
                });

                // Add the graphic (with its popup) to the graphics layer
                graphicsLayer.add(graphic);

            }

        }
    };


    // execute function above - retrieve data and add to graphics layer
    xmlhttp.open("GET", "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson", true);
    xmlhttp.send();

    view.popup.defaultPopupTemplateEnabled = true;   

    

    // locate me button
    var locate = new Locate({
        view: view,
        rotaionEnabled: false,
        goToOverride: function(view, options) {
            options.target.scale = 1000000;  // 1/1000000 scale
            return view.goTo(options.target);
            }
    });
    view.ui.add(locate, "top-left");

    // Search Bar ---------------------
    var search = new Search({
        view: view
    });
    view.ui.add(search, "top-right"); 

    // Legend -------------------------
    


});