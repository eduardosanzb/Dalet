(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('ProveedoresController', ProveedoresController);

      /** @ngInject */ 
      function ProveedoresController($scope,Providers,$uibModal){
        var vm = this;

        getProviders();
        $scope.$on('Provider Added', function(pevent, padata){
          getProviders()
        })


         //Binding functions to scope
        vm.addProvider = addProvider
        vm.removeProvider = removeProvider
       

        function getProviders(){
          Providers.query().$promise.then(function(providers){
            console.log(providers);
            vm.providers = providers;
          })  
        }

        function addProvider(){
          console.log('Adding a new provider');
          $uibModal.open({
            animation: true,
            templateUrl: 'app/pages/admin/tabs/proveedores/addProviderModal.html',
            size: 'md',
            controller: ModalController,
            resolve:{
               items: function () {
                return vm.providers;
              }
            }
          })
        }

        function removeProvider(){

        }

        

        $scope.$watch('vm.providers', function(value, oldValue) {
          // insert awesome code here
          /*value.$save().then(function(response){
            console.log(response)
          });*/
          if(value)
            value[0].$save();
        
        }, true); 

      
        /** @ngInject */ 
        function ModalController(Providers, $scope, $uibModalInstance, $rootScope){
          //console.log($scope.$parent);
          $scope.user ={}
          $scope.submitted = false
          $scope.register = function(form){
            $scope.submitted = true;
            $scope.provider.active = true;
            Providers.save($scope.provider, function(provider, putResponseHeaders) {
              console.log("se guardo: " + provider);
              $uibModalInstance.dismiss();
              $rootScope.$broadcast('Provider Added');
            });
          }
        }

      }

})();