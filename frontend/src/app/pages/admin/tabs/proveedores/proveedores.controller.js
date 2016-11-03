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
            //console.log(users);
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

        /** @ngInject */ 
        function ModalController(Providers, $scope, $uibModalInstance, $rootScope){
          //console.log($scope.$parent);
          $scope.user ={}
          $scope.submitted = false
          $scope.roles = [
            {label:'Usuario normal', value:'user'},
            {label:'Administrador', value:'admin'},
            {label:'Super Administrador', value:'superadmin', icon:'fa fa-key'}
          ]
          $scope.register = function(form){
            $scope.provider.active = true;
            Providers.save($scope.provider, function(provider, putResponseHeaders) {
              console.log("se guardo: " + provider);
              $uibModalInstance.dismiss();
              $rootScope.$broadcast('Provider Added');
            });
          }
        }

        $scope.groups = [
        {id: "true", text: 'Activo'},
        {id: "false", text: 'Inactivo'}
      ];

      $scope.showGroup = function(provider) {
        if(provider.active && $scope.groups.length) {
          var selected = $filter('filter')($scope.groups, {id: provider.active});
          return selected.length ? selected[0].text : 'Not set';
        } else return 'Not set'
      };

      }

})()