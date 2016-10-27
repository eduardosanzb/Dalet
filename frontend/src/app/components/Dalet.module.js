// (function(){
//   'use strict';

//   angular.module('Dalet', [ 'ngCookies', 'ngResource','LocalStorageModule'])
//   .constant('ServerUrl', 'http://localhost:5000')
//   //.constant('ServerUrl', '')
//   .config(function($httpProvider, $locationProvider){
//     $httpProvider.interceptors.push('authInterceptor')
//   })
//   .factory('authInterceptor', authInterceptor);

//   /** @ngInject */ 
//   function authInterceptor($q, $cookies, $injector, Util){
//       var state;
//       return {
//         // Add authorization token to headers
//         request: function(config) {
//           config.headers = config.headers || {};
//           //console.log(config);
//           if($cookies.get('token') ) {
//             //console.log('setting the header');
//             config.headers.Authorization = 'Bearer' +  $cookies.get('token');
//           }
//           return config;
//         },

//         // Intercept 401s and redirect you to login
//         responseError: function(response) {
//           if(response.status === 401) {
//             (state || (state = $injector.get('$state')))
//             .go('login');
//             // remove any stale tokens
//             $cookies.remove('token');
//           }
//           return $q.reject(response);
//         }
//       };
//   }

// })();