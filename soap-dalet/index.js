'use strict';
import generateReport from './soapClient.js'
import booksFiller from './booksFiller'
import Provider from './provider.model.js'
import Statistics from './statsProvider.model.js'
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/dalet-dev')

//retrieveReports()

Provider.find({'active':true})
    .populate({ 
      path: 'stats',
      match: {$or:[{type:"BR1"},{type:"BR2"},{type:"BR3"}]}
    }).exec()
    .then(function(result){
      result.map(provider => {
        if (provider.stats.length > 0)
            provider.stats.map(x => booksFiller(x))
      })
      
    })

function retrieveReports() {
    Provider.find({}, function(err, providers) {
        if (err) throw err;
        let reports = ['JR1', 'JR5', 'DB1', 'DB2', 'PR1', 'BR1', 'BR2', 'BR3']
        let count = providers.filter(x => x.active).length * 8

        //Getting the dates for the report {The first and last day of the PREVIOUS month}
        var date = new Date();
        date.setMonth(date.getMonth() - 1)
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().slice(0, 10);

        providers.filter(x => x.active).map((x, indx, array) => {
                reports.map(y => {
                        console.log(`Gettign report: ${y} from provider: ${x.name}`);
                        var args = {
                            provider: x,
                            reportNumber: y,
                            startDate: firstDay,
                            endDate: lastDay
                        }
                        generateReport(args, (err, result) => {
                            if (err) {
                                if (err) console.log(err);
                                count--;
                                if (count === 0) {
                                    closingConnection()
                                }
                            } else {
                                var stat = createAStats(result)
                                x.stats.push(stat)
                                x.save(saveCallback)
                                if (state.stat === 'BR1' || state.stat === 'BR2' || state.stat === 'BR3') {

                                }

                                count--;
                                if (count === 0) {
                                    closingConnection()
                                }
                            }
                        })
                    }) // y

            }) // x
    });
}

function createAStats(result) {
    var stat = new Statistics({
        _provider: x._id,
        type: result.Report.attributes.Name,
        dateOfCreation: result.Report.attributes.Created,
        content: result.Report.Customer.ReportItems
    })
    stat.save()
    return stat;
}

function closingConnection() {
    console.log("Bye");
    console.log("all the providers were fetched");
    mongoose.connection.close();
}

function saveCallback(err) {
    if (err) return console.log(err);
    console.log('You have saved successfully the provider ');
}