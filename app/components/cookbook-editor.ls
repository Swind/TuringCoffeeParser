require! {
  "../react-wrapper": {Component, bindActionCreators}
  "../actions/CookbookEditingActions": Actions
  "./card": Card
  "material-ui/lib/slider": Slider
  "material-ui/lib/paper": Paper
}

calculate-cookbook-total-time = (cookbook) ->
  time = 0
  for content in cookbook.content
    time += do
      (p, c) <~ content.process.reduce _, 0
      if c.total_time != undefined
        p + c.total_time
      else
        p
  time

calculate-cookbook-total-water = (cookbook) ->
  water = 0
  for content in cookbook.content
    water += do
      (p, c) <~ content.process.reduce _, 0
      if c.total_water != undefined
        p + c.total_water
      else
        p
  water

class ContentCard extends Component

  render: ->
    content = @props.content

    menu = do
      Component.create @CardMenu, null, do
        [
          Component.create @MenuItem, {onClick: null}, "Copy"
          Component.create @MenuItem, {onClick: null}, "Edit"
        ]

    generate-step-content = (x, i) ~>
      [
        @div {className: \title}, x.name
        @div {className: \body}, do
          @ul null, do
            [
              @li null, "X: #{x.coordinates.x} mm" if x.coordinates != undefined
              @li null, "Y: #{x.coordinates.y} mm" if x.coordinates != undefined
              if x.high != undefined
                @li null, do
                  [
                    @span null, "高度: #{x.high.start} mm"
                    Component.create Slider, {
                      value: x.high.start
                      step: 5
                      min: 0
                      max: 300
                      onChange: (e, v) ~>
                        new_content = Object.assign {}, content
                        new_content.process[i].high.start = parseInt v
                        @props.onChange(new_content)
                    }
                  ]
              if x.total_water != undefined
                @li null, do
                  [
                    @span null, "總水量: #{x.total_water} ml"
                    Component.create Slider, {
                      value: x.total_water
                      step: 10
                      min: 0
                      max: 300
                      onChange: (e, v) ~>
                        new_content = Object.assign {}, content
                        new_content.process[i].total_water = parseInt v
                        @props.onChange(new_content)
                    }
                  ]
              if x.total_time != undefined
                @li null, do
                  [
                    @span null, "總時間:"
                    @input {
                      type: "number"
                      value: "#{x.total_time}"
                      onChange: (e) ~>
                        new_content = Object.assign {}, content
                        new_content.process[i].total_time = parseInt e.target.value
                        @props.onChange(new_content)
                    }
                    @span null, " sec."
                  ]
            ]
      ]

    process = do
      (x, i) <~ content.process.map
      @div {className: \step}, do
        [
          @div null, do
            [
              @div {className: \circle}, i+1
              @div {className: \line}, null
            ]
          @div {className: \step-content}, do
            generate-step-content x, i
        ]

    Component.create Paper, {className: \group, zDepth: 1}, do
      [
        @h3 null, content.name
        @div null, process
        menu
      ]

class CookbookEditor extends Component

  render: ! ->
    id = @props.params.cookbookId
    cookbook = if @props.editing == undefined
      then @props.cookbooks[id]
      else @props.editing

    card = new Card!

    editable-name = do
      Component.create do
        @Textfield
        * label: 'Title'
          value: cookbook.name
          style: {width: "100%"}
          floatingLabel: true
          required: true
          onChange: (e) ~>
            new_cookbook = Object.assign {}, cookbook
            new_cookbook.name = e.target.value
            @props.updateEditingCookbook new_cookbook

    editable-description = do
      Component.create do
        @Textfield
        * label: 'Description'
          value: cookbook.desc
          style: {width: "100%"}
          rows: 3
          floatingLabel: true
          onChange: (e) ~>
            new_cookbook = Object.assign {}, cookbook
            new_cookbook.desc = e.target.value
            @props.updateEditingCookbook new_cookbook

    contents = [
      card.Desc editable-description
      card.Info \timer, (calculate-cookbook-total-time cookbook) + " s"
      card.Info \local_drink, (calculate-cookbook-total-water cookbook) + " ml"
    ]

    return do
      # The detail data of this cookbook
      @div {className: "cb-editor mdl-grid"},
        @div {className: "mdl-cell--middle mdl-cell--12-col"},
          card.generateDOM editable-name, contents, [], null

        # Show all process
        for content, index in cookbook.content
          @div {className: "mdl-cell--12-col mdl-cell--middle"},
            ContentCard.elem {
              content: content,
              key: index,
              id: index,
              onChange: (p) ~>
                new_cookbook = Object.assign {}, cookbook
                new_cookbook[index] = p
                @props.updateEditingCookbook new_cookbook
            }

map-state-to-props = (state) ->
  * cookbooks: state.cookbooks
    editing: state.editor.cookbook

map-dispatch-to-props = (dispatch) ->
  bindActionCreators Actions, dispatch

module.exports = CookbookEditor.connect map-state-to-props, map-dispatch-to-props

