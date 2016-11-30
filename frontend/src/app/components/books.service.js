(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Books', BookssService)


   /** @ngInject */ 
   function BookssService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/books/:id', {
          id: '@_id'
        }); 
    }
})();