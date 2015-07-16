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
//var url = "http://c6401.ambari.apache.org:8080/api/v1/views/HIVE/versions/1.0.0/instances/HiveView/jobs/210/results?first=true&count=10000";
console.log($location.search());
if(Object.keys($location.search()).indexOf("url") >= 0) {
    var url = $location.search().url;
    var random_key;
    if(Object.keys($location.search()).indexOf("random_key") >= 0) {
        random_key = $location.search().random_key;
    } else {
        random_key = Math.floor((Math.random() * 10000) + 1);
    }
    $.getJSON(url).then(function (results) {

              var columns = results.schema;
              var rows = results.rows;

              if (!columns || !rows) {
                return;
              }

              columns = columns.map(function (column) {
                // Replace "dot" in column names with ":" since vega-lite doesn't support "dot" in names
                return {
                  name: column[0].replace(".", "_"),
                  type: column[1],
                  index: column[2] - 1 //normalize index to 0 based
                };
              });
              results = {columns: columns, rows: rows.slice(0, 10)};

              rows.forEach(function(row) {
                var rowObject = {};
                for(var i=0;i<row.length;i++) {
                  rowObject[columns[i].name] = row[i];
                }
                formattedValues.push(rowObject);
              });


    var NewDataset = {};

    /*NewDataset.datasets = [{
      name: 'Custom',
      values: [{"x":0, "y":3}, {"x":1, "y":5}],
      id: 'barley',
      group: 'sample'
    }];*/
    NewDataset.datasets = [{
      name: 'Custom',
      values: formattedValues,
      id: 'job_' + random_key,
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
/*
      $scope.chron = Chronicle.record('Spec.spec', $scope, true,
        ['NewDataset.dataset', 'NewDataset.dataschema','NewDataset.stats', 'Config.config']);

      $scope.canUndoRedo = function() {
        $scope.canUndo = $scope.chron.canUndo();
        $scope.canRedo = $scope.chron.canRedo();
      };
      $scope.chron.addOnAdjustFunction($scope.canUndoRedo);
      $scope.chron.addOnUndoFunction($scope.canUndoRedo);
      $scope.chron.addOnRedoFunction($scope.canUndoRedo);

      $scope.chron.addOnUndoFunction(function() {
        Logger.logInteraction(Logger.actions.UNDO);
      });
      $scope.chron.addOnRedoFunction(function() {
        Logger.logInteraction(Logger.actions.REDO);
      });

      angular.element($document).on('keydown', function(e) {
        if (e.keyCode === 'Z'.charCodeAt(0) && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
          $scope.chron.undo();
          $scope.$digest();
          return false;
        } else if (e.keyCode === 'Y'.charCodeAt(0) && (e.ctrlKey || e.metaKey)) {
          $scope.chron.redo();
          $scope.$digest();
          return false;
        } else if (e.keyCode === 'Z'.charCodeAt(0) && (e.ctrlKey || e.metaKey) && e.shiftKey) {
          $scope.chron.redo();
          $scope.$digest();
          return false;
        }
      });
      */
    });
            }, function (err) {
              console.log('error', err.responseText);
            });

} else {
    Alerts.add('An unknown error occurred. Please try again.');
}

  });
