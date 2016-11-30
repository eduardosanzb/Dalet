import Journals from './journals.model'
export default function createJournals(report) {
    report.content.map(book => {
        Journals.findOne({
            name: book.ItemName
        }, function(err, x) {
          if(err) return console.log(err);
          if(x){
            var metrics = cleanMetrics(book.ItemPerformance)
             var month = (Array.isArray(book.ItemPerformance)) ? book.ItemPerformance[0].Period["End"] : book.ItemPerformance.Period["End"]
            var newStat = {
                type: book.ItemPerformance.Category,
                month: month.substring(5, 7),
                ft_total: metrics.ft_total,
                ft_pdf: metrics.ft_pdf,
                ft_html: metrics.ft_html
            }
            if(x.stats[0].month === newStat.month){
              x.stats[0] = newStat
              console.log(`Journal updated: ${x.name} with fresh stats`);
            } else {
              x.stats.push(newStat)
              console.log(`Journal updated: ${x.name} with new stats`);
            }
            x.save()
          } else {
            createANewBook(book, report)
          }
        })

    })
}

function createANewBook(book, report) {
    var ISNB = cleanISNB(book.ItemIdentifier)
    var attributes = book.ItemPerformance.attributes || null
    var newBook = new Journals({
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
  
    var metrics = cleanMetrics(book.ItemPerformance)
    var month = (Array.isArray(book.ItemPerformance)) ? book.ItemPerformance[0].Period["End"] : book.ItemPerformance.Period["End"]
    var newStat = {
        type: book.ItemPerformance.Category,
        month: month.substring(5, 7),
        ft_total: metrics.ft_total,
        ft_pdf: metrics.ft_pdf,
        ft_html: metrics.ft_html
    }
    newBook.stats.push(newStat)
    newBook.save()
    console.log(`New journal created: ${newBook.name}`);
}

function cleanMetrics(metrics){
  var theMetric = {}
  if(Array.isArray(metrics)){
    theMetric = metrics.reduce((acum, curr) => {
      var thisValue = parseInt(curr.Instance.Count)
      var prevValue = acum[curr.Instance.MetricType]
      acum[curr.Instance.MetricType] = (acum[curr.Instance.MetricType]) ? prevValue+thisValue : thisValue
        return acum
      },{})
  } else {
    var theKey = metrics.Instance.MetricType
    var theValue = parseInt(metrics.Instance.Count)
    theMetric[theKey] = (theMetric[theKey]) ? theMetric[theKey] + theValue : theValue
  }
  theMetric.ft_total = theMetric.ft_total || null
  theMetric.ft_pdf = theMetric.ft_pdf || null
  theMetric.ft_html = theMetric.ft_html || null
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






