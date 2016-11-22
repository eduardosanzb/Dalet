(function(){
    'use strict';
    angular.module('BlurAdmin.pages.providers')
      .controller('MainController', MainController);

      /** @ngInject */ 
      function MainController(Provider, localStorageService){
        var vm = this;
        getProviders()

        vm.getStats = getStats
        

        function getStats(provider){
          Provider.stats({id:provider._id})
            .$promise
            .then(function(result){
              vm.stats = result
            })
            .catch(function(err){
              console.log(err);
            })
          
          
          
        }
        function getProviders(){
          Provider.query().$promise.then(function(providers){
            vm.providers = providers;
            vm.data = {
              availableOptions: providers,
              selectedOption: providers[0]
            };
          })  
        }

      }
})();