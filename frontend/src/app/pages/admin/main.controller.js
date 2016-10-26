(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('MainController', MainController);

      /** @ngInject */ 
      function MainController(Tabs){
        var vm = this;
        Tabs
          .loadAllItems()
          .then(function(tabs){
            vm.tabs = [].concat(tabs)
          })
      }
})()