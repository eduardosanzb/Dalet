(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Entries', EntriesService)


   /** @ngInject */ 
   function EntriesService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/entries/:id', {
          id: '@_id'
        },
        	{getEntries: {method: 'GET', isArray: true, url: ServerUrl + '/api/entries/:param1/:param2', params: {param1: '',param2: ''} }}
        ); 
    }
})();