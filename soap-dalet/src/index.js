'use strict';
import generateReport from './soapClient.js'
import booksFiller from './Filler.books'
import journalsFiller from './Filler.journals'
import Provider from './models/provider.model.js'
import Statistics from './models/statsProvider.model.js'
import mongoose from 'mongoose';
import fs from 'fs'
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/dalet-dev')

// var count = 1
// Provider.find({
//     "name": "EBSCO"
// }, function(err, ebsco) {
//     if (err) return console.log(err);
//     fs.readFile('./reports/PR1.2016-01-01To2016-10-31.json', 'utf8', (err, data) => {
//         if (err) throw err;
//         ebsco = ebsco[0]
//         var result = JSON.parse(data).Report
//         var stat = createAStats(result, ebsco)

//         ebsco.stats.push(stat)
//         ebsco.save(saveCallback)
//         if (stat.type === 'BR1' || stat.type === 'BR2' || stat.type === 'BR3') {
//             booksFiller(stat)
//                 .then(x => {
//                     console.log(x)
//                     count--
//                     closingConnection(count)
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     count--
//                     closingConnection(count)
//                 })
//         } else if (stat.type === 'JR1' || stat.type === 'JR5') {
//             journalsFiller(stat)
//                 .then(x => {
//                     console.log(x)
//                     count--
//                     closingConnection(count)
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     count--
//                     closingConnection(count)
//                 })
//         } else {
//             count--
//             closingConnection(count)
//         }
//     });
// })

retrieveReports()

function retrieveReports() {
    Provider.find({}, function(err, providers) {
        if (err) throw err;
        let reports = ['JR1', 'JR5', 'DB1', 'DB2', 'PR1', 'BR1', 'BR2', 'BR3']
        var count = providers.filter(x => x.active).length * 8

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
                                console.log(err)
                                count--
                                closingConnection(count)

                            } else {
                                var stat = createAStats(result, x)
                                x.stats.push(stat)
                                x.save(saveCallback)
                                if (stat.type === 'BR1' || stat.type === 'BR2' || stat.type === 'BR3') {
                                    booksFiller(stat)
                                        .then(x => {
                                            console.log(x)
                                            count--
                                            closingConnection(count)
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            count--
                                            closingConnection(count)
                                        })
                                } else if (stat.type === 'JR1' || stat.type === 'JR5') {
                                    journalsFiller(stat)
                                        .then(x => {
                                            console.log(x)
                                            count--
                                            closingConnection(count)
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            count--
                                            closingConnection(count)
                                        })
                                } else {
                                    count--
                                    closingConnection(count)
                                }
                            }
                        })
                    }) // y

            }) // x
    });
}

function createAStats(result, provider) {
    var provider_id = provider._id || null
    console.log(provider);
    var stat = new Statistics({
        _provider: provider_id,
        type: result.Report.attributes.Name,
        dateOfCreation: result.Report.attributes.Created,
        content: result.Report.Customer.ReportItems
    })
    stat.save()
    return stat;
}

function closingConnection(count) {
    if (count === 0) {
        console.log("Bye");
        console.log("all the providers were fetched");
        console.log("_________Closing Mongo connection_________");
        mongoose.connection.close();
    }
}

function handleError(err) {
    if (err) return console.log(err);
}

function saveCallback(err) {
    if (err) return console.log(err);
    console.log('You have saved successfully the provider ');
}