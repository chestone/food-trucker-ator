var App = function() {
    this.map = '';
    this.mapMarkers = [];
};

App.prototype.init = function() {
    $( document ).ready(function() {
        $('form').submit(function(e) {
            e.preventDefault();
            var address = JSON.stringify($('input[name="address"]').val());
            $.getJSON('https://maps.googleapis.com/maps/api/geocode/json',
                {
                    sensor: false,
                    address: address
                }).done(function(data) {
                    data = data.results[0];
                    this.locateUser(data.geometry.location.lat, data.geometry.location.lng);
            }.bind(this));
        }.bind(this));

        $('.locate-me').on('click', function(e) {
            this.locateUser();
            var error = function (msg) {
                $('#status').html(msg).addClass('fail');
            };
            if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(function(position) {
                    this.locateUser(position.coords.latitude, position.coords.longitude);
                  }.bind(this), error);
            } else {
                  error('not supported');
            }
        }.bind(this));

        this.initMap();

    }.bind(this));
};

App.prototype.locateUser = function(lat, lng) {
    if (!lat || !lng) { return; }
    console.log('lat: ' + lat, 'lng: ' + lng);
    var latlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: latlng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: "You are here! (at least we think so...)",
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });

    this.loadTrucksFromLocation(lat, lng);

    this.mapMarkers.push(marker);

    this.map.setCenter(latlng);
};

App.prototype.initMap= function() {
    // Initial point in SF to load the map with
    var sf = {
        lat: '37.7833',
        lng: '-122.4167'
    };

    var latlng = new google.maps.LatLng(sf.lat, sf.lng);
    var myOptions = {
        zoom: 15,
        center: latlng,
        mapTypeControl: false,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById('mapcanvas'), myOptions);
    // Load trucks from the initial point of origin. Should do this on the server to reduce wait times.
    this.loadTrucksFromLocation(sf.lat, sf.lng);
};

App.prototype.loadTrucksFromLocation = function(latitude, longitude) {
    this.clearMapOverlays();
    $.get('truck/locate/', { lat: latitude, lng: longitude })
        .done(this.addTrucks.bind(this));
};

App.prototype.addTrucks = function(truckArr) {
    var truckList = $('.trucks').html('');
    if (truckArr instanceof Array) {
        truckArr.forEach(function(truck) {
            var latlng = new google.maps.LatLng(truck.loc[1], truck.loc[0]);
            var iconLoc = (truck.FacilityType === 'Truck' ? 'http://maps.google.com/mapfiles/ms/icons/truck.png' : 'http://maps.google.com/mapfiles/ms/icons/shoppingcart.png');
            var marker = new google.maps.Marker({
                position: latlng,
                map: this.map,
                title: truck.Applicant + ' ' + truck.LocationDescription,
                truckid: truck.locationid,
                icon: 'http://maps.google.com/mapfiles/ms/icons/truck.png'
            });

            // Add listener to markers to scroll the truck list on click
            google.maps.event.addListener(marker, 'click', function() {
                $('.selected').removeClass('selected');
                var elem = $('li.' + this.truckid);
                elem.addClass('selected');
                var position = $('.trucks').scrollTop();
                $(".trucks").animate({ scrollTop: $(elem).position().top + position});
            });
            this.mapMarkers.push(marker);
            // Trashy templating, but why add a library for one thing
            truckList.append('<li class=' + truck.locationid + '>' +
                                '<div><h3>Name: </h3><p>' + truck.Applicant + '</p></div>' +
                                '<div><h3>Address: </h3><p>' + truck.LocationDescription + '</p></div>' +
                                '<div><h3>Type: </h3><p>' + truck.FacilityType + '</p></div>' +
                                '<div><h3>Food: </h3><p>' + truck.FoodItems + '</p></div>' +
                              '</li>');

        }.bind(this));
    }

};

// Clear all of the markers so we do not have too many
App.prototype.clearMapOverlays = function() {
    this.mapMarkers.forEach(function(marker) {
        marker.setMap(null);
    });
    this.mapMarkers.length = 0;
};

var a = new App();
a.init();

