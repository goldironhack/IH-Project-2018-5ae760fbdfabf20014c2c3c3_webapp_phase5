const CRIMES_URL = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";
const NY_DISTRICTS_GEOSHAPES_URL = 'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
const NY_PRECINCTS_GEOSHAPES_URL = 'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nypp/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
const NEIGHBORHOOD_NAMES_GIS = "https://data.cityofnewyork.us/resource/xyye-rtrs.json";
const NOMBRE_ARCHIVO_CSV = "tableCSV.csv";

var map;
var distrito;
var borought;
var datasetCrimes;
var districtIDs;
var infoWindow = new google.maps.InfoWindow({
    content: ""
});
var infoWindow2 = new google.maps.InfoWindow();
var listaPoligono = [];

$(document).ready(function(){
    
    crearMapaGeneral();
    
    //$("#convencion-container").css("display", "none");
    mostrarMapDistrict();
    $("#div-crimes").css("display", "none");
    
    $("#btnExportarCSV").on("click", function (){
        
        var csv = [];
        var rows = document.querySelectorAll("table tr");
        
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row.join(","));        
        }
    
        // Se descarga el archivo CSV 
        downloadCSV(csv.join("\n"), NOMBRE_ARCHIVO_CSV);
    });

    $("#a-districts").on("click", function (){
        mostrarMapDistrict();
        $("#convencion-container").css("display", "block");
    });
    
    $("#a-neighborhood").on("click", function (){
        mostrarMapNeighborhoodNames();
        $("#convencion-container").css("display", "none");
        
    });
    
    $("#a-safest").on("click", function (){
        getDistritosSeguros();
        $("#div-crimes").css("display", "block");
    });
});    

/**
 * Funcion que crea el mapa con la ubicación central de NY
 */
function crearMapaGeneral(){
   
   map = new google.maps.Map(d3.select("#map").node(), {
      zoom: 10,
      center: new google.maps.LatLng(40.7291, -73.9965),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      scrollwheel: false,
      styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]
    });
}

/**
 * Funcion que muestra los nombres de Neighborhood de NY
 */
function mostrarMapNeighborhoodNames(){
    var dataMap = NEIGHBORHOOD_NAMES_GIS;
    var latLng;
    
    crearMapaGeneral();
		
	$.getJSON(dataMap, function(json1) {

	    $.each(json1, function(key, data) {

		    latLng = new google.maps.LatLng(data.the_geom.coordinates[1], data.the_geom.coordinates[0]);

		    // Construct the circle for each value in dataMap.
            // Add the circle for this neighborhood to the map.
          
		    var cityCircle = new google.maps.Circle({
                strokeColor: 'red',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'red',
                fillOpacity: 0.35,
                map: map,
                center: latLng,
                radius: 318,
			    name:data.name
            });
		  
		    
		
		    google.maps.event.addListener(cityCircle, 'click', function() {

				var contentString = '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">'+ cityCircle.name +'</div>';
				infoWindow2.setContent(contentString);
				infoWindow2.setPosition(cityCircle.getCenter());

				infoWindow2.open(map);
				
			});
	    });
	});
}

/**
 * Crear Google Map…
 * Función que realiza la configuración y estilo del mapa principal 
 */
function mostrarMapDistrict(){
    
    crearMapaGeneral();
    //Marcar en el mapa cada distrito
    map.data.loadGeoJson(NY_DISTRICTS_GEOSHAPES_URL,{
        idPropertyName:'BoroCD'
    });
    
    // Agregar color a cada distrito
    map.data.setStyle(function(feature) {
      return ({
        fillColor: getColor(feature.getProperty('BoroCD')),
        strokeWeight: 1
      });
    });
    
    var gaGeom ;
    var poly;
    var ga;

    map.data.addListener('addfeature', function (event){

        ga = map.data.getFeatureById(event.feature.getId());
        gaGeom = ga.getGeometry();
        //console.log('array',gaGeom.getAt(0).getArray());
        //gaGeom is the feature.geometry from the data layer
        /*poly = new google.maps.Polygon({
            paths: gaGeom.getAt(0).getArray(),
            map: map,
            clickable: false
        });
        listaPoligono.push(poly);*/
    });
    
    // Mostrar información del distrito al dar click
    map.data.addListener('click', function(event) {
		//show an infowindow on click   
		borought = event.feature.getProperty('BoroCD');
		
		infoWindow.setContent(
		    '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;"> '+
			borought.toString().substring(0,1) + 
			' - '+ 
			borought.toString().substring(1,3) +
			'<br/> ' + 
			getNameDistrito(borought) + 
			'</div>');
		var anchor = new google.maps.MVCObject();
		anchor.set("position",event.latLng);
		infoWindow.open(map,anchor);
	});
}

/**
 * Parametro 1 de la aplicación
 * Función que retorna la data de crimenes
 * Trae los 10 distritos más seguros 
 * basados en la fecha del 31 de diciembre del 2015
 * 
 */
