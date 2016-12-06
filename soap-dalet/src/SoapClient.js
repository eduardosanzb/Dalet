'use strict';
import soap from 'soap'
import fs from 'fs'
export default function generateReport(args, callback){
  //Modifyig variables
  var date = new Date()
  var {
    provider,
    reportNumber,
    startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0,10),
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().slice(0,10), 
  } = args
  provider.reportType = reportNumber
  let requestObject = createArrayToSend(provider, startDate, endDate)
  var options = { disableCache: true }

  //creating the soap client
  soap.createClient(provider.url, options, (err, client) => {
    if(err) return console.log(err);

    client.wsdl.definitions.xmlns.q1 = "http://www.niso.org/schemas/sushi/counter"
    client.wsdl.definitions.xmlns.ns1 = "http://www.niso.org/schemas/sushi"
    client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()

    client.GetReport(requestObject, (err, result, raw, soapHeader) =>{
      if(err) return callback(`${provider.name} : ${err}`, result)
      if(result.Exception) return callback(`${provider.name} : Error: ${result.Exception.Message}`, result)
      fs.writeFile(`reports/${reportNumber}.${startDate}To${endDate}.json`,
                   JSON.stringify(result, null, 2),
                   err => {
                  if(err) return console.log(err);
                  console.log(`Report exported succcessfully to:${reportNumber}.${startDate}To${endDate}.json`);
        })
      callback(null, result.Report)
    })
  });
}

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