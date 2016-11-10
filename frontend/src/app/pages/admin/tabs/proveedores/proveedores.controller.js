(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('ProveedoresController', ProveedoresController);

      /** @ngInject */ 
      function ProveedoresController($scope, Provider, $uibModal){
        var vm = this;

        getProviders();
        $scope.$on('Provider Added', function(pevent, padata){
          getProviders()
        })


         //Binding functions to scope
        vm.addProvider = addProvider;
        vm.editProvider = editProvider;

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

        function editProvider(provider){
          console.log('Editing provider');
          $uibModal.open({
            animation: true,
            templateUrl: 'app/pages/admin/tabs/proveedores/addProviderModal.html',
            size: 'md',
            controller: EditModalController,
            resolve:{
               editProvider: function () {
                return provider;
              }
            }
          })
        }


        /** @ngInject */ 
        function ModalController(Providers, $scope, $uibModalInstance, $rootScope){
          $scope.provider ={}
          $scope.submitted = false
          $scope.provider.active = true;
          $scope.title = "Agregar proveedor";
          $scope.register = function(form){
            $scope.submitted = true;
            if(form.$valid){
              Providers.save($scope.provider, function(provider, putResponseHeaders) {
                console.log("se guardo: " + provider);
                $uibModalInstance.dismiss();
                $rootScope.$broadcast('Provider Added');
              });
            }
          }
        }

         /** @ngInject */ 
        function EditModalController(Providers, $scope, $uibModalInstance, $rootScope, editProvider){
          $scope.submitted = false
          $scope.provider = editProvider;
          $scope.title = "Editar proveedor";
          $scope.register = function(form){
            $scope.submitted = true;
            if(form.$valid){
              Providers.save($scope.provider, function(provider, putResponseHeaders) {
                console.log("se guardo: " + provider);
                $uibModalInstance.dismiss();
                $rootScope.$broadcast('Provider Added');
              });
            }
          }
        }

      }

})();