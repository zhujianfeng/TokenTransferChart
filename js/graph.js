function initContainer() {
    const wrapper = document.getElementById('wrapperContent');
    const wrapperPlace = wrapper.parentElement.parentElement.nextElementSibling;
    const parent = wrapperPlace.parentElement;
    const container = document.createElement('div');
    container.className = 'row';
    container.style.height = '600px';
    parent.insertBefore(container, wrapperPlace);
    return container;
}

function formatData(data) {
    console.log(data);
    const nodesMap = new Map();
    const nodes = [];
    let isFirst = true;
    data.forEach((e) => {
        [e.from, e.to].forEach((node) => {
            if(!nodesMap.get(node.address)) {
                let nodeType = CONSTANT.NodeTypeEllipse;
                let bgColor = CONSTANT.NodeColorEllipse;
                if (isFirst) {
                    nodeType = CONSTANT.NodeTypeStar;
                    bgColor = CONSTANT.NodeColorStar;
                    isFirst = false;
                } else {
                    if (node.type === CONSTANT.AccountTypeSwap) {
                        nodeType = CONSTANT.NodeTypeRectangle;
                        bgColor = CONSTANT.NodeColorRectangle;
                    }
                }
                
                const data = {
                    id: node.address,
                    label: node.nickName,
                    href: node.href,
                    type: nodeType,
                    bgColor: bgColor
                };
                nodesMap.set(node.address, data);
            }
        });
    });
    for(let node of nodesMap.values()) {
        nodes.push({data: node});
    }

    const edges = [];
    data.forEach((e, i) => {
        i = i + 1;
        const data = {
            source: e.from.address,
            target: e.to.address,
            label: '( ' + i + ' )\n' + e.value.number + ' ' + e.token + '\n' + e.value.usd
        };
        edges.push({data: data});
    });

    return {
        nodes: nodes,
        edges: edges
    }

}

function drawGraph(data) {
    const elementsData = formatData(data);
    const cy = cytoscape({
        container: initContainer(),
        style: cytoscape.stylesheet()
            .selector('node')
                .css({
                    'content': 'data(label)',
                    'shape': 'data(type)',
                    'background-color': 'data(bgColor)',
                    'color': '#12161c'
                })
            .selector('edge')
                .css({
                    'label':'data(label)',
                    'text-wrap': 'wrap',
                    'curve-style': 'bezier',
                    'control-point-distance': 60,
                    'width': 2,
                    'target-arrow-shape': 'triangle',
                    'color':'#666',
                    'line-color': '#777',
                    'target-arrow-color': '#777'
                }),
        elements: elementsData,
        layout: {
            name: 'circle',
            fit: true
            //padding: 30
        }
    });
}