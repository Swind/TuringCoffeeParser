#Vendor 
require! {
    "mithril": mithril
}

require! {
    "./components/cookbook": cookbook
    "./components/barista": barista
}

m.route (document.getElementById "wrapper"), "/", {
    "/": cookbook
    "/barista/:name": barista
}
