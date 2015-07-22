'use strict';

angular.module('polestar')
  .controller('MainCtrl', function($scope, $document, $location, Spec, Dataset, Config, consts, Logger, Alerts) {
    $scope.Spec = Spec;
    $scope.Dataset = Dataset;
    $scope.Config = Config;
    $scope.Logger = Logger;

    $scope.consts = consts;
    $scope.showDevPanel = false;

    // undo/redo support

    $scope.canUndo = false;
    $scope.canRedo = false;

    var formattedValues = [];
    console.log($location.search());
    if(Object.keys($location.search()).indexOf("url") >= 0) {
        var url = $location.search().url;
        var job_id;

        var count = 30000; // Default fetch count
        if(Object.keys($location.search()).indexOf("count") >= 0) {
            count = $location.search().count;
        }
        if(Object.keys($location.search()).indexOf("job_id") >= 0) {
            job_id = $location.search().job_id;
        } else {
            job_id = Math.floor((Math.random() * 10000) + 1);
        }

        url += '&count=' + count + '&first=true&format=d3';
        //url = "http://uwdata.github.io/polestar/data/birdstrikes.json";
        var NewDataset = {};
        NewDataset.datasets = [{
          name: 'Custom',
          url: url,
          id: 'job_' + job_id,
          group: 'data'
        }];
        NewDataset.dataset = NewDataset.datasets[0];
        NewDataset.currentNewDataset = undefined;  // dataset before update
        NewDataset.dataschema = [];
        NewDataset.dataschema.byName = {};
        NewDataset.stats = {};
        NewDataset.type = undefined;

        // TODO move these to constant to a universal vlui constant file
        NewDataset.typeNames = {
          N: 'text',
          O: 'text-ordinal',
          Q: 'number',
          T: 'time',
          G: 'geo'
        };

        NewDataset.fieldOrder = vl.field.order.typeThenName;

        // initialize undo after we have a dataset
        Dataset.update(NewDataset.dataset).then(function() {
          Config.updateDataset(NewDataset.dataset);
        });
    } else {
        Alerts.add('An unknown error occurred. Please try again.');
    }

  });
