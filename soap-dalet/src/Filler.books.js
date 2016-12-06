import Books from './models/books.model'
import Promise from 'bluebird'

export default function createBooks(report) {
  var count = report.content.length
  console.log(count);
  return new Promise(function(resolve, reject){
    report.content.map(book => {
        Books.findOne({
            name: book.ItemName
        }, function(err, x) {
          if(err) return reject(err);
          if(x){
            if(Array.isArray(book.ItemPerformance)){
              book.ItemPerformance.map(performance => {
                var metrics = cleanMetrics(performance.Instance)
                var reportDate = new Date(performance.Period["End"])
                var newStat = {
                    type: book.ItemPerformance.Category,
                    month: reportDate.getMonth(),
                    year: reportDate.getFullYear(),
                    ft_total: metrics.ft_total,
                    ft_pdf: metrics.ft_pdf,
                    ft_html: metrics.ft_html
                }
                var founded = false
                x.stats = x.stats.map(stat => {
                  if(stat.month === newStat.month && stat.year === newStat.year){
                    founded = true
                    console.log(`Book updated: ${shortenName(x.name)} with fresh stats`);
                    return newStat
                  }
                  else 
                    return stat
                })
                if(!founded){
                  x.stats.push(newStat)
                  console.log(`Book updated: ${shortenName(x.name)} with new stats`);
                }
                
              })
            } else {
              var reportDate = new Date(book.ItemPerformance.Period["End"])
              var metrics = cleanMetrics(book.ItemPerformance.Instance)
              var newStat = {
                  type: book.ItemPerformance.Category,
                  month: reportDate.getMonth(),
                  year: reportDate.getFullYear(),
                  ft_total: metrics.ft_total,
                  ft_pdf: metrics.ft_pdf,
                  ft_html: metrics.ft_html
              }
              if(x.stats[0].month === newStat.month){
                x.stats[0] = newStat
                console.log(`Book updated: ${shortenName(x.name)} with fresh stats`);
              } else {
                x.stats.push(newStat)
                console.log(`Book updated: ${shortenName(x.name)} with new stats`);
              }
            }
            x.save()
            count--
            resolvePromise(resolve, count)
          } else {
            createANewBook(book, report)
              .then((result)=>{
                console.log(result);
                count--
                resolvePromise(resolve, count)
              })
          }
        })

    })
  })
}

function createANewBook(book, report) {
  return new Promise(function(resolve, reject){
    var ISNB = cleanISNB(book.ItemIdentifier)
    var attributes = book.ItemPerformance.attributes || null
    var newBook = new Books({
        _provider: report._provider,
        _career: null,
        name: book.ItemName,
        type: book.ItemDataType,
        publisher: book.ItemPublisher,
        platform: book.ItemPlatform,
        attributes: attributes,
        print_ISNB: ISNB.print,
        online_ISNB: ISNB.online,
        propietary_ISNB: ISNB.proprietary
    });
    if(Array.isArray(book.ItemPerformance)){
      var _count = book.ItemPerformance.length
      console.log(`The book have more than one report, in total: ${_count}`);
      book.ItemPerformance.map(performance => {
        
        var metrics = cleanMetrics(performance.Instance)
        var reportDate = new Date(performance.Period["End"])
        var newStat = {
            type: book.ItemPerformance.Category,
            month: reportDate.getMonth(),
            year: reportDate.getFullYear(),
            ft_total: metrics.ft_total,
            ft_pdf: metrics.ft_pdf,
            ft_html: metrics.ft_html
        }
        newBook.stats.push(newStat)
        newBook.save()
        _count--
        if(_count === 0)
          return resolve(`New book created: ${shortenName(newBook.name)}`)
      })
      
    } else {
      var metrics = cleanMetrics(book.ItemPerformance.Instance)
      var reportDate = new Date(book.ItemPerformance.Period["End"])
      var newStat = {
          type: book.ItemPerformance.Category,
          month: reportDate.getMonth(),
          year: reportDate.getFullYear(),
          ft_total: metrics.ft_total,
          ft_pdf: metrics.ft_pdf,
          ft_html: metrics.ft_html
      }
      newBook.stats.push(newStat)
      newBook.save()
      return resolve(`New book created: ${shortenName(newBook.name)}`)
    }
  })
}

function cleanMetrics(metrics){
  var theMetric = {}
  if(Array.isArray(metrics)){
    theMetric = metrics.reduce((acum, curr) => {
      acum[curr.MetricType] = curr.Count
      return acum
    },{})
  } else {
    theMetric[metrics.MetricType] = metrics.Count
  }
  theMetric.ft_total = theMetric.ft_total || 0
  theMetric.ft_pdf = theMetric.ft_pdf || 0
  theMetric.ft_html = theMetric.ft_html || 0
  return theMetric
}
function cleanISNB(value){
  var theBook = {}
  if(Array.isArray(value)){
    theBook = value.reduce((acum, curr) => {
      acum[curr.Type] = curr.Value
      return acum
    },{})
  } else {
    if(value)
      theBook[value.Type] = value.Value
  }
  theBook.print = theBook.Print_ISBN || null
  theBook.online = theBook.Online_ISBN || null
  theBook.proprietary = theBook.Proprietary || null
  return theBook
}

function resolvePromise(resolve, count){
  console.log(`--------------${count}-------------`);
  if(count === 0)
    return resolve(`The report was correctly readed and processed`)
}

function shortenName(name){
  let numberOfChars = 10
  if(name.length < numberOfChars)
    return name
  return name.slice(0,numberOfChars)
}



