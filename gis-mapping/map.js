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
    "esri/widgets/Legend",
    "esri/widgets/Expand"
], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Locate, Search, Legend, Expand) {

    // setting the API key
    esriConfig.apiKey = "AAPK6dac111b06534f8c95f22f0ea4a2e13c5yxpgq7pA-iI6_VtK-_XgwOkuKpXkntOSldU_OSUc5cQPBuUX_Nz_2vNIPQSI7Go";

    // creates basemap
    var map = new Map({
        basemap: "gray-vector"
    });

    // create map from basemap
    var view = new MapView({
        map: map,
        center: [-95, 40],
        zoom: 3,
        container: "viewDiv"
    });
    
    // create a graphics layer for all the graphics
    var graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Function to add data to graphicsLayer
    function loadGraphics() {
        graphicsLayer.removeAll();
        var xmlhttp = new XMLHttpRequest();
        // Function to send http request to retrieve and loop through data to be added to map
        xmlhttp.onreadystatechange = function() {
            // response received returns 4 and successful response returns 200
            if (this.readyState == 4 && this.status == 200) {
                
                // Convert the JSON text to JSON object that we
                // can loop through
                var data = JSON.parse(this.responseText);
                
                // Loop through each feature in the features list
                for (feature of data.features) {    

                    // fill color based on park type
                    var color;
                    var type = feature.properties.unit_type;
                    if (type == "National Park") {
                        color = [0,0,139]; // dark blue
                    }
                    else if (type == "National Seashore") {
                        color = [0,0,255]; // blue
                    }
                    else if (type == "National Recreation") {
                        color = [173,216,230]; // light blue
                    }
                    else if (type == "National Preserve") {
                        color = [173,216,230]; // light blue
                    }
                    else if (type == "National Monument") {
                        color = [173,216,230]; // light blue
                    }
                    else if (type == "National Lakeshore") {
                        color = [173,216,230]; // light blue
                    }
                    else {
                        color = [0,255,0]; // green
                    }

                    // Create a marker for each park                 
                    var marker = {
                        type: "simple-fill",
                        color: color 
                    };

                    // Input location of park
                    var location = {
                        type: "polygon",
                        rings: feature.geometry.coordinates
                    };

                    // Define attributes to use in the popup
                    var popupAttributes = {
                        name: feature.properties.name,
                        type: feature.properties.unit_type,
                        region: feature.properties.nps_region,
                        size: feature.properties.scalerank
                    }

                    // Organize the popup
                    var popupTemplate = {
                        title: "{name} {type}",
                        content: "<br>Region</b>: {region}<br><b>Size</b>: {size}"
                    }
            
                    // Create a graphic object
                    // This contains the airport's location, marker, and popup
                    var graphic = new Graphic({
                        geometry: location,
                        symbol: marker,
                        attributes: popupAttributes,
                        popupTemplate: popupTemplate
                    });

                    // Display all or only filtered results
                    if (filterSelect.value == feature.properties.unit_type || filterSelect.value == 'all') {
                        graphicsLayer.add(graphic);
                    }
                }
            }
        };
        // execute function above - retrieve data and add to graphics layer
        xmlhttp.open("GET", "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_parks_and_protected_lands_area.geojson", true);
        xmlhttp.send();
}
    loadGraphics();
    // Reload data on new select option
    const filterSelect = document.getElementById('filter');
    filterSelect.addEventListener('input', () => {
        loadGraphics();
    });
    view.popup.defaultPopupTemplateEnabled = true;   

    




    // locate me button
    var locate = new Locate({
        view: view,
        rotaionEnabled: false,
        goToOverride: function(view, options) {
            options.target.scale = 10000000;  // 1/1000000 scale
            return view.goTo(options.target);
            }
    });
    view.ui.add(locate, "top-left");

    // Search Bar ---------------------
    var search = new Search({
        view: view
    });
    view.ui.add(search, "top-right"); 

    //Legend -------------------------
    const legend = new Legend({
        view: view,
        container: "legend",
    });

    const expand = new Expand({
        view: view,
        content: document.getElementById('expand'),
        expanded: true
    });

    view.ui.add(expand, "bottom-right");
});
