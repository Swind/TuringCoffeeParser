require! {
    "nanomsg": nanomsg
}

__subscribes = {}

subscribe = (address, action) ->
    sub = nanomsg.socket(\sub)
    sub.connect address
    sub.on \data, action

    __subscribes[address] = sub

close = (address) ->
    sub = __subscribes[address]
    sub.close!

    delete __subscribes[address]

close_all = !->
    for address, sub of __subscribes
        sub.close!

    __subscribes := {}

module.exports = {
    subscribe: subscribe
    close: close
    close_all: close_all
}
