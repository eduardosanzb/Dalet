(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Provider', ProvidersService)


   /** @ngInject */ 
   function ProvidersService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/providers/:id', {
          id: '@_id'
        },
        {
          'stats':{
            method: 'GET',
            url: ServerUrl + '/api/providers/:id/stats',
            params: {
                id: '@id'
              },
            isArray: true
          }
        }); 
    }
})();