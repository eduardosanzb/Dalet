(function () {
  'use strict';

  angular.module('BlurAdmin.pages.careers', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('careers', {
          url: '/careers',
          templateUrl: 'app/pages/careers/careers.html',
          title: 'Carreras',
          controller: 'CareersTabController',
          controllerAs: 'vm',
          authentication: true,
          sidebarMeta: {
            icon: 'ion-university',
            order: 0,
          },
        });
  }


  
  

})();