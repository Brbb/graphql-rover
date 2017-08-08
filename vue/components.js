var TableComponent = Vue.extend({
  props: ['header', 'type'],
  template: '<table :id="header" v-on:click=loadDocs(type)>' +
  '<tr v-if="type.kind==\'INTERFACE\'"><td class="interface">\<\<{{ header }}\>\></td></tr>' +
  '<tr v-else-if="type.kind==\'UNION\'"><td class="union">{{ header }}</td></tr>' +
  '<tr v-else-if="type.kind==\'ENUM\'"><td class="enum">{{ header }}</td></tr>' +
  '<tr v-else-if="type.kind==\'INPUT_OBJECT\'"><td class="input_object">' +
  '<i class="fa fa-long-arrow-right" aria-hidden="true"></i>{{ header }}</td></tr>' +
  '<tr v-else><td>{{ header }}</td></tr>' +
  '<tr v-for="field in type.fields">' +
  '<td v-bind:class="{deprecated: field.isDeprecated}" v-html=recursiveTypeKind(field)></td>' +
  '</tr>' +
  '<tr v-for="inputField in type.inputFields">' +
  '<td v-bind:class="{deprecated: inputField.isDeprecated}" v-html=recursiveTypeKind(inputField)></td>' +
  '</tr>' +
  '<tr v-for="possibleType in type.possibleTypes">' +
  '<td><a class="type-link" v-on:click=navigateTo(possibleType,$event)>{{possibleType.name}}</a></td>' +
  '</tr>' +
  '<tr v-for="enumValue in type.enumValues">' +
  '<td>{{enumValue.name}}</td>' +
  '</tr>' +
  '</table>',
  methods: {
    loadDocs: function (docType) {
      store.commit('load', docType);
    },
    recursiveTypeKind: function (field) {
      return '<span class="field-name">' + field.name + '</span>: ' + recursiveTypeStringBuilder(field.type);
    },
    navigateTo: function (objectType, e) {
      e.stopPropagation();
      filterStoreAndGoTo(objectType.name);
    }
  },
});

var FieldDocumentation = Vue.component('field-doc', {
  props: ["field"],
  template: '<div>' +
  '<div v-bind:class="{deprecated: field.isDeprecated}">' +
  '<span class="field-name">{{field.name}}</span>' +
  '<arguments v-if="field.args != null && field.args.length > 0" :args="field.args"></arguments>' +
  ': <span v-html=recursiveTypeKind(field)></span>' +
  '</div>' +
  '<div class="doc-field-description">{{field.description}}</div>' +
  '<div class="doc-deprecated-field-description">{{field.deprecationReason}}</div>' +
  '</div>',
  methods: {
    recursiveTypeKind: function (field) {
      return recursiveTypeStringBuilder(field.type);
    },
  }
});

var DocumentationPanelComponent = Vue.component('doc-panel', {
  props: ["doc"],
  template: '<div class="type-explorer-list" v-if="documentation == null">No type selected.</div>' +
  '<div class="type-explorer-list" v-else>' +
  '<div><a class="type-link">{{documentation.name}}</a><span class="kind">::{{documentation.kind}}</span></div>' +
  '<div class="description-box"><small>{{documentation.description}}</small></div>' +
  '<div class="fields-label">fields</div>' +
  '<div class="doc-field" v-for="field in documentation.fields">' +
  '  <field-doc :field="field"></field-doc>' +
  '</div>' +
  '<div class="doc-field" v-for="inputField in documentation.inputFields">' +
  '  <field-doc :field="inputField"></field-doc>' +
  '</div>' +
  '<div class="doc-field" v-for="possibleType in documentation.possibleTypes">' +
  '<div><a class="type-link" v-on:click="navigateTo(possibleType,$event)">{{possibleType.name}}</a></div>' +
  '<div class="doc-field-description">{{possibleType.description}}</div>' +
  '</div>' +
  '<div class="doc-field" v-for="enumField in documentation.enumValues">' +
  '<div v-bind:class="{deprecated: enumField.isDeprecated}">{{enumField.name}}</div>' +
  '<div class="doc-field-description">{{enumField.description}}</div>' +
  '</div>' +
  '</div>',
  computed: {
    documentation() {
      return this.$store.getters.getTableDocumentation
    }
  }, methods: {
    navigateTo: function (objectType, e) {
      e.stopPropagation();
      filterStoreAndGoTo(objectType.name);
    }
  }
});

function navigateFromA(event, a) {
  event.stopPropagation();
  var typeName = a.text;
  filterStoreAndGoTo(typeName);
}

function filterStoreAndGoTo(typeName) {
  var sourceObjectTypes = store.getters.getGraphQLData.types.filter(function (e) { return e.name == typeName });
  store.commit('load', sourceObjectTypes[0]);
  goTo(typeName);
}

function goTo(refNodeName) {
  var refSelectedNode = g.node(refNodeName);
  if (refSelectedNode != null)
    goToSelected(refSelectedNode);
}

function recursiveTypeStringBuilder(type) {
  if (type.kind === 'LIST') {
    return '[' + recursiveTypeStringBuilder(type.ofType) + ']';
  }
  else if (type.kind === 'NON_NULL') {
    return recursiveTypeStringBuilder(type.ofType) + '!';
  }
  else {
    return '<a class="type-link" onclick="navigateFromA(event,this)" >' + type.name + '</a>';
  }
}

