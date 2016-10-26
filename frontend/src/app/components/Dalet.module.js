(function(){
  'use strict';

  angular.module('Dalet', [ 'ngCookies', 'ngResource','LocalStorageModule'])
  .constant('ServerUrl', 'http://localhost:5000')
  .config(function($httpProvider, $locationProvider){
    $httpProvider.interceptors.push('authInterceptor')
    //console.log($httpProvider);
  })
})()