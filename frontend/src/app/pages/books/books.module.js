/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.books', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('books', {
          url: '/books',
          templateUrl: 'app/pages/books/books.html',
          title: 'Libros y Artículos',
          controller: 'BooksTabController',
          controllerAs: 'vm',
          authentication: true,
          sidebarMeta: {
            icon: 'ion-ios-bookmarks',
            order: 0,
          },
        });
  }


})();
