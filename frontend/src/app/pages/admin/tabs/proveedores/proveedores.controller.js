(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('ProveedoresController', ProveedoresController);

      /** @ngInject */ 
      function ProveedoresController(Tabs){
        var vm = this;
        Tabs
          .loadAllItems()
          .then(function(tabs){
            vm.tabs = [].concat(tabs)
          })
      }
})()