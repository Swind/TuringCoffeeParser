require!{
    "./channel.js": channel 
}

HEATER_PUB_ADDRESS = 'ipc:///tmp/heater_pub_channel'
REFILL_PUB_ADDRESS = 'ipc:///tmp/refill_pub_channel'
PRINTER_PUB_ADDRESS= "ipc:///tmp/printer_pub_channel"

HEATER_CMD_ADDRESS = 'ipc:///tmp/heater_cmd_channel'
REFILL_CMD_ADDRESS = 'ipc:///tmp/refill_cmd_channel'
PRINTER_CMD_ADDRESS= "ipc:///tmp/printer_cmd_channel"

"Command_Socket_Address": "ipc:///tmp/printer_cmd_channel"
class Barista

    !->
        @monitor = new channel.Monitor
        @monitor.subscribe HEATER_PUB_ADDRESS, \heater
        @monitor.subscribe REFILL_PUB_ADDRESS, \refill
        @monitor.subscribe PRINTER_PUB_ADDRESS, \printer

        @heater_cmd = new channel.CmdChannel HEATER_CMD_ADDRESS
        @refill_cmd = new channel.CmdChannel REFILL_CMD_ADDRESS
        @printer_cmd = new channel.CmdChannel PRINTER_CMD_ADDRESS

    get_heater_status: !->
        return @monitor.get_data \heater

    set_heater_tempearture: (temperature)->
        @heater_cmd.send {
            temperature: temperature
        }

    get_refill_status: !->
        return @monitor.get_data \refill

    /*
    refill command example
    {
        "active": true,
    }
    */
    start_refill: !->
        cmd = {
            "active": true
        }
        @refill_cmd.send cmd

    stop_refill: !->
        cmd = {
            "active": false 
        }
        @refill_cmd.send cmd

    get_printer_status: !->
        return @monitor.get_data \printer

module.exports = {
    Barista: Barista
}
