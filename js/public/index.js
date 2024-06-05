$(document).ready(function () {
    const URL = 'http://127.0.0.1:8080';
    var savedData = localStorage.getItem('savedTree');
    var treeData = JSON.parse(savedData) || {};
    console.log(treeData)
    treeData.elements = treeData.elements || {};
    treeData.elements.nodes = treeData.elements.nodes || [];
    treeData.elements.edges = treeData.elements.edges || [];
    if (treeData.elements.nodes.filter(item => item.id != 'start').length == 0) {
        treeData.elements.nodes.push({ data: { id: 'start', name: 'Start' }, position: { x: 100, y: 100 } });
    }
    console.log(treeData.elements);

    var cy = cytoscape({
        container: document.getElementById('cy'),
        ...treeData,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(name)'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            },
            {
                selector: '.eh-handle',
                style: {
                    'background-color': 'red',
                    'width': 12,
                    'height': 12,
                    'shape': 'ellipse',
                    'overlay-opacity': 0,
                    'border-width': 12, // makes the handle easier to hit
                    'border-opacity': 0
                }
            },

            {
                selector: '.eh-hover',
                style: {
                    'background-color': 'red'
                }
            },

            {
                selector: '.eh-source',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },

            {
                selector: '.eh-target',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },

            {
                selector: '.eh-preview, .eh-ghost-edge',
                style: {
                    'background-color': 'red',
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'source-arrow-color': 'red'
                }
            },

            {
                selector: '.eh-ghost-edge.eh-preview-active',
                style: {
                    'opacity': 0
                }
            },
            {
                selector: '.selected',
                style: {
                    'background-color': 'blue',
                    'line-color': 'blue',
                    'target-arrow-color': 'blue',
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }
        ],
        layout: {
            name: 'preset',
            directed: true,
            padding: 10
        }
    });

    var eh = cy.edgehandles({
        toggleOffOnLeave: true,
        handleNodes: "node",
        handleSize: 10,
        handleHitThreshold: 10,
        noEdgeEventsInDraw: true,
        canConnect: function (sourceNode, targetNode) {
            return sourceNode.edgesWith(targetNode).empty() ? !sourceNode.same(targetNode) : null;
        }
    });

    cy.on('tap', 'node', function (evt) {
        var node = evt.target;
        node.toggleClass('selected'); // Toggle class 'selected' khi click vào node
        cy.elements('.selected').not(node).removeClass('selected');

    });

    cy.on('tap', 'edge', function (evt) {
        var edge = evt.target;
        edge.toggleClass('selected'); // Toggle class 'selected' khi click vào cạnh
        cy.elements('.selected').not(edge).removeClass('selected');

    });

    function removeAllSelected() {
        let highlightedElements = cy.elements('.selected').filter(item => !item.is('node') || item.id() != 'start');
        highlightedElements.remove();
    }


    function findFreePosition(x = 0, y = 0) {
        const step = 50;
        while (true) {
            let isFree = true;
            cy.nodes().forEach(node => {
                let pos = node.position();
                if (Math.abs(pos.x - x) < step && Math.abs(pos.y - y) < step) {
                    isFree = false;
                }
            });

            if (isFree) {
                return { x, y };
            }

            x += step;
            // y += step;
        }
    }

    function addNode() {
        let s = prompt("Nhập điều kiện");
        let data = { id: new Date().getTime(), name: s };
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: `${URL}/check`,
            data: JSON.stringify(data),
            dataType: "json",
            success: function (response) {
                if (response.code == 200) {
                    let currentZoom = cy.zoom();

                    cy.add({
                        group: 'nodes',
                        data,
                        position: findFreePosition()

                    });

                    cy.layout({
                        name: 'preset',
                        fit: false,
                        directed: true,
                        padding: 10
                    }).run();

                    cy.zoom(currentZoom);
                }
                else {
                    alert(response.message);
                    console.log(response)
                }
            }
        });
    }

    $('#editNode').click(function () {
        let nodeSelected = cy.elements('.selected').filter(item => item.is('node') && item.id() != 'start');
        if (nodeSelected.length == 0) return;
        let node = nodeSelected[0];
        let id = node.data('id');
        let name = node.data('name');


        console.log(id);
        let s = prompt("Nhập điều kiện", name);
        let data = { id, name: s };
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: `${URL}/check`,
            data: JSON.stringify(data),
            dataType: "json",
            success: function (response) {
                if (response.code == 200) {
                    let currentZoom = cy.zoom();

                    node.data('name', s);

                    cy.layout({
                        name: 'preset',
                        fit: false,
                        directed: true,
                        padding: 10
                    }).run();

                    cy.zoom(currentZoom);
                }
                else {
                    alert(response.message);
                    console.log(response)
                }
            }
        });
    });

    function checkValid(s) {
        if (!s) return false;
        return true;
    }

    $('#draw-on').click(function () {
        eh.enableDrawMode();
        eh.stop();
        cy.autoungrabify(true);
    });

    $('#draw-off').click(function () {
        eh.disableDrawMode();
        eh.start(cy.$('node:selected'));
        cy.autoungrabify(false)

    });

    $('#addNode').click(function () {
        addNode();
    });

    $('#removeNode').click(function () {
        removeAllSelected();
    });

    $(document).keypress(function (e) {
        console.log(e.which);
    });

    $(document).on('keydown', function (event) {
        if (event.key === "Delete" || event.keyCode === 46) {
            removeAllSelected();
        }
    });

    $('#save').click(function () {
        let data = JSON.stringify(cy.json());
        console.log(cy.json())


        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: `${URL}/save`,
            data: data,
            dataType: "json",
            success: function (response) {
                if (response.code == 200) {
                    localStorage.setItem('savedTree', data);
                    alert(response.message);
                }
                else {
                    alert(response.message);
                }

            }
        });
    });



});
