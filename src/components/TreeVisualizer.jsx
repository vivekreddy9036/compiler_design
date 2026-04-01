import React, { useMemo } from 'react';
import '../styles/tree-visualizer.css';

export default function TreeVisualizer({ parseTree, treeData }) {
  const svgRef = React.useRef(null);

  const { nodes, lines, dimensions } = useMemo(() => {
    if (!treeData) return { nodes: [], lines: [], dimensions: { width: 600, height: 400 } };

    let nodeCounter = 0;
    const nodes = [];
    const lines = [];
    
    // Calculate tree depth and width
    const getDepth = (node) => {
      if (!node.children || node.children.length === 0) return 1;
      return 1 + Math.max(...node.children.map(getDepth));
    };

    const getLeafCount = (node) => {
      if (!node.children || node.children.length === 0) return 1;
      return node.children.reduce((sum, child) => sum + getLeafCount(child), 0);
    };

    const depth = getDepth(treeData);
    const leafCount = getLeafCount(treeData);
    const width = Math.max(800, leafCount * 120);
    const height = depth * 120 + 60;

    const nodeRadius = 28;

    // Position nodes using level-order positioning
    const positionNode = (node, x, y, nodeIdMap) => {
      const nodeId = `node-${nodeCounter++}`;
      nodes.push({ id: nodeId, x, y, label: node.label });
      nodeIdMap.set(node, { x, y, id: nodeId });

      if (node.children && node.children.length > 0) {
        const childCount = node.children.length;
        const childSpacing = 100;
        const startX = x - (childCount - 1) * childSpacing / 2;

        node.children.forEach((child, idx) => {
          const childX = startX + idx * childSpacing;
          const childY = y + 120;

          // Draw line from parent to child
          lines.push({
            x1: x,
            y1: y + nodeRadius,
            x2: childX,
            y2: childY - nodeRadius
          });

          positionNode(child, childX, childY, nodeIdMap);
        });
      }
    };

    const nodeIdMap = new Map();
    positionNode(treeData, width / 2, 40, nodeIdMap);

    return {
      nodes,
      lines,
      dimensions: { width, height }
    };
  }, [treeData]);

  if (!treeData || nodes.length === 0) {
    return <div className="tree-visualizer-empty">Parse tree will appear here</div>;
  }

  return (
    <div className="tree-visualizer-container">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="tree-svg"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Draw lines first (behind nodes) */}
        {lines.map((line, idx) => (
          <line
            key={`line-${idx}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="tree-edge"
          />
        ))}

        {/* Draw nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={28}
              className="tree-node"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="tree-label"
            >
              {node.label.length > 12 ? node.label.substring(0, 10) + '.' : node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
