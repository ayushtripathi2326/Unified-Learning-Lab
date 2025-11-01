import React, { useState, useRef, useEffect } from 'react';
import './Graph.css';

function Graph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeName, setNodeName] = useState('');
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [weight, setWeight] = useState('1');
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [visitedEdges, setVisitedEdges] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode, visitedNodes, visitedEdges]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#1976d2';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${isDirected ? 'Directed' : 'Undirected'} ${isWeighted ? 'Weighted' : ''} Graph`,
      canvas.width / 2,
      30
    );

    // Draw edges first (so they appear behind nodes)
    edges.forEach((edge, idx) => {
      const fromNodeObj = nodes.find(n => n.name === edge.from);
      const toNodeObj = nodes.find(n => n.name === edge.to);

      if (fromNodeObj && toNodeObj) {
        const isVisited = visitedEdges.some(
          e => (e.from === edge.from && e.to === edge.to) ||
               (!isDirected && e.from === edge.to && e.to === edge.from)
        );

        // Calculate edge positions
        const dx = toNodeObj.x - fromNodeObj.x;
        const dy = toNodeObj.y - fromNodeObj.y;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Adjust start and end points to be at edge of circles
        const radius = 25;
        const startX = fromNodeObj.x + radius * Math.cos(angle);
        const startY = fromNodeObj.y + radius * Math.sin(angle);
        const endX = toNodeObj.x - radius * Math.cos(angle);
        const endY = toNodeObj.y - radius * Math.sin(angle);

        // Draw edge line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = isVisited ? '#4caf50' : '#757575';
        ctx.lineWidth = isVisited ? 4 : 2;
        ctx.stroke();

        // Draw arrow for directed graphs
        if (isDirected) {
          const arrowSize = 12;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = isVisited ? '#4caf50' : '#757575';
          ctx.fill();
        }

        // Draw weight if weighted
        if (isWeighted) {
          const midX = (fromNodeObj.x + toNodeObj.x) / 2;
          const midY = (fromNodeObj.y + toNodeObj.y) / 2;

          // Background circle for weight
          ctx.beginPath();
          ctx.arc(midX, midY, 15, 0, 2 * Math.PI);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.strokeStyle = '#ff9800';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Weight text
          ctx.fillStyle = '#ff9800';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.weight || '1', midX, midY);
        }
      }
    });

    // Draw nodes
    nodes.forEach((node, idx) => {
      const isSelected = selectedNode === node.name;
      const isVisited = visitedNodes.includes(node.name);

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#ff9800' : isVisited ? '#4caf50' : '#2196f3';
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#f57c00' : isVisited ? '#388e3c' : '#1565c0';
      ctx.lineWidth = isSelected ? 4 : 3;
      ctx.stroke();

      // Draw node name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, node.x, node.y);

      // Draw glow effect if selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 152, 0, 0.3)';
        ctx.lineWidth = 8;
        ctx.stroke();
      }
    });

    // Draw legend
    if (nodes.length > 0) {
      const legendX = 20;
      const legendY = canvas.height - 80;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(legendX, legendY, 180, 70);
      ctx.strokeStyle = '#1976d2';
      ctx.lineWidth = 2;
      ctx.strokeRect(legendX, legendY, 180, 70);

      ctx.font = '12px Arial';
      ctx.textAlign = 'left';

      // Unvisited node
      ctx.beginPath();
      ctx.arc(legendX + 15, legendY + 20, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#2196f3';
      ctx.fill();
      ctx.fillStyle = '#424242';
      ctx.fillText('Unvisited Node', legendX + 30, legendY + 23);

      // Visited node
      ctx.beginPath();
      ctx.arc(legendX + 15, legendY + 45, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#4caf50';
      ctx.fill();
      ctx.fillStyle = '#424242';
      ctx.fillText('Visited Node', legendX + 30, legendY + 48);
    }
  };

  const addNode = () => {
    if (nodeName.trim() && !nodes.find(n => n.name === nodeName.trim())) {
      const newNode = {
        name: nodeName.trim(),
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 300
      };
      setNodes([...nodes, newNode]);
      setNodeName('');
    } else if (nodes.find(n => n.name === nodeName.trim())) {
      alert('Node already exists!');
    }
  };

  const addEdge = () => {
    if (fromNode && toNode) {
      if (!nodes.find(n => n.name === fromNode)) {
        alert('From node does not exist!');
        return;
      }
      if (!nodes.find(n => n.name === toNode)) {
        alert('To node does not exist!');
        return;
      }
      if (fromNode === toNode) {
        alert('Cannot create self-loop!');
        return;
      }

      const edgeExists = edges.find(
        e => (e.from === fromNode && e.to === toNode) ||
             (!isDirected && e.from === toNode && e.to === fromNode)
      );

      if (edgeExists) {
        alert('Edge already exists!');
        return;
      }

      const newEdge = {
        from: fromNode,
        to: toNode,
        weight: isWeighted ? (parseInt(weight) || 1) : 1
      };
      setEdges([...edges, newEdge]);
      setFromNode('');
      setToNode('');
      setWeight('1');
    }
  };

  const removeNode = (nodeName) => {
    setNodes(nodes.filter(n => n.name !== nodeName));
    setEdges(edges.filter(e => e.from !== nodeName && e.to !== nodeName));
    if (selectedNode === nodeName) setSelectedNode(null);
  };

  const removeEdge = (from, to) => {
    setEdges(edges.filter(e => !(e.from === from && e.to === to)));
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setVisitedNodes([]);
    setVisitedEdges([]);
    setSelectedNode(null);
  };

  const getAdjacencyList = () => {
    const adjList = {};
    nodes.forEach(node => {
      adjList[node.name] = [];
    });
    edges.forEach(edge => {
      adjList[edge.from].push({ node: edge.to, weight: edge.weight });
      if (!isDirected) {
        adjList[edge.to].push({ node: edge.from, weight: edge.weight });
      }
    });
    return adjList;
  };

  const bfs = async (startNode) => {
    if (!nodes.find(n => n.name === startNode)) {
      alert('Start node does not exist!');
      return;
    }

    setVisitedNodes([]);
    setVisitedEdges([]);

    const adjList = getAdjacencyList();
    const visited = new Set();
    const queue = [startNode];
    visited.add(startNode);

    const visitedNodesArray = [startNode];
    const visitedEdgesArray = [];

    while (queue.length > 0) {
      const current = queue.shift();
      setSelectedNode(current);
      await sleep(800);

      for (const neighbor of adjList[current]) {
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          queue.push(neighbor.node);
          visitedNodesArray.push(neighbor.node);
          visitedEdgesArray.push({ from: current, to: neighbor.node });

          setVisitedNodes([...visitedNodesArray]);
          setVisitedEdges([...visitedEdgesArray]);
          await sleep(800);
        }
      }
    }

    setSelectedNode(null);
    alert(`BFS Complete! Visited ${visitedNodesArray.length} nodes`);
  };

  const dfs = async (startNode) => {
    if (!nodes.find(n => n.name === startNode)) {
      alert('Start node does not exist!');
      return;
    }

    setVisitedNodes([]);
    setVisitedEdges([]);

    const adjList = getAdjacencyList();
    const visited = new Set();
    const visitedNodesArray = [];
    const visitedEdgesArray = [];

    const dfsHelper = async (node, parent = null) => {
      visited.add(node);
      visitedNodesArray.push(node);
      setVisitedNodes([...visitedNodesArray]);
      setSelectedNode(node);

      if (parent) {
        visitedEdgesArray.push({ from: parent, to: node });
        setVisitedEdges([...visitedEdgesArray]);
      }

      await sleep(800);

      for (const neighbor of adjList[node]) {
        if (!visited.has(neighbor.node)) {
          await dfsHelper(neighbor.node, node);
        }
      }
    };

    await dfsHelper(startNode);
    setSelectedNode(null);
    alert(`DFS Complete! Visited ${visitedNodesArray.length} nodes`);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 25;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.name);
      setFromNode(clickedNode.name);
    }
  };

  const createSampleGraph = () => {
    const sampleNodes = [
      { name: 'A', x: 200, y: 150 },
      { name: 'B', x: 400, y: 100 },
      { name: 'C', x: 400, y: 250 },
      { name: 'D', x: 600, y: 150 },
      { name: 'E', x: 500, y: 350 }
    ];

    const sampleEdges = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 10 },
      { from: 'D', to: 'E', weight: 6 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setVisitedNodes([]);
    setVisitedEdges([]);
  };

  return (
    <div className="graph-page">
      <div className="page-header">
        <h2>🌐 Graph Visualizer</h2>
        <p className="page-subtitle">Explore graphs with nodes, edges, and traversal algorithms</p>
      </div>

      <div className="graph-controls">
        <div className="control-section">
          <h3>⚙️ Graph Configuration</h3>
          <div className="graph-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isDirected}
                onChange={(e) => setIsDirected(e.target.checked)}
              />
              <span>Directed Graph</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isWeighted}
                onChange={(e) => setIsWeighted(e.target.checked)}
              />
              <span>Weighted Graph</span>
            </label>
          </div>
        </div>

        <div className="control-section">
          <h3>➕ Add Node</h3>
          <div className="controls">
            <input
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Node name (A, B, C...)"
              onKeyPress={(e) => e.key === 'Enter' && addNode()}
              maxLength="3"
            />
            <button onClick={addNode} className="btn btn-add">Add Node</button>
          </div>
        </div>

        <div className="control-section">
          <h3>🔗 Add Edge</h3>
          <div className="controls">
            <input
              value={fromNode}
              onChange={(e) => setFromNode(e.target.value)}
              placeholder="From node"
              list="node-list-from"
            />
            <datalist id="node-list-from">
              {nodes.map(node => <option key={node.name} value={node.name} />)}
            </datalist>

            <input
              value={toNode}
              onChange={(e) => setToNode(e.target.value)}
              placeholder="To node"
              list="node-list-to"
            />
            <datalist id="node-list-to">
              {nodes.map(node => <option key={node.name} value={node.name} />)}
            </datalist>

            {isWeighted && (
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
                min="1"
                style={{ width: '80px' }}
              />
            )}
            <button onClick={addEdge} className="btn btn-connect">Add Edge</button>
          </div>
        </div>

        <div className="control-section">
          <h3>🔍 Graph Traversal</h3>
          <div className="controls">
            <input
              placeholder="Start node for traversal"
              value={selectedNode || ''}
              onChange={(e) => setSelectedNode(e.target.value)}
              list="node-list-traversal"
            />
            <datalist id="node-list-traversal">
              {nodes.map(node => <option key={node.name} value={node.name} />)}
            </datalist>

            <button
              onClick={() => bfs(selectedNode)}
              className="btn btn-bfs"
              disabled={nodes.length === 0 || !selectedNode}
            >
              BFS
            </button>
            <button
              onClick={() => dfs(selectedNode)}
              className="btn btn-dfs"
              disabled={nodes.length === 0 || !selectedNode}
            >
              DFS
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>🎨 Actions</h3>
          <div className="controls">
            <button onClick={createSampleGraph} className="btn btn-sample">
              Load Sample
            </button>
            <button
              onClick={() => {
                setVisitedNodes([]);
                setVisitedEdges([]);
                setSelectedNode(null);
              }}
              className="btn btn-reset"
            >
              Reset Traversal
            </button>
            <button onClick={clearGraph} className="btn btn-clear">
              Clear Graph
            </button>
          </div>
        </div>
      </div>

      <div className="canvas-visualization">
        <h3>🎨 Graph Canvas</h3>
        <p className="canvas-hint">Click on nodes to select them. Drag to reposition (coming soon).</p>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            onClick={handleCanvasClick}
            style={{
              border: '3px solid #1976d2',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      <div className="graph-info">
        <div className="info-grid">
          <div className="info-card">
            <h4>📊 Graph Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Nodes:</span>
              <span className="stat-value">{nodes.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Edges:</span>
              <span className="stat-value">{edges.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Type:</span>
              <span className="stat-value">
                {isDirected ? 'Directed' : 'Undirected'}
                {isWeighted ? ' Weighted' : ''}
              </span>
            </div>
          </div>

          <div className="info-card">
            <h4>📝 Nodes List</h4>
            <div className="nodes-list">
              {nodes.length === 0 ? (
                <p className="empty-text">No nodes yet</p>
              ) : (
                nodes.map(node => (
                  <div key={node.name} className="node-item">
                    <span className="node-label">{node.name}</span>
                    <button
                      onClick={() => removeNode(node.name)}
                      className="btn-remove"
                      title="Remove node"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="info-card">
            <h4>🔗 Edges List</h4>
            <div className="edges-list">
              {edges.length === 0 ? (
                <p className="empty-text">No edges yet</p>
              ) : (
                edges.map((edge, idx) => (
                  <div key={idx} className="edge-item">
                    <span className="edge-label">
                      {edge.from} {isDirected ? '→' : '↔'} {edge.to}
                      {isWeighted && ` (${edge.weight})`}
                    </span>
                    <button
                      onClick={() => removeEdge(edge.from, edge.to)}
                      className="btn-remove"
                      title="Remove edge"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Graph Algorithms</h3>
        <div className="algorithms-grid">
          <div className="algorithm-card">
            <h4>BFS (Breadth-First Search)</h4>
            <p>Explores graph level by level using a queue</p>
            <span className="complexity">Time: O(V + E)</span>
          </div>
          <div className="algorithm-card">
            <h4>DFS (Depth-First Search)</h4>
            <p>Explores as far as possible along each branch</p>
            <span className="complexity">Time: O(V + E)</span>
          </div>
          <div className="algorithm-card">
            <h4>Dijkstra's Algorithm</h4>
            <p>Finds shortest path in weighted graphs</p>
            <span className="complexity">Time: O(V²) or O(E log V)</span>
          </div>
          <div className="algorithm-card">
            <h4>Graph Coloring</h4>
            <p>Assigns colors to nodes with no adjacent same colors</p>
            <span className="complexity">NP-Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Graph;
