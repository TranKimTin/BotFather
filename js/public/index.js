$(document).ready(function () {
    const URL = '';
    let botName = $.cookie("botName") || '';
    $('#botName').val(botName);


    var treeData = { elements: { nodes: [], edges: [] } };

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: `${URL}/getSymbolList`,
        data: "",
        dataType: "json",
        success: function (response) {
            console.log(response)
            if (response.code == 200) {
                $('#symbolList').empty();
                let symbolList = response.data;
                for (let symbol of symbolList) {
                    $('#symbolList').append($('<option>', {
                        value: symbol,
                        text: symbol
                    }));
                }
                $('#symbolList').selectpicker('refresh');
                loadData(botName);
            }
            else {
                alert('Lỗi');
            }
        }
    });

    if (treeData.elements.nodes.filter(item => item.id != 'start').length == 0) {
        treeData.elements.nodes.push({ data: { id: 'start', name: 'Start' }, position: { x: 100, y: 100 } });
    }

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
        },
        zoomingEnabled: true,
        maxZoom: 3,
        minZoom: 0.3
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

    $('#removeBot').click(function () {
        let botName = $('#botName').val();
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: `${URL}/delete?botName=${botName}`,
            data: [],
            dataType: "json",
            success: function (response) {
                alert(response.message);
                $.cookie("botName", '');
                window.location.reload();
            }
        });
    });

    $(document).on('keydown', function (event) {
        if (event.key === "Delete" || event.keyCode === 46) {
            removeAllSelected();
        }
    });

    $('#save').click(function () {
        let idTelegram = $('#idTelegram').val();
        let timeframes = $('#timeframes').val() || [];
        let symbolList = $('#symbolList').val() || [];
        let botName = $('#botName').val();
        let data = {
            treeData: cy.json(),
            idTelegram,
            timeframes,
            symbolList,
            botName
        };

        console.log(JSON.stringify(data))


        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: `${URL}/save`,
            data: JSON.stringify(data),
            dataType: "json",
            success: function (response) {
                if (response.code == 200) {
                    alert(response.message);
                    $.cookie("botName", data.botName);
                }
                else {
                    alert(response.message);
                }

            }
        });
    });

    function loadData(botName) {
        if (!botName) return;
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: `${URL}/getBotInfo?botName=${botName}`,
            data: "",
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response.code == 200) {
                    let { idTelegram, timeframes, treeData, symbolList } = response.data;
                    $('#idTelegram').val(idTelegram);
                    $('#timeframes').val(timeframes);
                    $('#symbolList').val(symbolList);
                    $('#timeframes').selectpicker('refresh');
                    $('#symbolList').selectpicker('refresh');
                    if (treeData.elements.nodes.filter(item => item.id != 'start').length == 0) {
                        treeData.elements.nodes.push({ data: { id: 'start', name: 'Start' }, position: { x: 100, y: 100 } });
                    }
                    cy.json(treeData);
                }
                else {
                    alert('có lỗi');
                }
            },
            error: function (request, status, error) {
                alert("có lỗi");
            }
        });
    }

    $('#botName').on('keydown', function (event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            let botName = $('#botName').val();
            loadData(botName);
        }, 500);
    });

    $('#toogleAllSymbolBinance').click(function () {
        toogleAllSymbol('binance');
    });

    $('#toogleAllSymbolOkx').click(function () {
        toogleAllSymbol('okx');
    });

    $('#toogleAllSymbolBybit').click(function () {
        toogleAllSymbol('bybit');
    });

    function toogleAllSymbol(broker) {
        this.temp = this.temp || {};
        this.temp[broker] = this.temp[broker] || 1;


        let symbolList = $('#symbolList option').map(function () {
            return this.value;
        }).get();
        let selectedList = $('#symbolList').val() || [];

        if (symbolList.length == 0) {
            alert('Đang load, chờ 1 tí');
            return;
        }


        console.log(selectedList);
        selectedList = selectedList.filter(item => !item.startsWith(broker));
        if (this.temp[broker]++ % 2) {
            $('#symbolList').selectpicker('selectAll');
            selectedList.push(...symbolList.filter(item => item.startsWith(broker)));
            alert(`Chọn toàn bộ coin ${broker} (${selectedList.length} coin)`);
            console.log(symbolList)
        }
        else {
            alert(`Bỏ toàn bộ coin ${broker} (${selectedList.length} coin)`);
        }
        $('#symbolList').selectpicker('toggle');
        $('#symbolList').val(selectedList);
        $('#symbolList').selectpicker('refresh');
    }

    $('#filterDuplicate').click(function () {
        let symbolList = $('#symbolList').val() || [];
        symbolList = symbolList.map(item => item.split(':')).map(item => ({ broker: item[0], symbol: item[1] }));

        for (let i = 0; i < symbolList.length; i++) {
            if (!symbolList[i]) continue;
            let { symbol, broker } = symbolList[i];
            if (broker === 'bybit') {
                for (let item of symbolList) {
                    if (!item) continue;
                    if (item.symbol.replace('-', '') === symbol && (item.broker === 'binance' || item.broker === 'okx')) {
                        symbolList[i] = null;
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < symbolList.length; i++) {
            if (!symbolList[i]) continue;
            let { symbol, broker } = symbolList[i];
            if (broker === 'okx') {
                for (let item of symbolList) {
                    if (!item) continue;
                    if (item.symbol === symbol.replace('-', '') && item.broker === 'binance') {
                        symbolList[i] = null;
                        break;
                    }
                }
            }
        }
        symbolList = symbolList.filter(item => item).map(item => `${item.broker}:${item.symbol}`);
        $('#symbolList').val(symbolList);
        alert(`Đã lọc coin trùng nhau (${symbolList.length} coin)`);
    });

    function getBotList() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: `${URL}/getBotList`,
            data: "",
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response.code == 200) {
                    $("#botName").autocomplete({
                        source: response.data,
                        minLength: 0
                    }).focus(function () {
                        // Bất kỳ khi nào trường này nhận focus, ngay cả khi không có nhập liệu
                        $(this).autocomplete("search", "");
                    });;
                }
                else {
                    alert('có lỗi');
                }
            }
        });
    }
    getBotList();
});
