
import mongoose from 'moongoose'
import soap from 'soap'
import http from 'http'
import xml2js from 'xml2js'
import fs from 'fs'

var parseString = xml2js.parseString
 //parseString = parseString.parseString

var url = 'http://sushi.ebscohost.com/R4/SushiService.svc?wsdl'
var url2 = 'http://sushi.ebscohost.com/r4/SushiService.svc?singleWsdl'

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
  //forceSoap12Headers: true
}

soap.createClient(url, options, (err, client) => {
  if(err){
    console.error(err);
    return;
  }
  //I just detected taht the problem is about the headers q1, q2 and stuff like that!!! =)
  client.wsdl.definitions.xmlns.q1 = "http://www.niso.org/schemas/ns1hi/counter"
  client.wsdl.definitions.xmlns.ns1 = "http://www.niso.org/schemas/sushi"
  client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()

  //console.log( client.describe().SushiService.BasicHttpBinding_ISushiService.GetReport.input);
  client.GetReport(arrayToSend, (err, result, raw, soapHeader) =>{
    if(err) console.log(`The error: ${err}`);
    console.log(result.Report);
    fs.writeFile('report.json', JSON.stringify(result.Report, null, 2), function(err){
      if(err) return console.log(err);
      console.log("The report was saved");
    })
    //console.log(raw);
  })
  console.log(client.lastRequest);

})

// http.get(url, (response) => {
//   var body = ''
//   response.on('data', (x)=>{
//     body += x
//   })
//   response.on('end',()=>{
//     //console.log(body);
//     parseString.parseString(body, (err, result)=>{
//       if(err) console.error(err)
//       console.log(JSON.stringify(result, null, 4).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'));
//     })
//   })
// })