(function(){
  'use strict';

  angular.module('BlurAdmin', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.sortable',
    'ui.router',
    'ngTouch',
    'toastr',
    'smart-table',
    "xeditable",
    'ui.slimscroll',
    'ngJsTree',
    'angular-progress-button-styles',
    'LocalStorageModule',
    'ngCookies',
    'ngFileUpload',
    'frapontillo.bootstrap-switch',
    'ngFacebook',
    'BlurAdmin.theme',
    'BlurAdmin.pages',
    
    'Dalet'
  ])
  .run(runConfig)
  .config(routeConfig)
  .config(facebookConfig)
  .factory('authInterceptor', authInterceptor);

     /** @ngInject */
    function runConfig($window, $rootScope, $location, Auth, localStorageService, $cookies){
      console.log("The app is running")
      //console.log($window)
      //console.log(Auth.isLoggedIn().$$state.$promise);
      // Auth.isLoggedIn().$promise.then(function(user){
      //   console.log(user);
      // }).catch(function(error){
      //   console.error(error);
      // })
      

        


      if(!$cookies.get('token')){
        console.log('redirecting to auth');
        $window.location.assign('auth.html')
        //$location.url('auth.html');
      }
      //$location.url('auth.html')
      //$window.location.href="/auth.html"
      $rootScope.$on('$stateChangeStart', function(event, next) {
        if(!$cookies.get('token')){
          console.log('redirecting to auth');
          $window.location.assign('auth.html')
          //$location.url('auth.html');
        }
        Auth.isLoggedIn(function(loggedIn) {
          if(next.authenticate && !loggedIn) {
            $window.location.href="/auth.html"
          }
        });
      });
    }

     /** @ngInject */
    function routeConfig($urlRouterProvider, $stateProvider, $httpProvider) {
      //$urlRouterProvider.otherwise('/login');
      
      $httpProvider.interceptors.push('authInterceptor')
    }

    function facebookConfig($facebookProvider) {
      $facebookProvider.setAppId('1854336038136692');
      $facebookProvider.setPermissions("manage_pages");
    }

    /** @ngInject */ 
    function authInterceptor( $q, $cookies, $injector, Util, $window){
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
            $window.location.href="/auth.html"
            $cookies.remove('token');
          }
          return $q.reject(response);
        }
      };
    }

})();
