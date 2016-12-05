(function(){
  'use strict';
   angular.module('Dalet')
    .factory('Books', BookssService)


   /** @ngInject */ 
   function BookssService($resource, ServerUrl){

      return $resource(ServerUrl + '/api/books/:id', {
          id: '@_id'
        },
         {contentSearchStatistics: {method: 'GET', isArray: true, url: ServerUrl + '/api/books/:contentSearchMonth/:contentSearchYear', params: {contentSearchMonth: '', contentSearchYear: ''} }}
        ); 
    }
})();