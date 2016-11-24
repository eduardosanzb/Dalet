(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('MainController', MainController);

      /** @ngInject */ 
      function MainController(Tabs, localStorageService){
        var vm = this;
        console.log('test');
        Tabs
          .loadAllItems()
          .then(function(tabs){
            vm.tabs = [].concat(tabs)
          })
      }
})();