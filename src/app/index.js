'use strict';
/* globals window */

angular.module('polestar', [
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ngDragDrop',
    'monospaced.elastic',
    'zeroclipboard',
    'ui.router',
    'ui.select',
    '720kb.tooltips',
    'ngOrderObjectBy',
    'vlui'])
  .constant('_', window._)
  .constant('vl', window.vl)
  .constant('vg', window.vg)

  .constant('ZSchema', window.ZSchema)
  .constant('Tether', window.Tether)
  .constant('Drop', window.Drop)
  .constant('Blob', window.Blob)
  .constant('URL', window.URL)
  .constant('dl', window.dl)
  .constant('jsondiffpatch', window.jsondiffpatch)
  .config(function(consts) {
    window.vl.extend(consts, {
      appId: 'polestar'
    });
  })
  .config(function(uiZeroclipConfigProvider) {
    // config ZeroClipboard
    uiZeroclipConfigProvider.setZcConf({
      swfPath: 'bower_components/zeroclipboard/dist/ZeroClipboard.swf'
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
    $urlRouterProvider.otherwise('/404');
  });
