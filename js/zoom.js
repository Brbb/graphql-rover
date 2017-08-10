var zoom = d3.behavior.zoom().on("zoom", zoomed);

function zoomed() {
    svgGroup.attr("transform",
        "translate(" + zoom.translate() + ")" +
        "scale(" + zoom.scale() + ")"
    );
}

function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(300).tween("zoom", function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
            iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
            zoom
                .scale(iScale(t))
                .translate(iTranslate(t));
            zoomed();
        };
    });
}

function setInitialPositionAndZoom(){
    var scaleX = svg.attr("width") / g.graph().width;
    var scaleY = svg.attr("height") / g.graph().height;
    var scaleRatio = Math.max(scaleX,scaleY);

    var xCenterOffset = svg.attr("width") - g.graph().width * scaleX;
    var yCenterOffset = svg.attr("height") - g.graph().height * scaleY;

    interpolateZoom([xCenterOffset,yCenterOffset], scaleRatio)
}

function zoomClick(source) {
    var direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [svg.attr("width") / 2, svg.attr("height") / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    direction = (source.id === 'zoom_in') ? 1 : (source.id === 'zoom_out') ? -1 : 0;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
}
function zoomToSelected(node){
    var width = $('#svg-canvas').width();
    var height = $('#svg-canvas').height();
    
    var nodeBox = node.elem.getBBox();

    var scale = Math.max(1, Math.min(1.5, 0.9 / Math.max(nodeBox.width / width, nodeBox.height / height))),
      translate = [(width / 2 - node.x * scale), (height / 2 - node.y * scale)];
      interpolateZoom(translate,scale);
}