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
          'platforms':{
            method: 'GET',
            url: ServerUrl + '/api/providers/:id/stats/platforms',
            params: {
                id: '@id'
              },
            isArray: false
          },
          'databases':{
            method: 'GET',
            url: ServerUrl + '/api/providers/:id/stats/databases',
            params: {
                id: '@id'
              },
            isArray: false
          },
          'books':{
            method: 'GET',
            url: ServerUrl + '/api/providers/:id/stats/books',
            params: {
                id: '@id'
              },
            isArray: false
          },
          'journals':{
            method: 'GET',
            url: ServerUrl + '/api/providers/:id/stats/journals',
            params: {
                id: '@id'
              },
            isArray: false
          }

        }); 
    }
})();