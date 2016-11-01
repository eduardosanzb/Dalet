(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Providers', ProvidersService)


   /** @ngInject */ 
   function ProvidersService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/providers/:id', {
          id: '@_id'
        }); 
    }
})()