(function(){
    'use strict';
    angular.module('BlurAdmin.pages.books')
      .controller('BooksTabController', BooksTabController);

      /** @ngInject */ 
      function BooksTabController(Books, Journals, localStorageService, $q, baConfig, baUtil, layoutPaths){
        var vm = this;
        var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
        var layoutColors = baConfig.colors;
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
              vm.createFirstChartBook()
              vm.createSecondChartBook()
              vm.createFirstChartJournal()
              vm.createSecondChartJournal()
            })
        }
        /*CREATING THE requestsPerMonthChart*/
        function labelFunction(item, label) {
            if (item.index === item.graph.chart.dataProvider.length - 1)
              return label;
            else
              return "";
          }
        vm.createFirstChartBook = function (){
          console.log('test');
          console.log(vm.books.selectedOption.stats);
          var chartRequests = AmCharts.makeChart("requestsPerMonthChartBook",{
            type: 'serial',
            theme: 'blur',
            color: layoutColors.dashboard,
            marginTop: 10,
            marginRight: 15,
            dataProvider: vm.books.selectedOption.stats,
            valueAxes: [{
              axisAlpha: 1,
              gridAlpha: 0
            }],
            legend: {
              horizontalGap: 5,
              maxColumns: 1,
              position: "right",
              useGraphSettings: true,
              markerSize: 5,
              listeners: [{
                event: "rollOverItem",
                method: function(event) {
                  setOpacity(event.chart.graphs[event.dataItem.index], 1);
                }
              }, {
                event: "rollOutItem",
                method: function(event) {
                  setOpacity(event.chart.graphs[event.dataItem.index], 0.5);
                }
              }]
            },
            graphs: [
              {
                lineThickness: 2,
                labelText: "Totales",
                labelFunction: labelFunction,
                labelPosition: "right",
                title: "Busquedas Totales",
                type: "smoothedLine",
                color: layoutColors.defaultText,
                valueField: "ft_total"
              },
              {
                lineThickness: 1,
                labelText: "PDF",
                labelFunction: labelFunction,
                labelPosition: "left",
                title: "Busquedas en Pdf",
                type: "smoothedLine",
                color: layoutColors.defaultText,
                valueField: "ft_pdf"
              },
              {
                lineThickness: 1,
                labelText: "HTML",
                labelFunction: labelFunction,
                labelPosition: "left",
                title: "Busquedas en Html",
                type: "smoothedLine",
                color: layoutColors.defaultText,
                valueField: "ft_html"
              }
            ],
            chartCursor: {
                valueLineEnabled: true,
                valueLineBalloonEnabled: true
            },
            dataDateFormat: "YYYY-MM-DD",
            categoryField: "month",
            categoryAxis: {
                gridPosition: "start",
                gridAlpha: 0
              }
          })

          chartRequests.addListener('rendered', zoomChart);
            if (chartRequests.zoomChart) {
              chartRequests.zoomChart();
            }

          function zoomChart() {
              chartRequests.zoomToIndexes(Math.round(chartRequests.dataProvider.length * 0.4), Math.round(chartRequests.dataProvider.length * 0.55));
            }
        }
        vm.createSecondChartBook = function(){
          var pieChart = AmCharts.makeChart('typeOfSearchesChartBook', {
            type: 'pie',
            startDuration: 0,
            theme: 'blur',
            addClassNames: true,
            color: layoutColors.defaultText,
            labelTickColor: layoutColors.borderDark,
            legend: {
              position: 'right',
              marginRight: 100,
              autoMargins: false,
            },
            innerRadius: '40%',
            defs: {
              filter: [
                {
                  id: 'shadow',
                  width: '200%',
                  height: '200%',
                  feOffset: {
                    result: 'offOut',
                    in: 'SourceAlpha',
                    dx: 0,
                    dy: 0
                  },
                  feGaussianBlur: {
                    result: 'blurOut',
                    in: 'offOut',
                    stdDeviation: 5
                  },
                  feBlend: {
                    in: 'SourceGraphic',
                    in2: 'blurOut',
                    mode: 'normal'
                  }
                }
              ]
            },
            dataProvider: createDataForPie(vm.books.selectedOption.stats),
            valueField: 'value',
            titleField: 'type',
            export: {
              enabled: true
            },
            creditsPosition: 'bottom-left',
            autoMargins: false,
            marginTop: 10,
            alpha: 0.8,
            marginBottom: 0,
            marginLeft: 10,
            marginRight: 10,
            pullOutRadius: 0,
            pathToImages: layoutPaths.images.amChart,
            responsive: {
              enabled: true,
              rules: [
                // at 900px wide, we hide legend
                {
                  maxWidth: 900,
                  overrides: {
                    legend: {
                      enabled: false
                    }
                  }
                },

                // at 200 px we hide value axis labels altogether
                {
                  maxWidth: 200,
                  overrides: {
                    valueAxes: {
                      labelsEnabled: false
                    },
                    marginTop: 30,
                    marginBottom: 30,
                    marginLeft: 30,
                    marginRight: 30
                  }
                }
              ]
            }
          });

          pieChart.addListener('init', handleInit);

          pieChart.addListener('rollOverSlice', function (e) {
            handleRollOver(e);
          });

          function handleInit() {
            pieChart.legend.addListener('rollOverItem', handleRollOver);
          }

          function handleRollOver(e) {
            var wedge = e.dataItem.wedge.node;
            wedge.parentNode.appendChild(wedge);
          }
        }
        vm.createFirstChartJournal = function (){
          var chartRequests = AmCharts.makeChart("requestsPerMonthChartJournal",{
            type: 'serial',
            theme: 'blur',
            color: layoutColors.dashboard,
            marginTop: 10,
            marginRight: 15,
            dataProvider: vm.journals.selectedOption.stats,
            valueAxes: [{
              axisAlpha: 1,
              gridAlpha: 0
            }],
            legend: {
              horizontalGap: 5,
              maxColumns: 1,
              position: "right",
              useGraphSettings: true,
              markerSize: 5,
              listeners: [{
                event: "rollOverItem",
                method: function(event) {
                  setOpacity(event.chart.graphs[event.dataItem.index], 1);
                }
              }, {
                event: "rollOutItem",
                method: function(event) {
                  setOpacity(event.chart.graphs[event.dataItem.index], 0.5);
                }
              }]
            },
            graphs: [
              {
                lineThickness: 2,
                labelText: "Totales",
                labelFunction: labelFunction,
                labelPosition: "right",
                title: "Busquedas Totales",
                type: "smoothedLine",
                color: layoutColors.defaultText,
                valueField: "ft_total"
              },
              {
                lineThickness: 1,
                labelText: "PDF",
                labelFunction: labelFunction,
                labelPosition: "left",
                title: "Busquedas en Pdf",
                type: "smoothedLine",
                color: layoutColors.defaultText,
                valueField: "ft_pdf"
              },
              {
                lineThickness: 1,
                labelText: "HTML",
                labelFunction: labelFunction,
                labelPosition: "left",
                title: "Busquedas en Html",
                type: "smoothedLine",
                color: layoutColors.defaultText,
                valueField: "ft_html"
              }
            ],
            chartCursor: {
                valueLineEnabled: true,
                valueLineBalloonEnabled: true
            },
            dataDateFormat: "YYYY-MM-DD",
            categoryField: "month",
            categoryAxis: {
                gridPosition: "start",
                gridAlpha: 0
              }
          })

          chartRequests.addListener('rendered', zoomChart);
            if (chartRequests.zoomChart) {
              chartRequests.zoomChart();
            }

          function zoomChart() {
              chartRequests.zoomToIndexes(Math.round(chartRequests.dataProvider.length * 0.4), Math.round(chartRequests.dataProvider.length * 0.55));
            }
        }
        vm.createSecondChartJournal = function(){
          var pieChart = AmCharts.makeChart('typeOfSearchesChartJournal', {
            type: 'pie',
            startDuration: 0,
            theme: 'blur',
            addClassNames: true,
            color: layoutColors.defaultText,
            labelTickColor: layoutColors.borderDark,
            legend: {
              position: 'right',
              marginRight: 100,
              autoMargins: false,
            },
            innerRadius: '40%',
            defs: {
              filter: [
                {
                  id: 'shadow',
                  width: '200%',
                  height: '200%',
                  feOffset: {
                    result: 'offOut',
                    in: 'SourceAlpha',
                    dx: 0,
                    dy: 0
                  },
                  feGaussianBlur: {
                    result: 'blurOut',
                    in: 'offOut',
                    stdDeviation: 5
                  },
                  feBlend: {
                    in: 'SourceGraphic',
                    in2: 'blurOut',
                    mode: 'normal'
                  }
                }
              ]
            },
            dataProvider: createDataForPie(vm.journals.selectedOption.stats),
            valueField: 'value',
            titleField: 'type',
            export: {
              enabled: true
            },
            creditsPosition: 'bottom-left',
            autoMargins: false,
            marginTop: 10,
            alpha: 0.8,
            marginBottom: 0,
            marginLeft: 10,
            marginRight: 10,
            pullOutRadius: 0,
            pathToImages: layoutPaths.images.amChart,
            responsive: {
              enabled: true,
              rules: [
                // at 900px wide, we hide legend
                {
                  maxWidth: 900,
                  overrides: {
                    legend: {
                      enabled: false
                    }
                  }
                },

                // at 200 px we hide value axis labels altogether
                {
                  maxWidth: 200,
                  overrides: {
                    valueAxes: {
                      labelsEnabled: false
                    },
                    marginTop: 30,
                    marginBottom: 30,
                    marginLeft: 30,
                    marginRight: 30
                  }
                }
              ]
            }
          });

          pieChart.addListener('init', handleInit);

          pieChart.addListener('rollOverSlice', function (e) {
            handleRollOver(e);
          });

          function handleInit() {
            pieChart.legend.addListener('rollOverItem', handleRollOver);
          }

          function handleRollOver(e) {
            var wedge = e.dataItem.wedge.node;
            wedge.parentNode.appendChild(wedge);
          }
        }

      function createDataForPie(stats){
        var result = [{type:'ft_pdf', value:0},{type:'ft_html', value:0}]
        stats.map(function(stat){
          result[0].value += parseInt(stat.ft_pdf)
          result[1].value += parseInt(stat.ft_html)
        })
        console.log(result);
        return result
      }
      }//controller
})();