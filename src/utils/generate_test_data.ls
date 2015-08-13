require! {
    "../src/cookbooks.js": cbs
    "./testdata.js": testdata
}

cbmgr = new cbs.CookbookMgr './generated_cookbooks.json'
cbmgr.cookbooks.removeDataOnly!

# Create

for i from 1 to 100
    cookbook_data = {
        name: "測試用的 Cookbook 的 Name #i"
        description: "測試用的 Cookbook 的 Description #i"
        content: [
            testdata.spiral
            testdata.circle
            testdata.spiral_total_water
            testdata.fixed_point
        ]
    }

    cbmgr.update_cookbook(null, cookbook_data)
