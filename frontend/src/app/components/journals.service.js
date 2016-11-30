(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Journals', JournalssService)


   /** @ngInject */ 
   function JournalssService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/Journals/:id', {
          id: '@_id'
        }); 
    }
})();