function getDistritosSeguros(){
    datasetCrimes = $.ajax({
        url:CRIMES_URL,
        type: "GET",
        data: {
            cmplnt_to_dt: "2015-12-31T00:00:00.000"
        }
    })
    .done(function(datasetCrimes){
		districtIDs = Object.keys(datasetCrimes);
		
		var expensesByName = d3.nest()
            .key(function(d) {
                if(d.lat_lon !== undefined){
                    return d.addr_pct_cd;
                }
                return "NoValido";
            })
            .sortValues()
            .entries(datasetCrimes);

        expensesByName.splice("NoValido", 1);

        /*var myLatlng ;
        //console.log('expensesByName',expensesByName);
        for( var districtID of expensesByName){
            for(var j = 0; j < districtID.values.length; j++){     
                myLatlng = new google.maps.LatLng(districtID.values[j].longitude, districtID.values[j].latitude);

                for( var polygono of listaPoligono){

                    if(google.maps.geometry.poly.containsLocation(myLatlng, polygono)){

                    }
                }
            }
        }*/

		var expensesCount = d3.nest()
            .key(function(d) { 
                return d.addr_pct_cd; 
            })
            .rollup(function(v) { 
                return v.length; 
            })
            .entries(datasetCrimes);
        
        //Ordena el json por la cantidad de crimenes de menor a mayor 
        expensesCount.sort(OrdenarPorValorDescendente);
		
        graficaDistritosSeguros(expensesCount);
        tablaDistritosSeguros(expensesCount, expensesByName);
   })
}

/**
 * Funcion que genera una grafica con los 
 * 10 distritos más seguros
 */
function graficaDistritosSeguros(expensesCount){
    d3.select(".topCrimes").selectAll("div")	
		.data(expensesCount)	
        .enter()	
        .append("div")	
        .attr("class",	"bar")	
		.style("height",	function(d)	{
	        return	d.value+5	+	"px";	
	    });
		/*.text(function(d){
          return d.value;
        });*/
}

/**
 * Funcion que genera la tabla con el top 10 
 * de los distritos más seguros
 */
function tablaDistritosSeguros(expensesCount, expensesByName){
    tableReference = $("#mainTableBody")[0];
        
	var newRow, boroughName, descriptionCrime, latLonCrime, dateCrime;
    var maxDistritos = 10;
    var contAux = 0;
    var datosCrimenes = new Array();
    
    for( var districtID of expensesCount){
	    contAux ++;
		newRow = tableReference.insertRow(tableReference.rows.length);
		boroughName = newRow.insertCell(0);
		descriptionCrime = newRow.insertCell(1);
		latLonCrime = newRow.insertCell(2);
		dateCrime = newRow.insertCell(3);
		
		datosCrimenes = getDatosCrimenes(expensesByName, districtID.key);
		boroughName.innerHTML = datosCrimenes[0]; 
		descriptionCrime.innerHTML = datosCrimenes[1]; 
		latLonCrime.innerHTML = datosCrimenes[2]; 
		dateCrime.innerHTML = datosCrimenes[3]; 
		
		maxDistritos --;
		if(maxDistritos === 0){
			break;
		}
	}
}
/**
 * Ordena el json por el valor de menor a mayor
 */
function OrdenarPorValorDescendente(x,y) {
	return ((x.value == y.value) ? 0 : ((x.value > y.value) ? 1 : -1 ));
}


/**
 * Función que retorna la descripción de los crimenes
 */
function getDatosCrimenes(dataJson, key ){
  var datosCrimenes = ["","","",""];
  var descripcion = '';
  for(var i = 0; i < dataJson.length; i++){
    if(dataJson[i].key == key){
        datosCrimenes[0] = dataJson[i].values[0].boro_nm;
        for(var j = 0; j < dataJson[i].values.length; j++){
			datosCrimenes[1] = datosCrimenes[1] +  dataJson[i].values[j].pd_desc;
			
			if(dataJson[i].values[j].latitude !== undefined && dataJson[i].values[j].longitude !== undefined){
				datosCrimenes[2] = datosCrimenes[2] + '['+ dataJson[i].values[j].longitude +', '+ dataJson[i].values[j].latitude +']';
			}
			datosCrimenes[3] = datosCrimenes[3] + dataJson[i].values[j].cmplnt_fr_dt;
		}
	}
  }
  return datosCrimenes;
}

/**
 * Parametro 2 de la aplicación
 * Función  que retorna la distacia entre la universidad y los distritos 
 * que por lo menos tienen un vecindario
 */
function getDistancia(){
    
}

/**
 * Parametro 3 de la aplicación
 * Función que retorna los 10 distritos más asequible
 * basandose en la cantidad máxima de bajos ingresos 
 * definida por la ciudad de New York
 */
function getAsequibilidad(){
    
}

/**
 * Función  
 */
function getColor(borought){
    var distrito = borought.toString().substring(0,1);
    var color;
    
    if(parseInt(borought.toString().substring(1,3)) > 20){
        return "green";
    }
    switch(distrito) {
        case "1":
            color = "blue";
            break;
        case "3":
            color = "yellow";
            break;
        case "4":
            color = "orange";
            break;
        case "2":
            color = "red";
            break;
        case "5":
            color = "purple";
            break;
        default:
            color = "";
    }
    return color;
}

function getNameDistrito(borought){
    var distrito = borought.toString().substring(0,1);
    var nameDistrito;
    
    switch(distrito) {
        case "1":
            nameDistrito = "Manhattan";
            break;
        case "3":
            nameDistrito = "Brooklyn";
            break;
        case "4":
            nameDistrito = "Queens";
            break;
        case "2":
            nameDistrito = "Bronx";
            break;
        case "5":
            nameDistrito = "Staten Island";
            break;
        default:
            nameDistrito = "";
    }
    return nameDistrito;
    
}



function downloadCSV(csv) {
    var csvFile;
    var downloadLink;

    // archivo CSV 
    csvFile = new Blob([csv], {type: "text/csv"});
    // Descargar el archivo
    downloadLink = document.createElement("a");
    // Nombre del archivo
    downloadLink.download = NOMBRE_ARCHIVO_CSV;
    // Crear el link del archivo
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Se oculta el link del archivo
    downloadLink.style.display = "none";
    // Agregar el link en el DOM
    document.body.appendChild(downloadLink);
    // Se simula el click en el link
    downloadLink.click();
}

