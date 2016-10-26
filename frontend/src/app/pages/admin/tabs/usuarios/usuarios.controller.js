(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('UsuariosController', UsuariosController);

      /** @ngInject */ 
      function UsuariosController(){
        var vm = this;
        console.log('test');
        vm.test = true
      }
})()