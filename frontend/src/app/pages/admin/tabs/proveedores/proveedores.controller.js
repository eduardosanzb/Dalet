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
          Provider.query().$promise.then(function(providers){
        
            vm.providers = providers;
          })  
        }

        function addProvider(){
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
          $uibModal.open({
            animation: true,
            templateUrl: 'app/pages/admin/tabs/proveedores/addProviderModal.html',
            size: 'md',
            controller: EditModalController,
            resolve:{
               data: function () {
                return provider;
              },
              items: function () {
                return vm.providers;
              }
            }
          })
        }


        /** @ngInject */ 
        function ModalController(Provider, $scope, $uibModalInstance, $rootScope, items){
          $scope.provider ={}
          $scope.submitted = false
          $scope.provider.active = true;
          $scope.title = "Agregar proveedor";
          $scope.register = function(form){
            $scope.submitted = true;
            if(form.$valid){
              var exists = false;
              for(var i=0; i < items.length; i++ ){
                  if(items[i].name === form.name.$modelValue){
                    $scope.error = "El proveedor ya existe";
                    exists = true;
                  }
              }
               if(!exists){
                   Provider.save($scope.provider, function(provider, putResponseHeaders) {
                    $uibModalInstance.dismiss();
                    $rootScope.$broadcast('Provider Added');
                  });
              }
            }
            
          }
        }

         /** @ngInject */ 
        function EditModalController(Provider, $scope, $uibModalInstance, $rootScope, data, items){
          var storedName = data.name;
          $scope.submitted = false
          $scope.provider = angular.copy(data);
          $scope.title = "Editar proveedor";
          $scope.register = function(form){
            $scope.submitted = true;
            $scope.error = false;
            if(form.$valid){
              var exists = false;
              for(var i=0; i < items.length; i++ ){
                  if(items[i].name === $scope.provider.name && $scope.provider.name !== storedName){
                    $scope.error = "El proveedor ya existe";
                    exists = true;
                  }
              }
               if(!exists){
                   Provider.save($scope.provider, function(provider, putResponseHeaders) {
                    $uibModalInstance.dismiss();
                    $rootScope.$broadcast('Provider Added');
                  });
              }
            }
          }
        }

      }

})();