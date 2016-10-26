(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('AreasController', AreasController);

      /** @ngInject */ 
      function AreasController(Tabs){
        var vm = this;
        Tabs
          .loadAllItems()
          .then(function(tabs){
            vm.tabs = [].concat(tabs)
          })
      }
})()