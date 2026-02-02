import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { GraphData, GraphNode, GraphLink, SECTION_COLORS } from '@/types';
import { api } from '@/api';

interface GraphViewProps {
  onNodeClick?: (nodeId: string) => void;
}

export default function GraphView({ onNodeClick }: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    try {
      setLoading(true);
      const data = await api.getGraphData();
      setGraphData(data);
    } catch (error) {
      console.error('Failed to load graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || graphData.nodes.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(graphData.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(graphData.links)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + 5));

    simulationRef.current = simulation;

    // Create links
    const link = g.append('g')
      .attr('stroke', '#3d3d3d')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke-width', 1.5);

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => SECTION_COLORS[d.section as keyof typeof SECTION_COLORS] || '#666')
      .attr('stroke', '#1a1a1a')
      .attr('stroke-width', 2)
      .on('click', (event, d) => {
        onNodeClick?.(d.id);
      });

    // Add labels to nodes
    node.append('text')
      .text(d => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title)
      .attr('x', d => d.radius + 5)
      .attr('y', 4)
      .attr('fill', '#e0e0e0')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, onNodeClick]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .call(d3.zoom<SVGSVGElement, unknown>().transform, 
          d3.zoomTransform(svgRef.current).scale(1.3));
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .call(d3.zoom<SVGSVGElement, unknown>().transform, 
          d3.zoomTransform(svgRef.current).scale(0.7));
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
    }
    simulationRef.current?.alpha(1).restart();
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-obsidian-500">
        Loading graph...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative bg-obsidian-950">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={handleZoomIn}
          className="p-2 bg-obsidian-800 rounded-lg text-obsidian-300 hover:bg-obsidian-700"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-obsidian-800 rounded-lg text-obsidian-300 hover:bg-obsidian-700"
        >
          <ZoomOut size={20} />
        </button>
        <button 
          onClick={handleReset}
          className="p-2 bg-obsidian-800 rounded-lg text-obsidian-300 hover:bg-obsidian-700"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-obsidian-900/90 backdrop-blur rounded-lg p-3 z-10">
        <h3 className="text-sm font-medium mb-2">Sections</h3>
        <div className="space-y-1">
          {Object.entries(SECTION_COLORS).map(([section, color]) => (
            <div key={section} className="flex items-center gap-2 text-xs">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-obsidian-300">{section}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="absolute top-4 left-4 bg-obsidian-900/90 backdrop-blur rounded-lg p-3 z-10">
        <h2 className="text-lg font-semibold">Graph View</h2>
        <p className="text-sm text-obsidian-400">
          {graphData.nodes.length} notes • {graphData.links.length} connections
        </p>
        <p className="text-xs text-obsidian-500 mt-1">
          Drag nodes to rearrange • Click to open note
        </p>
      </div>

      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}