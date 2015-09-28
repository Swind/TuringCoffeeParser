require! {
  "winston": winston
  "path": path
}

line_number = (prefix='') ->
    stack = new Error().stack
    # console.log stack.split('\n')[2]
    [file, line] = stack.split('\n')[2].split ':'
    [func, file] = file.split ' ('
    [func, file] = ['??', func] unless file # sometimes the function isn't specified
    [func, file] = [func.split(' ').pop(), path.basename(file)]
    [junk, func] = func.split('.')
    func = junk unless func
    func = if func is '??' or func is '<anonymous>' then ' (' else " (<#{func}> "
    prefix + func + file + ':' + line + ')'

timestamp = ! ->
  return new Date().toLocaleString!

formatter = (options) ->
  return options.timestamp! + " [" + options.level.toUpperCase! + "] " +

         (if undefined !== options.message 
         then options.message
         else "") +

         (if options.meta and Object.keys(options.meta).length 
         then '\n\t'+ JSON.stringify(options.meta) 
         else "")

logger = new winston.Logger {
  transports: [
    new (winston.transports.Console) ({
      colorize: true
      prettyPrint: true
      depth: true
      humanReadableUnhandledException: true
      timestamp: timestamp
    })
  ]
  line_number: line_number
}

logger.line_number = line_number

logger.level = "debug"

module.exports = logger 
