(function(){
  'use strict';

  angular.module('Dalet', [ 'ngCookies', 'ngResource','LocalStorageModule'])
  .constant('ServerUrl', 'http://localhost:5000')
  //.constant('ServerUrl', '')
  .config(function($httpProvider, $locationProvider){
    $httpProvider.interceptors.push('authInterceptor')
  })
  .factory('authInterceptor', authInterceptor)
  .factory('Auth', AuthService)
  .factory('User', UserService)
  .factory('Util',UtilService)

  /** @ngInject */ 
  
  function authInterceptor($q, $cookies, $injector, Util){
      var state;
      return {
        // Add authorization token to headers
        request: function(config) {
          config.headers = config.headers || {};
          //console.log(config);
          if($cookies.get('token') ) {
            //console.log('setting the header');
            config.headers.Authorization = 'Bearer' +  $cookies.get('token');
          }
          return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function(response) {
          if(response.status === 401) {
            (state || (state = $injector.get('$state')))
            .go('login');
            // remove any stale tokens
            $cookies.remove('token');
          }
          return $q.reject(response);
        }
      };
  }
  /** @ngInject */ 
  function AuthService($location, $http, $cookies, $q, Util, User, ServerUrl){
    var safeCb = Util.safeCb;
    var currentUser = {
        _id: '',
        name:  '',
        email:'',
        role:  '',
        $promise : undefined
    }
    var userRoles =  ['guest', 'user', 'admin', 'superadmin'];

    // var hasRole = function(userRole, role) {
    //   return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
    // };

    // if($cookies.get('token') && $location.path() !== '/logout') {
    //   currentUser = User.get();
    // }

    var Auth = {
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - function(error, user)
       * @return {Promise}
       */
      login : function(credentials, callback) {
        return $http.post(ServerUrl + '/auth/local', credentials)
          .then(function(res){
            $cookies.put('token', res.data.token);
            currentUser = User.get();
            return currentUser.$promise;
          })
          .then(function(user) {
            safeCb(callback)(null, user);
            return user;
          })
          .catch(function(err) {
            console.log(err);
            Auth.logout();
            safeCb(callback)(err.data);
            return $q.reject(err.data);
          });
      },

      /**
       * Delete access token and user info
       */
      logout :function() {
        $cookies.remove('token');
        currentUser = {
                _id: '',
                name:  '',
                email:'',
                role:  '',
                $promise : undefined
            }
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - function(error, user)
       * @return {Promise}
       */
      createUser :function (user,  callback) {
        return User.save(user, function(data) {
          //$cookies.put('token', data.token);
          currentUser = User.get();
          return safeCb(callback)(null, user);
        }, function(err) {
          //Auth.logout();
          return safeCb(callback)(err);
        })
          .$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - function(error, user)
       * @return {Promise}
       */
      // changePassword : function(oldPassword, newPassword, Function) {
      //   return User.changePassword({
      //     id: currentUser._id
      //   }, {
      //     oldPassword,
      //     newPassword
      //   }, function() {
      //     return safeCb(callback)(null);
      //   }, function(err) {
      //     return safeCb(callback)(err);
      //   })
      //     .$promise;
      // },

      /**
       * Gets all available info on a user
       *
       * @param  {Function} [callback] - function(user)
       * @return {Promise}
       */
      getCurrentUser : function (callback) {
        var value = User.get(currentUser, '$promise') ? currentUser.$promise : currentUser;

        return $q.when(value)
          .then(function(user){
            console.log(user)
            safeCb(callback)(user);
            return user;
          }, function(){
            safeCb(callback)({});
            return {};
          });
      },

      /**
       * Gets all available info on a user
       *
       * @return {Object}
       */
      getCurrentUserSync : function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @param  {Function} [callback] - function(is)
       * @return {Promise}
       */
      isLoggedIn : function(callback) {
        return Auth.getCurrentUser(undefined)
          .then(function(user) {
            console.log(user);
            var is = User.get(user, 'role');

            safeCb(callback)(is);
            return is;
          }).catch(function(error){
            console.log(error);
          });
      },

      /**
       * Check if a user is logged in
       *
       * @return {Bool}
       */
      isLoggedInSync : function() {
        return !!User.get(currentUser, 'role');
      },

      /**
       * Check if a user has a specified role or higher
       *
       * @param  {String}     role     - the role to check against
       * @param  {Function} [callback] - function(has)
       * @return {Promise}
       */
      hasRole : function(role,  Function) {
        return Auth.getCurrentUser(undefined)
          .then(function(user) {
            var has = hasRole(_.get(user, 'role'), role);

            safeCb(callback)(has);
            return has;
          });
      },

      /**
       * Check if a user has a specified role or higher
       *
       * @param  {String} role - the role to check against
       * @return {Bool}
       */
      hasRoleSync : function(role) {
        return hasRole(User.get(currentUser, 'role'), role);
      },

      /**
       * Check if a user is an admin
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      // isAdmin : function() {
      //   return Auth.hasRole(...[].concat.apply(['admin'], arguments));
      // },

      /**
       * Check if a user is an admin
       *
       * @return {Bool}
       */
      isAdminSync : function() {
        return Auth.hasRoleSync('admin');
      },

      /**
       * Get auth token
       *
       * @return {String} - a token string used for authenticating
       */
      getToken : function() {
        return $cookies.get('token');
      }
    };

    return Auth;
  }
  /** @ngInject */ 
 function UserService($resource, ServerUrl){

    return $resource(ServerUrl + '/api/users/:id/:controller', {
        id: '@_id'
      }, {
        changePassword: {
          method: 'PUT',
          params: {
            controller: 'password'
          }
        },
        get: {
          method: 'GET',
          params: {
            id: 'me'
          }
        }
      }); 
  }
  /** @ngInject */ 
  function UtilService($window){
     var Util = {
        /**
         * Return a callback or noop function
         *
         * @param  {Function|*} cb - a 'potential' function
         * @return {Function}
         */
        safeCb : function(cb) {
          return angular.isFunction(cb) ? cb : angular.noop;
        },

        /**
         * Parse a given url with the use of an anchor element
         *
         * @param  {String} url - the url to parse
         * @return {Object}     - the parsed url, anchor element
         */
        urlParse : function(url) {
          var a = document.createElement('a');
          a.href = url;

          // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
          if(a.host === '') {
            a.href = a.href;
          }

          return a;
        },

        /**
         * Test whether or not a given url is same origin
         *
         * @param  {String}           url       - url to test
         * @param  {String|String[]}  [origins] - additional origins to test against
         * @return {Boolean}                    - true if url is same origin
         */
        isSameOrigin : function(url, origins) {
          url = Util.urlParse(url);
          origins = origins && [].concat(origins) || [];
          origins = origins.map(Util.urlParse);
          origins.push($window.location);
          origins = origins.filter(function(o) {
            var hostnameCheck = url.hostname === o.hostname;
            var protocolCheck = url.protocol === o.protocol;
            // 2nd part of the special treatment for IE fix (see above):
            // This part is when using well-known ports 80 or 443 with IE,
            // when $window.location.port==='' instead of the real port number.
            // Probably the same cause as this IE bug: https://goo.gl/J9hRta
            var portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port ===
              '443');
            return hostnameCheck && protocolCheck && portCheck;
          });
          return origins.length >= 1;
        }
      };

      return Util;
  }

})();