/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.admin', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('admin', {
          url: '/admin',
          templateUrl: 'app/pages/admin/admin.html',
          title: 'Administración',
          controller: 'MainController',
          controllerAs: 'vm',
          authentication: true,
          sidebarMeta: {
            icon: 'ion-android-home',
            order: 0,
          },
        });
  }

})();
