import Provider from './provider.model.js'
import Statistics from './statsProvider.model.js'
import mongoose from 'mongoose';

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/dalet-dev')

function GetStatsOfProviders(callback){
  //console.log("Getting the stats");
  Provider
  .find({})
  .populate({ path: 'stats' })
  .exec()
  .then(callback)
  // .then((results) =>{
  //   //var filteredArray = results.filter(x => x.stats.length)
  //   callback(filteredArray)
  //   closeConnection()
  // })
  .catch(handleError)
}
function handleError(err){

  if(err) return console.log(err);
}
function closeConnection(){
  console.log('----------------------');
  console.log("Bye");
  console.log("all the providers were cleaned");
  mongoose.connection.close();
}

function getTypeOfReport(type, callback){
  GetStatsOfProviders(providers => {
    if(!providers) return console.log('Null Providers')
    var report = providers
      .filter(x => x.stats)
      .reduce((acum, provider, inx) => {
        var object = {
          _provider: provider._id,
          _providerName: provider.name,
          type: type,
          reports: provider.stats.filter(x => x.type === type)
        }
        acum.push(object)
        return acum
      },[])
      callback(report)
  })  
}
function clearReport(type){
  getTypeOfReport(type, providerReports =>{
    providerReports.forEach(provider => {
      provider.reports = provider.reports.map(report =>{
        return report.content[0].ItemPerformance
      })
    })
  })  
}


GetStatsOfProviders(x=>{console.log(x)})


