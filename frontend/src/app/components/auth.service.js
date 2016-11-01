(function(){
  'use strict';
  angular.module('Dalet')
    .factory('Auth', AuthService);

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
  })();