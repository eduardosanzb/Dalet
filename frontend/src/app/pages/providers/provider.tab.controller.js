(function(){
    'use strict';
    angular.module('BlurAdmin.pages.providers')
      .controller('ProvidersTabController', ProvidersTabController);

      /** @ngInject */ 
      function ProvidersTabController(Provider, localStorageService, $q, baConfig, baUtil){
        var vm = this;
        var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
        vm.thisMonth = new Date().getMonth()
        getProviders()

        vm.getStats = getStats
        
        
        function getStats(provider){
          var args = {id : provider._id}
          var promises = {
            platforms: Provider.platforms(args).$promise,
            db: Provider.databases(args).$promise,
            books: Provider.books(args).$promise,
            jr: Provider.journals(args).$promise
          }
          vm.promise = $q.all(promises)
            .then(function(data){
              vm.statsOfProviders = data
              getCharts(data.platforms)
            })
        }
        function getProviders(){
          Provider.query().$promise.then(function(providers){
            vm.providers = providers;
            vm.data = {
              availableOptions: providers,
              selectedOption: providers[0]
            };
            getStats(providers[0])
          })  
        }

        function getCharts(report){
          /* Sorry for this mess, but the xml response is a fucking mess.
            Maybe I could use something more cool like recursive, but is too late
          */
          var lastReport = getLastReport(report.stats)
          vm.platformSearches = []
          vm.platformRequests = []
          
          if(!lastReport.content) return console.error('We dont have any reports');
          lastReport.content[0].ItemPerformance.map(function(item){
            item.month = item.Period.Begin.substring(5,7)
            if (item.Category === "Searches"){
              vm.platformSearches.push(cleanPlatformReport(item))
            } else {
              vm.platformRequests.push(cleanPlatformReport(item))
            }
          })
          
          vm.charts = [].concat([{
                color: pieColor,
                description: 'Busquedas específicas',
                stats: vm.platformSearches[vm.platformSearches.length-1]
                      .search_reg,
                icon: 'person',
            },
            {
                color: pieColor,
                description: 'Solicitudes',
                stats: vm.platformRequests[vm.platformSearches.length-1].record_view,
                icon: 'face',
            },
            {
                color: pieColor,
                description: 'Busquedas generales',
                stats: vm.platformSearches[vm.platformSearches.length-1]
                        .search_fed,
                icon: 'person',
            },
            {
                color: pieColor,
                description: 'Clicks resultados',
                stats:vm.platformRequests[vm.platformSearches.length-1].result_click,
                icon: 'face',
            }])

        }

        function cleanPlatformReport(item){
          if(Array.isArray(item.Instance)){
                item.Instance.forEach(function(x){
                  item[x.MetricType] = x.Count
                })
              } else {
                  item[item.Instance.MetricType] = item.Instance.Count
                }
          return item
        }

        function getLastReport(array){
          var result = {}
          array.forEach(function(item){
            var reportMonth = new Date(item.dateOfCreation).getMonth()
            result = (reportMonth === vm.thisMonth || reportMonth === vm.thisMonth-1) ? item : result
          })
          return result
        }
      }//controller
})();