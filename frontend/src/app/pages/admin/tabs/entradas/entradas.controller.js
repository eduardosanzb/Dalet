(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('EntradasController', EntradasController);

      /** @ngInject */ 
      function EntradasController(Tabs){
        var vm = this;
        Tabs
          .loadAllItems()
          .then(function(tabs){
            vm.tabs = [].concat(tabs)
          })
      }
})()