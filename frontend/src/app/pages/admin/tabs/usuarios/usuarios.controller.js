(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('UsuariosController', UsuariosController);

      /** @ngInject */ 
      function UsuariosController($scope, User, $uibModal){
        var vm = this;
        getUsers()
        $scope.$on('User Added', function(pevent, padata){
          getUsers()
        })
        //Binding functions to scope
        vm.addUser = addUser
        vm.removeUser = removeUser
        function getUsers(){
          User.query().$promise.then(function(users){
            //console.log(users);
            vm.users = users
          })  
        }
        function addUser(){
          console.log('Adding a new user');
          $uibModal.open({
            animation: true,
            templateUrl: 'app/pages/admin/tabs/usuarios/addUserModal.html',
            size: 'md',
            controller: ModalController,
            resolve:{
               items: function () {
                return vm.users;
              }
            }
          })
        }
        /** @ngInject */ 
        function ModalController(User, Auth, $scope, $uibModalInstance, $rootScope){
          //console.log($scope.$parent);
          $scope.user ={}
          $scope.submitted = false
          $scope.roles = [
            {label:'Usuario normal', value:'user'},
            {label:'Administrador', value:'admin'},
            {label:'Super Administrador', value:'superadmin', icon:'fa fa-key'}
          ]
          $scope.register = function(form){
            //console.log(form);
            $scope.submitted = true
            if(form.$valid){
              Auth.createUser($scope.user)
                .then(function(response){
                  $rootScope.$broadcast('User Added')
                  //console.log(response);
                  $uibModalInstance.dismiss()
                  })
                .catch(function(error){
                  $scope.error = 'Error, posiblemente el correo ya existe.'
                  //console.log(error);
                })
              //console.log($scope.user);
            }
          }
        }
        function removeUser(index){
          console.log('Deleting the user: ' + vm.users[index].name);
          vm.users[index].$remove()
          vm.users.splice(index,1)
        }

      }
})()