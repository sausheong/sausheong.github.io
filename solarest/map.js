var pos, map, measureTool, geocoder;
var singapore = {lat: 1.274318, lng: 103.842987};
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: singapore,
    mapTypeId: 'satellite',
    zoom: 18,
  });
  
  geocoder = new google.maps.Geocoder();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    });
  }

  measureTool = new MeasureTool(map, {
    contextMenu: false,
    showSegmentLength: true,
    tooltip: true,
    unit: MeasureTool.UnitTypeId.METRIC
  });

  measureTool.addListener('measure_end', () => {
    $("#area").val("0");
    $("#solar").val("0");
  });
  measureTool.addListener('measure_change', (e) => {
    if (e.result.area) {
        area = Math.round(e.result.area);
        $("#area").val(area);
        calc();
    }
  }); 

  $("#address").keypress(function (e) {
    if (e.which == 13) {
      gothere();
      return false;
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

function gothere() {
  var address = document.getElementById("address").value;
  geocoder.geocode({"address": address}, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
    } else {
      alert("Cannot go there because: "  + status);
    }
  });
}

function measure() {
    $("#measure").attr("class", "d-none");
    measureTool.start();
}

function clearMeasure() {
    $("#measure").attr("class", "btn btn-outline-primary");
    measureTool.end();
}

function info() {
  $("#info").toggleClass("d-block");
}
function calc() {
  area = Number($("#area").val())
  efficiency = Number($("#efficiency").val())
  insol = Number($("#insol").val())
  performance = Number($("#performance").val())
  solar = (area * efficiency * insol * performance * 365/1000).toFixed(2);
  $("#solar").val(solar);
}