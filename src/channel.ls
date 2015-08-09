require! {
    "nanomsg": nanomsg
}

####################################################
#
# Monitor 
#
####################################################

class Monitor

    subscribers: {}

    record_msg: (name, msg) -->
        sub = @subscribers[name]
        sub.data = JSON.parse msg

        if sub.callback != null
            sub.callback msg

    subscribe: (address, name, callback=null) ->

        sock = nanomsg.socket \sub
        sock.connect address
        sock.on \data, @record_msg name

        sub = {}
        sub.socket = sock
        sub.name = name
        sub.callback = callback
        sub.data = {}

        @subscribers[name] = sub

    get_data: (name)->
        sub = @subscribers[name]
        return sub.data

    close: (address) ->
        @subscribers[address].socket.close!
        delete subscribers[address]

    close_all: !->
        for key, value of @subscribers
            value.socket.close!
        @subscribers := {}

####################################################
#
# Command Channel  
#
####################################################
class CmdChannel
    (address, callback=null) ->
        @sock = nanomsg.socket \pair
        @sock.connect address
        @sock.on \data, @reply_handler

        @callback = callback

    reply_handler: (msg) ->
        if @callback != null
            callback JSON.parse msg

    send: (json_obj) ->
        @sock.send JSON.stringify json_obj

    close: ! ->
        @sock.close!

module.exports = {
    Monitor: Monitor
    CmdChannel: CmdChannel
}
