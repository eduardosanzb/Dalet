(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('AreasController', AreasController);

      /** @ngInject */ 
      function AreasController($scope,ServerUrl,Upload,Area){
        var vm = this;

        vm.uploadFile = uploadFile;
    	 vm.books = {};

       getBooks();
       
       function uploadFile(file) {
  	        file.upload = Upload.upload({
  		      url: ServerUrl + '/api/careers/',
  		      data: {file: file}
  		    }).then(function(res){
  		    	console.log(res.data);
            vm.books = res.data;
  		    });
			   }

      function getBooks(){
          Area.query().$promise.then(function(books){
            vm.books = books;
          })  
        }
        
      }
})();