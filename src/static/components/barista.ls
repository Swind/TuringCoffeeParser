require! {
}

barista = {}

# ================================================================================
#
#   Model 
#
# ================================================================================

# ================================================================================
#
#   View 
#
# ================================================================================
/*
    <div class="page-header">
        <h2>Turing Coffee <small>一杯量的咖啡</small></h2>
    </div>
<div class="mdl-textfield mdl-js-textfield textfield-demo">
    <textarea class="mdl-textfield__input" type="text" rows= "3" id="sample5" ></textarea>
    <label class="mdl-textfield__label" for="sample5">Text lines...</label>
</div>
*/

barista.view = (ctrl) ->

    (m \div.container#barista-timeline, [
        (m \div.row, [
            # Title
            (m \div.col-md-12,
                (m \div.mdl-textfield.mdl-js-textfield, [
                    (m \input.mdl-textfield__input#cookbook-title, {type: \text})
                    (m \label.mdl-textfield__label, {for: \cookbook-title}, "Title ...")
                ])
            ),

            # Description
            (m \div.col-md-12,
                (m \div.mdl-textfield.mdl-js-textfield, [
                    (m \textarea.mdl-textfield__input#cookbook-description, {type: \text})
                    (m \label.mdl-textfield__label, {for: \cookbook-description}, "Description ...")
                ])
            )
        ]),

        # Timeline
        (m \div.timeline, [
            (m \div.line.text-muted)
            
            (m \div.separator.text-muted , [(m \div.create-new-cookbook.icon, (m \i.glyphicon.glyphicon-plus)),(m \time, "0 m 0 s")])
        ])
    ])
# ================================================================================
#
#   Controller 
#
# ================================================================================
barista.controller = ! ->

module.exports = barista
