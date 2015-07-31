'use strict';

angular.module('polestar')
  .controller('MainCtrl', function($scope, $document, $location, Spec, jQuery, Dataset, Config, consts, Logger, Alerts) {
    $scope.Spec = Spec;
    $scope.Dataset = Dataset;
    $scope.Config = Config;
    $scope.Logger = Logger;

    $scope.consts = consts;
    $scope.showDevPanel = false;

    // undo/redo support

    $scope.canUndo = false;
    $scope.canRedo = false;

    // Flag to show loading spinner
    $scope.loading = false;

    // Flag to show loading spinner when the chart is rendered
    $scope.rendering = false;

    console.log($location.search());
    if(Object.keys($location.search()).indexOf('url') >= 0) {
        var url = $location.search().url;
        var job_id;

        var count = 30000; // Default fetch count
        if(Object.keys($location.search()).indexOf('count') >= 0) {
            count = $location.search().count;
        }
        if(Object.keys($location.search()).indexOf('job_id') >= 0) {
            job_id = $location.search().job_id;
        } else {
            job_id = Math.floor((Math.random() * 10000) + 1);
        }
        url = url.trim();
        // Remove trailing '?' in url
        if (url.substring(url.length-1) == '?') {
            url = url.substring(0, url.length-1);
        }
        url += '?&count=' + count + '&first=true&format=d3';
        //url = "http://uwdata.github.io/polestar/data/birdstrikes.json";

        $scope.loading = true;
        // Test if the url is valid
        jQuery.getJSON(url).then(function (results) {
            // Check if there is any error code in the response
            if('status' in results && 'message' in results) {
                var errorMessage = results.message;
                // Shorten the error message
                var maxLength = 500; // maximum number of characters
                errorMessage = shortenText(errorMessage, maxLength);
                Alerts.add('Error: ' + errorMessage);
            } else {

                var newDataset = {
                    url: url,
                    id: job_id
                };

                Dataset.update(newDataset).then(function() {
                  Config.updateDataset(newDataset);
                  $scope.loading = false;
                });
            }
        }, function (err) {
            $scope.loading = false;
            Alerts.add('Error: ' + shortenText(err.responseText, 500));
        });
    } else {
        Alerts.add('An unknown error occurred. Please try again.');
    }

    // Shorten the given text to the given number of characters
    function shortenText(text, maxLength) {
        if(text.length > maxLength) {
            text = text.substr(0, maxLength);
            // Re-trim if we are in the middle of a word
            text = text.substr(0, Math.min(text.length, text.lastIndexOf(' ')));
            text += '...';
        }
        return text;
    }
  });
