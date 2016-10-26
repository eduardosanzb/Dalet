/**
 * @author v.lugovsky
 * created on 15.12.2015
 */
 import toastr from 'angular-toastr'
 import chartjs from 'angular-chart.js'
 import angularChartist from 'angular-chartist.js';
 
 //import blurAdminThemComponents from './common/components/components.module'
(function () {
  'use strict';

  angular.module('BlurAdmin.theme', [
      'toastr',
      'chart.js',
      //'angular-chartist',
      //'angular.morris',
      //'textAngular',
      'BlurAdmin.theme.components'
  ]);

})();
