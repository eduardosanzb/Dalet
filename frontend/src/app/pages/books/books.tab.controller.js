(function(){
    'use strict';
    angular.module('BlurAdmin.pages.books')
      .controller('BooksTabController', BooksTabController);

      /** @ngInject */ 
      function BooksTabController(Books, Journals, localStorageService, $q, baConfig, baUtil){
        var vm = this;
        var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
        getData()
        
        function getData(){
          var promises = {
            books: Books.query().$promise,
            journals: Journals.query().$promise
          }
          vm.promise = $q.all(promises)
            .then(function(data){
              vm.books = {
                availableOptions: data.books,
                selectedOption: data.books[0]
              }
              vm.journals =  {
                availableOptions: data.journals,
                selectedOption: data.journals[0]
              }
              vm.actualBook = vm.books.selectedOption
              vm.actualJournal = vm.journals.selectedOption
            })
        }

       
      }//controller
})();