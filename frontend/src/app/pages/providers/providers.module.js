/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.providers', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('providers', {
          url: '/providers',
          templateUrl: 'app/pages/providers/providers.html',
          title: 'Proveedores',
          controller: 'ProvidersTabController',
          controllerAs: 'vm',
          authentication: true,
          sidebarMeta: {
            icon: 'ion-briefcase',
            order: 0,
          },
        });
  }


})();
