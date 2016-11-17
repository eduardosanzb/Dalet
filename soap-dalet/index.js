
import mongoose from 'moongoose'
import soap from 'soap'
import http from 'http'
import xml2js from 'xml2js'
import fs from 'fs'

var parseString = xml2js.parseString

var url = 'http://sushi.ebscohost.com/R4/SushiService.svc?wsdl'
function createArrayToSend(args, startDate, endDate){
  //Date: 2016-01-01
  //Start: fisrt day of month
  // end: Last day of month
  var {
      name, 
      requestor_id,
      customer_id,
      customer_name,
      requestor_email,
      report_release,
      reportType
    } = args;
 return  {   'attributes' : {'Created':"2016-06-10", "ID":"345"}, 
            'ns1:Requestor':  [
                    {
                      'ns1:ID' : { $value: requestor_id },
                      'ns1:Name' : { $value:  customer_name},
                      'ns1:Email' : { $value:  requestor_email}
                    }
                ],
            'ns1:CustomerReference':  [
                    {
                      'ns1:ID' : { $value: customer_id },
                      'ns1:Name' : { $value: customer_name }
                    }
                ],
            'ns1:ReportDefinition':  [
                    { 'attributes' : {'Release':report_release, "Name":reportType},
                      'ns1:Filters': [
                        { 'ns1:UsageDateRange':[{
                            'ns1:Begin':{$value: startDate},
                            'ns1:End':{$value: endDate}
                          }]
                        }
                        ]
                    }
                ]
        }
}
var arrayToSend= 
{   'attributes' : {'Created':"2016-06-10", "ID":"345"}, 
            'ns1:Requestor':  [
                    {
                      'ns1:ID' : { $value: '9973682b-a09d-4cb0-b7ba-da770d3dde93' },
                      'ns1:Name' : { $value: 'UPAEP - UNIVERSIDAD POPULAR AUTONOMA DEL ESTADO DE PUEBLA' },
                      'ns1:Email' : { $value: 'eduardosanzb@gmail.com' }
                    }
                ],
            'ns1:CustomerReference':  [
                    {
                      'ns1:ID' : { $value: 's7391400' },
                      'ns1:Name' : { $value: 'eduarod' }
                    }
                ],
            'ns1:ReportDefinition':  [
                    { 'attributes' : {'Release':"4", "Name":"DB1"},
                      'ns1:Filters': [
                        { 'ns1:UsageDateRange':[{
                            'ns1:Begin':{$value: '2016-01-01'},
                            'ns1:End':{$value: '2016-03-31'}
                          }]
                        }
                        ]
                    }
                ]
}
    
var options = {
  disableCache: true
}

// soap.createClient(url, options, (err, client) => {
//   if(err){
//     console.error(err);
//     return;
//   }
//   client.wsdl.definitions.xmlns.q1 = "http://www.niso.org/schemas/ns1hi/counter"
//   client.wsdl.definitions.xmlns.ns1 = "http://www.niso.org/schemas/sushi"
//   client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()

//   client.GetReport(arrayToSend, (err, result, raw, soapHeader) =>{
//     if(err) console.log(`The error: ${err}`);
//     console.log(result.Report);
//     fs.writeFile('report.json', JSON.stringify(result.Report, null, 2), function(err){
//       if(err) return console.log(err);
//       console.log("The report was saved");
//     })
//   })
// });
let args = {
  "_id" :"5823e41371a215e23645dda2",
  "active" : true,
  "name" : "EBSCO",
  "requestor_id" : "9973682b-a09d-4cb0-b7ba-da770d3dde93",
  "customer_id" : "s7391400",
  "customer_name" : "UPAEP - UNIVERSIDAD POPULAR AUTONOMA DEL ESTADO DE PUEBLA",
  "requestor_email" : "eduardo.sanchez@upaep.edu.mx",
  "report_release" : 4,
  "url" : "http://sushi.ebscohost.com/R4/SushiService.svc?wsdl",
  "__v" : 0
}
var reports = ['JR1', 'JR5', 'DB1', 'DB2', 'PR1', 'BR1', 'BR2', 'BR3']
  .map(x => generateReport(args,x) )

function generateReport(args, reportNumber){
  //Modifyig variables
  args.reportType = reportNumber
  let requestObject = createArrayToSend(args, '2016-01-01', '2016-10-31')
  var options = { disableCache: true }

  //creating the soap client
  soap.createClient(url, options, (err, client) => {
    if(err) return console.log(err);

    client.wsdl.definitions.xmlns.q1 = "http://www.niso.org/schemas/ns1hi/counter"
    client.wsdl.definitions.xmlns.ns1 = "http://www.niso.org/schemas/sushi"
    client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()

    client.GetReport(requestObject, (err, result, raw, soapHeader) =>{
      if(err) return console.log(`The error Getting report: ${err}`);
      //console.log(result);
      fs.writeFile(`reports2/${reportNumber}.json`,
                   JSON.stringify(result, null, 2),
                   err => {
                  if(err) return console.log(err);
                  console.log(`Report exported succcessfully to:${reportNumber}.json`);
        })
    })
  });
}