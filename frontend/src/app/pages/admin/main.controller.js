(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('MainController', MainController);

      /** @ngInject */ 
      function MainController(Tabs, localStorageService){
        var vm = this;
        vm.admin = localStorageService.get('currentUser').role === 'admin' ? false
                        : localStorageService.get('currentUser').role === 'superadmin' ?false : true


        Tabs
          .loadAllItems()
          .then(function(tabs){
            vm.tabs = [].concat(tabs)
          })
      }
})()