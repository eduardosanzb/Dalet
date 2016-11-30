(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .factory('Tabs', TabsService);

      /** @ngInject */ 
      function TabsService($q){
        var tabs = [
          {
            heading: 'Entradas a biblioteca',
            active: true,
            template: 'app/pages/admin/tabs/entradas/entradas.tab.html',
            controller: 'EntradasController'
          },
          {
            heading: 'Usuarios',
            active: true,
            template: 'app/pages/admin/tabs/usuarios/usuarios.tab.html',
            controller: 'UsuariosController'
          },
          {
            heading: 'Carreras',
            active: true,
            template: 'app/pages/admin/tabs/areas/areas.tab.html',
            controller: 'AreasController'
          },
          {
            heading: 'Proveedores',
            active: true,
            template: 'app/pages/admin/tabs/proveedores/proveedores.tab.html',
            controller: 'ProveedoresController'
          },
          {
            heading: 'Facebook',
            active: true,
            template: 'app/pages/admin/tabs/facebook/facebook.tab.html',
            controller: 'FacebookController'
          }
        ]
        return {
          loadAllItems : function(){
            return $q.when(tabs)
          }
        }
      }
})();