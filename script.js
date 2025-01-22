fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const cy = cytoscape({
            container: document.getElementById('cy'), // container to render in

            elements: data,

            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#0078D7', // Light blue tone for nodes
                        'label': 'data(label)',
                        'color': '#FFA500', // Orange for text
                        'font-size': '14px',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'width': '40px',
                        'height': '40px',
                        'border-width': 3,
                        'border-color': '#2E2E2E' // Darker tone for contrast
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#4CAF50', // Green for edges
                        'target-arrow-color': '#4CAF50',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'font-size': '12px',
                        'text-rotation': 'autorotate',
                        'color': '#FFFFFF', // White for edge labels
                        'line-style': 'solid'
                    }
                },
                {
                    selector: ':selected',
                    style: {
                        'background-color': '#FF4500', // Red for selected nodes
                        'line-color': '#FF4500',
                        'target-arrow-color': '#FF4500',
                        'source-arrow-color': '#FF4500',
                        'text-outline-color': '#FF4500'
                    }
                },
                {
                    selector: '.faded',
                    style: {
                        'opacity': 0.25,
                        'text-opacity': 0.25
                    }
                }
            ],

            layout: {
                name: 'preset',
                positions: {
                    'hci': { x: 0, y: 0 },
                    'edTech': { x: -400, y: 0 },
                    'instructional': { x: -600, y: -100 },
                    'online': { x: -600, y: 0 },
                    'elearning': { x: -600, y: 100 },
                    'digitalCollection': { x: 0, y: 400 },
                    'digitalLibraries': { x: -150, y: 600 },
                    'culturalHeritage': { x: 150, y: 600 },
                    'linkedData': { x: -250, y: 500 },
                    'semanticWeb': { x: 250, y: 500 },
                    'topicModeling': { x: 400, y: 0 },
                    'healthcare': { x: 600, y: -100 },
                    'socialMedia': { x: 600, y: 0 },
                    'policy': { x: 600, y: 100 },
                    'digitalHumanities': { x: 600, y: 200 }
                },
                fit: true, // Ensures the graph fits within the viewport
                padding: 50
            }
        });

        // Highlight neighbors on node click
        cy.on('tap', 'node', function (event) {
            const node = event.target;
            const neighborhood = node.neighborhood().add(node);

            cy.elements().addClass('faded');
            neighborhood.removeClass('faded');

            cy.animate({
                fit: {
                    eles: neighborhood,
                    padding: 20
                },
                duration: 1000
            });
        });

        // Reset on background click
        cy.on('tap', function (event) {
            if (event.target === cy) {
                cy.elements().removeClass('faded');

                cy.animate({
                    fit: {
                        eles: cy.elements(),
                        padding: 50
                    },
                    duration: 1000
                });
            }
        });

        // Add hover effects for nodes
        cy.on('mouseover', 'node', function (event) {
            const node = event.target;
            node.style('font-size', '18px');
            node.style('background-color', '#00BFFF'); // Brighter blue on hover
        });

        cy.on('mouseout', 'node', function (event) {
            const node = event.target;
            node.style('font-size', '14px');
            node.style('background-color', '#0078D7');
        });
    })
    .catch(error => console.error('Error loading data:', error));
