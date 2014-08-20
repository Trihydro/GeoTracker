/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        navigator.splashscreen.hide();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var geoData = new Array;

function getInfo_Click() {
    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    var latitude, longitude, accuracy;
            
    // Cordova is ready
    //
    function onDeviceReady() {
    }
    
    setGeolocation();
    
    function setGeolocation() {
        sendGeoData();
        geoData = [];
        var geolocation = window.navigator.geolocation.watchPosition(
            function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                accuracy = position.coords.accuracy;
                var element = document.getElementById('geolocation');
                if (accuracy < 200)//Measured in meteres
                {
                    element.innerHTML += 'lat: ' + latitude + ', '
                                         + 'lng: ' + longitude + ', '
                                         + 'accuracy: ' + accuracy + '<br />';
            
                    geoData.push({ lat: latitude, longitude: longitude, acc: accuracy});
                    //geoData.push("testLat");
                }
            },
            function () {
            /*error*/ }, {
                maximumAge: 250, 
                enableHighAccuracy: true
            } 
            );
            
        window.setTimeout(function () {
            window.navigator.geolocation.clearWatch(geolocation) 
        }, 
                          10000 //stop checking after 10 seconds
            //120000
            );
        
    };
            
    
            
    window.setInterval(function () {
        setGeolocation();
    }, 
                       60000
    					
        //120000//10000 //check every 10 seconds -> would really be around 15-30 minutes
        //120000// - >  2 minutes
        );
    
}
function sendInfo_Click() {
    $.ajax({
               type: "GET",
               url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/getGeoData",//"http://localhost/JsonMobilePhoto/PhotoService.svc/getGeoData",
               headers: {'Authentication':token},
               data: {data: JSON.stringify(geoData)},
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: function (data) {
                   //alert(data);
               },
           });   
}

function sendGeoData() {
    $.ajax({
               type: "GET",
               url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/getGeoData",//"http://localhost/JsonMobilePhoto/PhotoService.svc/getGeoData","http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/getGeoData",
               headers: {'Authentication':token},
               data: {data: JSON.stringify(geoData)},
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: function (data) {
                   //alert(data);
               },
           }); 
}