(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Area', AreasService)


   /** @ngInject */ 
   function AreasService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/careers/:id', {
          id: '@_id'
        }); 
    }
})();