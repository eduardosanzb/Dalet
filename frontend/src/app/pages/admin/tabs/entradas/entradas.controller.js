(function(){
    'use strict';
    angular.module('BlurAdmin.pages.admin')
      .controller('EntradasController', EntradasController);

      /** @ngInject */ 
      function EntradasController(baConfig){
        var vm = this;
        var dashboardColors = baConfig.colors.dashboard;
        var $element = $('#calendar').fullCalendar({
          height: 335,
          lang: 'es',
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          defaultDate: new Date(),
          selectable: false,
          selectHelper: false,
          select: function (start, end) {
            var title = prompt('Event Title:');
            var eventData;
            if (title) {
              eventData = {
                title: title,
                start: start,
                end: end
              };
              $element.fullCalendar('renderEvent', eventData, true); // stick? = true
            }
            $element.fullCalendar('unselect');
          },
          editable: true,
          eventLimit: true, // allow "more" link when too many events
          events: [
            //TODO: put the number of daily users
            {
              title: '# usuarios: 123',
              start: '2016-09-30',
              color: dashboardColors.blueStone
            },
            {
              title: '# usuarios: 123',
              start: '2016-10-01',
              color: dashboardColors.blueStone
            }
          ]
        });
      }
})();