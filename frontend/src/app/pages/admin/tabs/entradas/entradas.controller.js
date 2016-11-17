(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('EntradasController', EntradasController);

      /** @ngInject */ 
      function EntradasController(baConfig, $scope, Entries, $uibModal){
        var vm = this;
        var dashboardColors = baConfig.colors.dashboard;
        var $element;

        loadCalendar();

        function loadCalendar(){
          Entries.query().$promise.then(function(entries){
                vm.entriesObjects = JSON.parse(angular.toJson(entries));

                $element = $('#calendar').fullCalendar({
                  //height: 335,
                  locale: 'es',
                  header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                  },
                  defaultDate: new Date(),
                  selectable: true,
                  selectHelper: true,
                  dayClick: function(date, allDay, jsEvent, view) {
                        $uibModal.open({
                          animation: true,
                          templateUrl: 'app/pages/admin/tabs/entradas/editEntriesModal.html',
                          size: 'md',
                          controller: ModalController,
                          resolve:{
                            entriesDate: function(){
                              return date
                            },
                            items: function(){
                              return vm.entriesObjects
                            }
                          }
                        })
                },
                eventClick: function(calEvent, jsEvent, view) {
                  $uibModal.open({
                          animation: true,
                          templateUrl: 'app/pages/admin/tabs/entradas/editEntriesModal.html',
                          size: 'md',
                          controller: ModalController,
                          resolve:{
                            entriesDate: function(){
                              return calEvent.start
                            },
                            items: function(){
                              return vm.entriesObjects
                            }
                          }
                        })
                },
                  // 
                  events: vm.entriesObjects
                });
              })  
        }

        $scope.$on('Entries Added', function(pevent, padata){
          Entries.query().$promise.then(function(entries){
                vm.entriesObjects = entries;
                 $("#calendar").fullCalendar('removeEvents'); 
                $("#calendar").fullCalendar('addEventSource', vm.entriesObjects); 
              })  
        });
      
      }




      /** @ngInject */ 
        function ModalController(Entries, $scope, $uibModalInstance, $rootScope, entriesDate, items, baConfig){
          var dashboardColors = baConfig.colors.dashboard;
          var dateString = entriesDate.format('YYYY-MM-DD');
          $scope.dateTitle = entriesDate.toDate(); 
          $scope.entriesObject = {};
          for(var i = 0; i < items.length; i++ ){
            if(items[i].start === dateString){
                $scope.entriesObject = items[i];
              }
          }
          if(angular.equals($scope.entriesObject, {})){
            $scope.entriesObject.start = dateString;
            $scope.entriesObject.color = dashboardColors.blueStone;
          }

          $scope.saveEntries = function(){
              Entries.save($scope.entriesObject, function(entries, putResponseHeaders) {
                     console.log("se guardo: " + entries);
                    $uibModalInstance.dismiss();
                    $rootScope.$broadcast('Entries Added');
                 });
            
          };
        }      
})();