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
                        'color': '#FFFFFF' // White for edge labels
                    }
                }
            ],

            layout: {
                name: 'preset',
                positions: {
                    'hci': { x: 0, y: 0 }, // Central node
                    'edTech': { x: -400, y: 0 }, // Left of HCI
                    'instructional': { x: -600, y: -100 }, // Top-left of Educational Technology
                    'online': { x: -600, y: 0 }, // Left of Educational Technology
                    'elearning': { x: -600, y: 100 }, // Bottom-left of Educational Technology
                    'digitalCollection': { x: 0, y: 400 }, // Below HCI
                    'digitalLibraries': { x: -150, y: 600 }, // Bottom-left of Digital Collection
                    'culturalHeritage': { x: 150, y: 600 }, // Bottom-right of Digital Collection
                    'linkedData': { x: -300, y: 500 }, // Far-left of Digital Collection
                    'semanticWeb': { x: 300, y: 500 }, // Far-right of Digital Collection
                    'topicModeling': { x: 400, y: 0 }, // Right of HCI
                    'healthcare': { x: 600, y: -100 }, // Top-right of Topic Modeling
                    'socialMedia': { x: 600, y: 0 }, // Right of Topic Modeling
                    'policy': { x: 600, y: 100 }, // Bottom-right of Topic Modeling
                    'digitalHumanities': { x: 600, y: 200 } // Far-bottom-right of Topic Modeling
                },
                fit: true,
                padding: 50
            }
        });

        // Highlight neighbors, display images, and zoom into the node with its neighborhood
        cy.on('tap', 'node', function (event) {
            const node = event.target;
            const neighborhood = node.neighborhood().add(node); // Get the node and its immediate neighbors
            const label = node.data('label');
            const images = node.data('images'); // Array of images

            // Update the HTML content with the node info
            const nodeInfoDiv = document.getElementById('node-info');
            const nodeImagesDiv = document.getElementById('node-images');
            const nodeLabel = document.getElementById('node-label');

            nodeImagesDiv.innerHTML = '';
            if (images && images.length > 0) {
                images.forEach((imageSrc) => {
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = label;
                    img.classList.add('hidden');
                    nodeImagesDiv.appendChild(img);
                    setTimeout(() => img.classList.remove('hidden'), 50);
                });
            } else {
                nodeImagesDiv.innerHTML = '<p>No images available</p>';
            }

            nodeLabel.textContent = label;

            // Reset and add fade-in effect for the node-info div
            nodeInfoDiv.style.display = 'block';
            setTimeout(() => nodeInfoDiv.classList.add('show'), 10);

            // Zoom into the node and its neighborhood
            cy.animate({
                fit: {
                    eles: neighborhood,
                    padding: 100 // Wider padding to include subnodes
                },
                duration: 1000
            });
        });

        // Reset on background click and zoom out to show all nodes
        cy.on('tap', function (event) {
            if (event.target === cy) {
                const nodeInfoDiv = document.getElementById('node-info');
                nodeInfoDiv.classList.remove('show');
                setTimeout(() => (nodeInfoDiv.style.display = 'none'), 500);

                cy.animate({
                    fit: {
                        eles: cy.elements(),
                        padding: 50
                    },
                    duration: 1000
                });
            }
        });
    })
    .catch(error => console.error('Error loading data:', error));
