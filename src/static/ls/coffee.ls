#Vendor 
require! {
    "mithril": mithril
    "materialize-css": materialize 
}

require! {
    "./components/cookbook": cookbook
    "./components/barista": barista
}

m.route (document.getElementById "wrapper"), "/", {
    "/": cookbook
    "/barista/:name": barista
}
