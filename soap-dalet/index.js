
import mongoose from 'moongoose'
import soap from 'soap'

var url = 'http://www.w3schools.com/xml/guestbook.asp'

let options = {
  disableCache:true
}
soap.createClient(url, options, (err, client) => {
  if(err){
    console.error(err);
    return;
  }
  console.log(client);
})