var ArgsComponent = Vue.component('arguments', {
  props: ["args"],
  template:
  '<span class="args-group">(<span v-for="(arg,index) in args">' +
  '<span v-if="index > 0">,</span><span class="field-name">{{arg.name}}</span>: ' +
  '<span v-html=recursiveTypeKind(arg)></span>' +
  '</span>)</span>',
  methods: {
    recursiveTypeKind: function (arg) {
      return recursiveTypeStringBuilder(arg.type);
    }
  }
});

var GraphPanelComponent = Vue.component('graph-panel', {
  props: [""],
  template:
  '<div id="graph-panel" class="svg-panel">' +
  '<div class="btn-group zoom-control" role="group" aria-label="Default button group">' +
  '<button id="zoom_in" onclick="zoomClick(this)" type="button" class="btn btn-default zoom-btn-control">+</button>' +
  '<button onclick="setInitialPositionAndZoom()" type="button" class="btn btn-default zoom-btn-control">Reset</button>' +
  '<button id="zoom_out" onclick="zoomClick(this)" type="button" class="btn btn-default zoom-btn-control">-</button>' +
  '</div><svg id="svg-canvas" v-on:click="resetPanel"></svg></div>',
  methods: {
    resetPanel: function (event) {
      if (event.target.id == 'svg-canvas') {
        mouseDownX = mouseDownX - event.clientX;
        mouseDownY = mouseDownY - event.clientY;

        if (event.target.id == 'svg-canvas' && Math.abs(mouseDownX) == 0 && Math.abs(mouseDownY) == 0) {
          reset();
          store.commit('load', null);
        }
      }
    },
  }
});

Vue.component('gqlc-autocomplete-item', {
  functional: true,
  render: function (h, ctx) {
    var item = ctx.props.item;
    return h('li', ctx.data, [
      h('span', { attrs: { class: 'value' } }, [item.value]),
      h('span', { attrs: { class: 'item-type' } }, [item.itemType]),
      h('span', { attrs: { class: 'parent-type' } }, [item.parentType])
    ]);
  },
  props: {
    item: { type: Object, required: true }
  }
});


const store = new Vuex.Store({
  state: {
    type: null,
    graphQLData: {},
    searchableTypesCollection: []
  },
  getters: {
    getTableDocumentation: state => {
      return state.type
    },
    getGraphQLData: state => {
      return state.graphQLData
    },
    getSearchableTypesCollection: state => {
      return state.searchableTypesCollection
    }
  },
  mutations: {
    load(state, tableType) {
      state.type = tableType;
    },
    dataLoad(state, data) {
      state.graphQLData = data;
      state.searchableTypesCollection = [];

      if (state.graphQLData.types != null) {
        state.graphQLData.types.forEach(function (type) { state.searchableTypesCollection.push({ "value": type.name, "itemType": "Type" }) });

        state.graphQLData.types.forEach(function (type) {
          if (type.fields != null) {
            type.fields.forEach(function (field) {
              state.searchableTypesCollection.push({ "value": field.name, "itemType": "Field", "parentType": type.name });
            });
          }
        });
      }
    }
  }
});

var App = new Vue({
  el: '#gqle',
  store,
  data: {
    dataView: 'doc-component',
    autocompleteState: '',
    fullscreenLoading: false,
    dialogFormVisible: false,
    httpVerbs: ['GET', 'POST'],
    form: {
      url: 'http://graph.pokeql.win/?',
      auth: '',
      verb: 'POST',
      contentType: 'application/graphql',
      useIntrospectionQuery: true,
    },
  },
  components: {
    docComponent: DocumentationPanelComponent,
    graphPanel: GraphPanelComponent
  },
  methods: {
    querySearch(queryString, cb) {
      var source = this.$store.getters.getSearchableTypesCollection;
      var results = queryString ? source.filter(function (item) { return item.value.toLowerCase().startsWith(queryString.toLowerCase()) }) : source;
      // call callback function to return suggestions
      cb(results);
    },
    handleSelect(item) {

      if (item.itemType == 'Field')
        filterStoreAndGoTo(item.parentType);
      else
        filterStoreAndGoTo(item.value);
    },
    handleSearchIconClick(ev) {

    },
    requestGraphQL() {
      var auth = this.form.auth;
      var contentType = this.form.contentType;
      var bodyData = '';
      if (this.form.useIntrospectionQuery && this.form.verb == 'POST')
        bodyData = introspectionQuery;

      if (this.form.url != null && this.form.url != '') {
        this.fullscreenLoading = true;

        $.ajax({
          url: this.form.url,
          type: this.form.verb,
          dataType: 'json',
          data: bodyData,
          success: function (gqlresponse) {
            var schema = gqlresponse.data.__schema;
            store.commit('dataLoad', schema);
            resetGraph();
            loadGraph();
            App.fullscreenLoading = false;
          },
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", auth);
            xhr.setRequestHeader("Content-Type", contentType);
          }
        }).fail(function (jqXHR, textStatus, errorThrown) {
          App.fullscreenLoading = false;
          App.$message.error({
            message: textStatus+':'+errorThrown
          });
        });
      }
      else {
        this.$message.error({
          message: 'Endpoint not configured!'
        });
      }
    }
  },
  mounted() {
    this.requestGraphQL();
  }
});

