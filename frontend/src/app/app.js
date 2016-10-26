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

  'BlurAdmin.theme',
  'BlurAdmin.pages',
  
  'Dalet'
])
.run(runConfig)
.config(routeConfig);

   /** @ngInject */
  function runConfig($window, $rootScope, $location, Auth, localStorageService){
    console.log("The app is running")
    //console.log($window)
    //console.log(Auth.isLoggedIn().$$state.$promise);
    // Auth.isLoggedIn().$promise.then(function(user){
    //   console.log(user);
    // }).catch(function(error){
    //   console.error(error);
    // })
    if(!localStorageService.get('currentUser')){
      console.log('redirecting to auth');
      $window.location.assign('auth.html')
      //$location.url('auth.html');
    }
    //$location.url('auth.html')
    //$window.location.href="/auth.html"
    // $rootScope.$on('$stateChangeStart', function(event, next) {
    //   Auth.isLoggedIn(function(loggedIn) {
    //     if(next.authenticate && !loggedIn) {
    //       $window.location.href="/auth.html"
    //     }
    //   });
    // });
  }

   /** @ngInject */
  function routeConfig($urlRouterProvider, $stateProvider, $httpProvider) {
    //$urlRouterProvider.otherwise('/login');
    $httpProvider.interceptors.push('authInterceptor')
  }

  
