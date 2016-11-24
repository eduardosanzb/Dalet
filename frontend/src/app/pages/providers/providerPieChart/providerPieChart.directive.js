/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.providers')
      .directive('providerPieChart', providerPieChart);

  /** @ngInject */
  function providerPieChart() {
    return {
      restrict: 'E',
      controller: 'ProviderPieChartCtrl',
      templateUrl: 'app/pages/providers/providerPieChart/ProviderPieChart.html',
      scope:{
        charts: '='
      }
    };
  }
})();