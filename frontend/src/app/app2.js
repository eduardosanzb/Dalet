(function(){
  'use strict';

  angular.module('BlurAdminAuth', [
    'ui.router',
    'LocalStorageModule',
    'ngCookies',
    'Dalet'
  ])
  .run(runConfig)
  .config(routeConfig)
  .controller('LoginController', LoginController)
  .factory('authInterceptor', authInterceptor);

     /** @ngInject */
    function runConfig($window, $rootScope, $location, Auth, localStorageService, $cookies){
      //console.log("The app is running")
      
      localStorageService.set('currentUser', undefined)
      if (localStorageService.get('currentUser')) {
        //console.log("YEs");
        //Auth.logout()
      }
    }

     /** @ngInject */
    function routeConfig($urlRouterProvider, $stateProvider, $httpProvider) {
      $httpProvider.interceptors.push('authInterceptor')
    }

    /** @ngInject */ 
    function LoginController(Auth, $location, $http, ServerUrl, $cookies, User, localStorageService, $window) {
      //console.log("Hello from the login ctrl");
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
              //console.log(response)
              localStorageService.set('currentUser', response)
              localStorageService.set('roles', response.role)
              //$rootScope.myRoles = response.roles
              $window.location.assign('index.html')
            })
            .catch(function(error){
              //console.log(error)
              vm.errors.login = error.message
            })
        }
      }
    }
    /** @ngInject */ 
    function authInterceptor( $q, $cookies, $injector, Util){
      var state;
      return {
        // Add authorization token to headers
        request : function(config) {
          //console.log($cookies.get('token'))
          config.headers = config.headers || {};
          //console.log(config);
          if($cookies.get('token') ) {
            //console.log("Setting the auth ");
            config.headers.Authorization = 'Bearer ' +  $cookies.get('token');
          }
          return config;
        },

        // Intercept 401s and redirect you to login
        responseError : function(response) {
          if(response.status === 401) {
            // (state || (state = $injector.get('$state')))
            // .go('login');
            // remove any stale tokens
            $cookies.remove('token');
          }
          return $q.reject(response);
        }
      };
    }
})();