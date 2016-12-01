/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardCtrl', DashboardCtrl);

  /** @ngInject */
  function DashboardCtrl($scope, baConfig, $element, layoutPaths, Entries) {
    var vm = this;

    ////////////////////////////////////////////////////////datepicker
     vm.today = function() {
    vm.dt = new Date();
  };
  vm.today();

  vm.clear = function() {
    vm.dt = null;
  };

  vm.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  vm.dateOptions = {
    minDate: new Date(),
    minMode: 'month'
  };


  vm.toggleMin = function() {
    vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
    vm.dateOptions.minDate = vm.inlineOptions.minDate;
  };

  vm.toggleMin();

  vm.open1 = function() {
    vm.popup1.opened = true;
  };



  vm.setDate = function(year, month, day) {
    vm.dt = new Date(year, month);
  };

  vm.format = 'MMMM-yyyy';


  vm.popup1 = {
    opened: false
  };





  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < vm.events.length; i++) {
        var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return vm.events[i].status;
        }
      }
    }

    return '';
  }

  /////////////////////////////////////////////    grafica entradas
  vm.monthChange = monthChange;
  getEntries(vm.dt);

  function getEntries(entriesDate){
      var date = entriesDate;
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      Entries.getEntries({ 
        param1: formatDate(firstDay),
        param2: formatDate(lastDay)
      }, function(res) {
        vm.entriesArray = res;
        // console.log(JSON.stringify(res));
        var keep = ['title', 'start'];
        for(var i = 0;i < vm.entriesArray.length; i++){
            for(var key in vm.entriesArray[i]){
                if(keep.indexOf(key) === -1)delete vm.entriesArray[i][key];
            }
        }
        prepareEntries();
        loadEntriesChart();
        //console.log(JSON.stringify(vm.entriesArray));
      });
  }
  function monthChange(){
    getEntries(vm.dt);
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function prepareEntries(){
  //console.log("se ejecuta");
  for(var i = 0; i < vm.entriesArray.length; i++){
    vm.entriesArray[i].date = vm.entriesArray[i].start;
    vm.entriesArray[i].visits = vm.entriesArray[i].title;
    delete vm.entriesArray[i].start;
    delete vm.entriesArray[i].title;
  }
  vm.entriesArray.sort(function custom_sort(a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}


var entriesChart;
  function loadEntriesChart(){
    entriesChart = AmCharts.makeChart("entriesChart", {
    "theme": "light",
    "type": "serial",
    "marginRight": 80,
    "autoMarginOffset": 20,
    "marginTop":20,
    "dataProvider": vm.entriesArray,
    "valueAxes": [{
        "id": "v1",
        "axisAlpha": 0.1
    }],
    "graphs": [{
        "useNegativeColorIfDown": true,
        "balloonText": "[[category]]<br><b>value: [[value]]</b>",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletBorderColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "lineColor": "#fdd400",
        "negativeLineColor": "#67b7dc",
        "valueField": "visits"
    }],
    "chartScrollbar": {
        "scrollbarHeight": 5,
        "backgroundAlpha": 0.1,
        "backgroundColor": "#868686",
        "selectedBackgroundColor": "#67b7dc",
        "selectedBackgroundAlpha": 1
    },
    "chartCursor": {
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true
    },
    "dataDateFormat": "YYYY-MM-DD",
    "categoryField": "date",
    "categoryAxis": {
        "parseDates": true,
        "axisAlpha": 0,
        "minHorizontalGap": 60
    },
    "export": {
        "enabled": true
    }
});

entriesChart.addListener("dataUpdated", zoomChart);
//zoomChart();

    }


function zoomChart() {
    if (entriesChart.zoomToIndexes) {
        entriesChart.zoomToIndexes(130, vm.entriesArray.length - 1);
    }
}




  ///////////////////////////////////////////////////////////////facebook
   

  
  }
})();