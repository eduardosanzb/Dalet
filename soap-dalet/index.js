'use strict';
import generateReport from './soapClient.js'
import Provider from './provider.model.js'
import Statistics from './statsProvider.model.js'
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/dalet-dev')


Provider.find({}, function(err, providers) {
  if (err) throw err;
  let reports = ['JR1', 'JR5', 'DB1', 'DB2', 'PR1', 'BR1', 'BR2', 'BR3']
  let count = providers.filter(x => x.active).length * 8

  providers.filter(x => x.active).map( (x, indx, array) => {
    reports.map(y => {
      console.log(`Gettign report: ${y} from provider: ${x.name}`);
      var args = {
        provider: x,
        reportNumber:y,
        startDate: '2016-01-01', 
        endDate: '2016-10-31'
      }
      generateReport(args, (err, result) => {
        if(err) {          
          if(err) console.log(err);
          count--;
          if (count === 0){ closingConnection() }
        } else {
          var stat = new Statistics({
            _provider: x._id,
            type: result.Report.attributes.Name,
            dateOfCreation: result.Report.attributes.Created,
            content:result.Report.Customer.ReportItems
          })
          stat.save()
          x.stats.push(stat)
          x.save(saveCallback) 

          count--;
          if (count === 0){ closingConnection() }
        }
      })
    }) // y

  }) // x
});



function closingConnection(){
  console.log("Bye");
  console.log("all the providers were fetched");
  mongoose.connection.close();
}  

function saveCallback(err){
  if(err) return console.log(err);
  console.log('You have saved successfully the provider ');
}