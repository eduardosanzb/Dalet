(function(){
    'use strict';
    angular.module('BlurAdmin.pages.careers')
      .controller('CareersTabController', CareersTabController);

      /** @ngInject */ 
      function CareersTabController($scope,Area,baConfig,layoutPaths,$element){
        var vm = this;
        var layoutColors = baConfig.colors;
     	vm.careers = [];
     	vm.selectedCareer = {};
     	vm.getBooks = getBooks;
     	 vm.booksData = [];
     	 var chart;
     	getCareers();
     	

     	function getCareers(){
          vm.careerPromise = Area.query().$promise.then(function(books){
            vm.careers = _.groupBy(books, function(d){return d.NOMBRE_CARRERA});
            vm.selectedCareer = _.keys(vm.careers)[0]
            getBooks();
          })  
        }

        function getBooks(){

        	vm.booksData = [];
        	for(var i = 0; i < vm.careers[vm.selectedCareer].length; i++){
        		var temp = new Object();
        		temp["book"] = vm.careers[vm.selectedCareer][i].TITULO;
        		temp["author"] = vm.careers[vm.selectedCareer][i].AUTOR;
        		temp["visits"] = 0;
        		vm.booksData.push(temp);
        	}
        	
        }

 



      }//controller
})();