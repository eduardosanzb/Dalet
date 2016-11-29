(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('AreasController', AreasController);

      /** @ngInject */ 
      function AreasController($scope,ServerUrl,Upload,Area){
        var vm = this;

        vm.uploadFile = uploadFile;
    	 vm.careers = [];
       vm.filePromise = {};
       vm.careerPromise = {};

       getCareers();
       
       function uploadFile(file) {
  	        vm.filePromise = Upload.upload({
  		      url: ServerUrl + '/api/careers/',
  		      data: {file: file}
  		    }).then(function(res){
            vm.file = null;
            vm.careers = [];
            var careers = _.groupBy(res.data, function(d){return d.NOMBRE_CARRERA});
            for (var key in careers) {
              var temp = new Object();
              temp["career"] = key;
              vm.careers.push(temp);
            }
  		    });
			   }

      function getCareers(){
          vm.careerPromise = Area.query().$promise.then(function(books){
            var careers = _.groupBy(books, function(d){return d.NOMBRE_CARRERA});
            for (var key in careers) {
              var temp = new Object();
              temp["career"] = key;
              vm.careers.push(temp);
            }
          })  
        }
        
      }
})();