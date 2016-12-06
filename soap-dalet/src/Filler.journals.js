import Journals from './models/journals.model'
import Promise from 'bluebird'

export default function createJournals(report) {
  var count = report.content.length
  return new Promise(function(resolve, reject){
    report.content.map(journal => {
        Journals.findOne({
              name: journal.ItemName
            }, function(err, x) {
              if(err) return reject(err);
              if(x){
                var metrics = cleanMetrics(journal.ItemPerformance)
                var month = (Array.isArray(journal.ItemPerformance)) ? journal.ItemPerformance[0].Period["End"] : journal.ItemPerformance.Period["End"]
                var newStat = {
                    type: journal.ItemPerformance.Category,
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
                count--
                resolvePromise(resolve, count)
              } else {
                createANewJournal(journal, report)
                .then(function(result){
                  console.log(result);
                  count--
                  resolvePromise(resolve, count)
                })
              }
          })
    })
  }) //promise-end
}

function createANewJournal(journal, report) {
  return new Promise(function(resolve, reject){
    var ISNB = cleanISNB(journal.ItemIdentifier)
    var attributes = journal.ItemPerformance.attributes || null
    var newJournal = new Journals({
        _provider: report._provider,
        _career: null,
        name: journal.ItemName,
        type: journal.ItemDataType,
        publisher: journal.ItemPublisher,
        platform: journal.ItemPlatform,
        attributes: attributes,
        print_ISNB: ISNB.print,
        online_ISNB: ISNB.online,
        propietary_ISNB: ISNB.proprietary
    });
  
    var metrics = cleanMetrics(journal.ItemPerformance)
    var month = (Array.isArray(journal.ItemPerformance)) ? journal.ItemPerformance[0].Period["End"] : journal.ItemPerformance.Period["End"]
    var newStat = {
        type: journal.ItemPerformance.Category,
        month: month.substring(5, 7),
        ft_total: metrics.ft_total,
        ft_pdf: metrics.ft_pdf,
        ft_html: metrics.ft_html
    }
    newJournal.stats.push(newStat)
    newJournal.save()
    return resolve(`New journal created: ${newJournal.name}`)
  })
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
  var theJournal = {}
  if(Array.isArray(value)){
    theJournal = value.reduce((acum, curr) => {
      acum[curr.Type] = curr.Value
      return acum
    },{})
  } else {
    if(value)
      theJournal[value.Type] = value.Value
  }
  theJournal.print = theJournal.Print_ISBN || null
  theJournal.online = theJournal.Online_ISBN || null
  theJournal.proprietary = theJournal.Proprietary || null
  return theJournal
}

function resolvePromise(resolve, count){
  console.log(`--------------${count}-------------`);
  if(count === 0)
    return resolve(`The report was correctly readed and processed`)
}




