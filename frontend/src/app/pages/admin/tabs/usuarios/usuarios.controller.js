(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('UsuariosController', UsuariosController);

      /** @ngInject */ 
      function UsuariosController($scope, User, $uibModal, localStorageService){
        var vm = this;
        vm.currentUser = localStorageService.get('currentUser')
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
        function removeUser(index){
          console.log('Deleting the user: ' + vm.users[index].name);
          vm.users[index].$remove()
          vm.users.splice(index,1)
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
              },
              currentUser: function(){
                return vm.currentUser
              }
            }
          })
        }

        /** @ngInject */ 
        function ModalController(User, Auth, $scope, $uibModalInstance, $rootScope, currentUser){
          console.log(currentUser);
          $scope.user ={}
          $scope.submitted = false

          $scope.roles = [
            {label:'Usuario normal', value:'user'},
            {label:'Administrador', value:'admin'},
            {label:'Super Administrador', value:'superadmin', icon:'fa fa-key'}
          ]
          if(currentUser.role === 'admin')
            $scope.roles.splice(-1,1)
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
                  $scope.error = error
                  //console.log(error);
                })
              //console.log($scope.user);
            }
          }
        }
        

      }
})();