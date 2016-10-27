// (function(){
//   'use strict';
//    angular.module('Dalet')
//     .factory('User', UserService)


//    /** @ngInject */ 
//    function UserService($resource, ServerUrl){

//       return $resource(ServerUrl + '/api/users/:id/:controller', {
//           id: '@_id'
//         }, {
//           changePassword: {
//             method: 'PUT',
//             params: {
//               controller: 'password'
//             }
//           },
//           get: {
//             method: 'GET',
//             params: {
//               id: 'me'
//             }
//           }
//         }); 
//     }
// })()