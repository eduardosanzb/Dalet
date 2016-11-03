
import mongoose from 'moongoose'
import soap from 'soap'
import http from 'http'
import xml2js from 'xml2js'

var parseString = xml2js.parseString
 //parseString = parseString.parseString

var url = 'http://sushi.ebscohost.com/R4/SushiService.svc'
var url2 = 'http://sushi.ebscohost.com/r4/SushiService.svc?singleWsdl'
/*
  Requestor ID
9973682b-a09d-4cb0-b7ba-da770d3dde93
 
Customer ID
s7391400
 
Customer Name
Su nombre
 
Requestor Email
Su correo electrónico
 
Report Name
El reporte COUNTER solicitado(Más información aquí:   https://help.ebsco.com/interfaces/EBSCOadmin/Admin_User_Guide/EBSCOhost_SUSHI_Web_Service_FAQs )
 
Report Release
La versión del reporte (por ejemplo, 4)
 
From Date
La fecha del empiezo del informe en formato AAAA-MM-DD, el día debe ser el primer día del mes
 
To Date
La fecha del fin del reporte en formato AAAA-MM-DD, el día debe ser el último día del mes
 
Los datos del EIT Webservice:
 
Profile ID:  eitws
 
CustID.GroupID.ProfileID:  s7391400.main.eitws
 
Profile Password:  ebs249

*/
var args = {
  Requestor:{
    id:'9973682b-a09d-4cb0-b7ba-da770d3dde93',
    email:'eduardosanzb@gmail.com',
    name:'Eduardo'
  },
  CustomerReference:{
    id:'s7391400',
    name:'UPAEP'
  },
  ReportDefinition:{
    name:'COUNTER',
    release:4,  
  },
  form_date:'2016-02-01',
  to_date:'2016-03-31'
}

let options = {
  disableCache:true
}
soap.createClient(url2, options, (err, client) => {
  if(err){
    console.error(err);
    return;
  }
  
  client.GetReport(args,(err, result)=>{
    if (err){ 
      console.error(err)
      return;
    }
    console.log(result);
  })
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