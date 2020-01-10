var pos, map, measureTool;
var singapore = {lat: 1.3521, lng: 103.8198};
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: singapore,
    mapTypeId: 'satellite',
    zoom: 18,
  });
  infoWindow = new google.maps.InfoWindow;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }  

  measureTool = new MeasureTool(map, {
    contextMenu: false,
    showSegmentLength: true,
    tooltip: true,
    unit: MeasureTool.UnitTypeId.METRIC // metric, imperial, or nautical
  });

  measureTool.addListener('measure_start', () => {
  });
  measureTool.addListener('measure_end', (e) => {
    $("#area").val("0");
    $("#solar").val("0");
  });
  measureTool.addListener('measure_change', (e) => {
    console.log('changed', e.result);
    if (e.result.area) {
        area = Math.round(e.result.area);
        $("#area").val(area);
        calc();
    }
  }); 

  $( "#area" ).change(function() {
    calc();
  });

  $( "#efficiency" ).change(function() {
    calc();
  });

  $( "#insol" ).change(function() {
    calc();
  });

  $( "#performance" ).change(function() {
    calc();
  });
}

function measure() {
    $("#measure").attr("class", "d-none");
    measureTool.start();
}

function clear_measure() {
    $("#measure").attr("class", "d-block");
    measureTool.end();
}

function help() {
  $("#help").toggleClass("d-block");
}
function calc() {
  area = Number($("#area").val())
  efficiency = Number($("#efficiency").val())
  insol = Number($("#insol").val())
  performance = Number($("#performance").val())
  solar = Math.round(area * efficiency * insol * performance);
  $("#solar").val(solar);
}