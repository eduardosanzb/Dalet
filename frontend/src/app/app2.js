'use strict';

angular.module('BlurAdminAuth', [
  'ui.router',
  'LocalStorageModule',
  'ngCookies',
  'Dalet'
])
.run(runConfig)
.config(routeConfig)
.controller('LoginController', LoginController);

   /** @ngInject */
  function runConfig($window, $rootScope, $location, Auth, localStorageService){
    console.log("The app is running")
    if (localStorageService.get('currentUser')) {
      console.log("YEs");
    }
  }

   /** @ngInject */
  function routeConfig($urlRouterProvider, $stateProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor')
  }

  /** @ngInject */ 
  function LoginController(Auth, $location, $http, ServerUrl, $cookies, User, localStorageService, $window) {
    console.log("Hello from the login ctrl");
    var vm = this
    vm.submitted = false
    vm.errors = {
      login: undefined
    }
    //BIndig the function boy to the controller
    vm.login = login

    function login(form){
      vm.submitted = true

      if(form.$valid){
        var objectToAut = {
          email: vm.user.email,
          password: vm.user.password
        }
        Auth.login(objectToAut)
          .then(function(response){
            console.log(response)
            localStorageService.set('currentUser', response)
            localStorageService.set('roles', response.role)
            //$rootScope.myRoles = response.roles
            $window.location.assign('index.html')
          })
          .catch(function(error){
            console.log(error)
            vm.errors.login = error.message
          })
      }
    }
    
  }
