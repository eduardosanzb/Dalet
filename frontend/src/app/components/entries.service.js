(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Entries', EntriesService)


   /** @ngInject */ 
   function EntriesService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/entrie/:id', {
          id: '@_id'
        }); 
    }
})();