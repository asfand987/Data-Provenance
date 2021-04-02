/**
 * This class defines source and target endpoints as well as connectors.
 */

var connectorPaintStyle = {
    lineWidth: 4,
    strokeStyle: "#61B7CF",
    joinstyle: "round",
    outlineColor: "white",
    outlineWidth: 2
};

var connectorHoverStyle = {
    lineWidth: 4,
    strokeStyle: "#216477",
    outlineWidth: 2,
    outlineColor: "white"
};

var endpointHoverStyle = {
    fillStyle: "#216477",
    strokeStyle: "#216477"
};

var sourceEndpoint = {
    endpoint: "Dot",
    paintStyle: {
        strokeStyle: "#bbbb77", // 7AB02C
        fillStyle: "transparent",
        radius: 5,
        lineWidth: 3
    },
    isSource: true,
    maxConnections: -1,
    connector: ["Flowchart", {stub: [40, 60], gap: 5, cornerRadius: 5, alwaysRespectStubs: true}],
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    EndpointOverlays: [],
    dragOptions: {},
    connectorOverlays: [
        ["Arrow", {
            location: 1,
            visible: true,
            id: "ARROW",
            direction: 1
        }]
    ]
};

var targetEndpoint = {
    endpoint: "Dot",
    paintStyle: {fillStyle: "#bbbb77", radius: 5},
    maxConnections: -1,
    dropOptions: {hoverClass: "hover", activeClass: "active"},
    hoverPaintStyle: endpointHoverStyle,
    isTarget: true
};