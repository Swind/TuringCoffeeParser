require!{
    "./monitor.js": monitor
}

HEATER_ADDRESS = 'ipc:///tmp/heater_pub_channel'

###############################################################
#
#    Global Variables 
#
###############################################################

heater_status = {}

###############################################################
#
#    Register monitor and message handler 
#
###############################################################

# Heater
update_heater_status = (msg)->
    #{"set_point": 0, "cycle_time": 5, "duty_cycle": 0, "temperature": 19.993750000000002}
    heater_status = JSON.parse msg

monitor.subscribe HEATER_ADDRESS, update_heater_status

module.exports = {
    heater_status: heater_status
}
