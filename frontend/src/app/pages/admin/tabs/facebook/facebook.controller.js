(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('FacebookController', FacebookController);

      /** @ngInject */ 
      function FacebookController($scope,$window,$facebook,$http){
        var vm = this;  
        
      //     $window.fbAsyncInit = function() {
		    //       FB.init({ 
		    //         appId: '1854336038136692',
		    //         status: true, 
		    //         cookie: true, 
		    //         xfbml: true,
		    //         version: 'v2.8'
		    //       });

		    // var access_token;
		    // FB.getLoginStatus(function(response1) {
		    //     if (response1.status !== 'connected') {
		    //     FB.login(function(response) {
		    //            if (response.authResponse) {
		    //              access_token =   FB.getAuthResponse()['accessToken'];
		    //              console.log('Access Token = '+ access_token);
		    //              console.log('Good to see you, ' + response.name + '.');
		    //            } else {
		    //              console.log('User cancelled login or did not fully authorize.');
		    //            }
		    //   }, {scope: 'manage_pages'});
		    //   }else{
		    //     access_token = response1.authResponse.accessToken;
		    //     console.log(access_token);
		    //   }
		    // });

		    // };
		    vm.isLoggedIn = false;
		    vm.login = login;

			  function login() {
			      $facebook.login().then(function(response) {
			      	if(response !== null){
				      vm.auth_token = response.authResponse.accessToken;
				      vm.user_id = response.authResponse.userID;
				      vm.expires_in = new Date();
					  vm.expires_in.setSeconds(vm.expires_in.getSeconds() + response.authResponse.expiresIn);
					  console.log(vm.auth_token);
					  $facebook.api(vm.user_id).then(function(response){
					  	vm.name = response.name;
					  	//  $facebook.api("oauth/access_token?grant_type=fb_exchange_token&client_id=1854336038136692&client_secret=d67875162e89b686fe6ecbac6ef08ff0&fb_exchange_token=" + vm.auth_token).then(function(response){
						  // 	console.log(response);
						  // });
					  	 $http({
					  	 	url: "https://graph.facebook.com/v2.8/oauth/access_token?grant_type=fb_exchange_token&client_id=1854336038136692&client_secret=d67875162e89b686fe6ecbac6ef08ff0&fb_exchange_token=" + vm.auth_token,
					  	 	 method: "GET",
					  	 	 headers: {}
					  	}).then(function(response){
					  	 	console.log(response);
					  	 });
						  
						  	console.log("oauth/access_token?grant_type=fb_exchange_token&client_id=1854336038136692&client_secret=d67875162e89b686fe6ecbac6ef08ff0&fb_exchange_token=" + vm.auth_token);
					  });
					}
				  });
			  }
			 

		}
})();