import Graph from "graphology";
import { GraphOptions, Attributes, SerializedGraph, NodeIterationCallback, EdgeIterationCallback } from "graphology-types";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma  from "sigma";
import Events from "sigma";
import { MouseCaptorEvents } from "sigma/core/captors/mouse";
import { node, sources } from "webpack";
import { SigmaAdditionalEvents, SigmaEvents } from "sigma/sigma";


export default class GraphX {
    private container: HTMLElement;
    private instance: Graph;
    private layout: ForceSupervisor<Attributes, Attributes>;
     renderer: Sigma;

    // flags renderer
    private isDragging = false;
    private draggedNode: string | null = null;

    constructor(container:HTMLElement, options?: GraphOptions | undefined, renderSettings?: unknown) {
        this.instance = new Graph(options);
        this.container = container;
        this.render(renderSettings)
    }

    addNode(node: unknown, attributes?: Attributes | undefined): GraphX {
        this.instance.addNode(node, attributes);
        return this;
    }

    dropNode(node: unknown): GraphX {
        this.instance.dropNode(node);
        return this;
    }

    addEdge(source: unknown, target: unknown, attributes?: Attributes | undefined ): GraphX {
        this.instance.addEdge(source, target, attributes)
        return this;
    }

    addEdgeWithKey(edge: unknown, source: unknown, target: unknown): GraphX {
        this.instance.addEdgeWithKey(edge, source, target);
        return this;
    }

    dropEdge(edgeName1: string, edgeName2: string): GraphX {
        this.instance.dropEdge(edgeName1, edgeName2);
        return this;
    }

    private render(renderSettings?: unknown) {
        this.renderer = new Sigma(this.instance, this.container, renderSettings);
        this.layout = new ForceSupervisor(this.instance, { isNodeFixed: (_, attr) => attr.highlighted });
        this.layout.start();
            
    }

    clear() {
        this.instance.clear();
        return this;
    }
    clearEdges() {
        this.instance.clearEdges();
        return this;
    }

    // ITERATION  (not returning instance)
    nodes() {
        return this.instance.nodes();
    }
    forEachNode(callback: NodeIterationCallback<Attributes>) {
        return this.instance.forEachNode(callback);
    }
    filterNodes(callback: NodeIterationCallback<Attributes>) {
        return this.instance.filterNodes(callback);
    }
    mapNodes(callback: NodeIterationCallback<Attributes>) {
        return this.instance.mapNodes(callback);
    }
    edges() {
        return this.instance.edges();
    }
    forEachEdge(callback: EdgeIterationCallback<Attributes, Attributes>) {
        return this.instance.forEachEdge(callback);
    }
    filterEdges(callback: EdgeIterationCallback<Attributes, Attributes>) {
        return this.instance.filterEdges(callback);
    }
    mapEdges(callback: EdgeIterationCallback<Attributes, Attributes>) {
        return this.instance.mapEdges(callback);
    }
        
    // READ (not returning instance)

    hasNode(node: unknown): boolean {
        return this.instance.hasNode(node)
    }

    hasEdge(edge: unknown): boolean {
        return this.instance.hasEdge(edge)
    }
    
    degree(edge: unknown) {
        return this.instance.degree(edge);
    }
    inDegree(edge: unknown) {
        return this.instance.inDegree(edge);
    }
    outDegree(edge: unknown) {
        return this.instance.outDegree(edge);
    }

    source(edge: unknown) {
        return this.instance.source(edge);
    }
    target(edge: unknown) {
        return this.instance.target(edge);
    }
    hasExtremity(edge: unknown, node:unknown) {
        return this.instance.hasExtremity(edge, node);
    }

    order() {
        return this.instance.order;
    }
    getNodeAttributes(node: unknown) {
        return this.
        instance.getNodeAttributes(node);
    }

    // EVENTS
    onNodeAdded(callback: (payload: { key: string; attributes: Attributes; }) => void) {
        this.instance.on("nodeAdded", callback)
    }
    onNodeDropped(callback: (payload: { key: string; attributes: Attributes; }) => void) {
        this.instance.on("nodeDropped", callback)
    }
    onEdgeAdded(callback: (payload: { key: string; attributes: Attributes; }) => void) {
        this.instance.on("edgeAdded", callback)
    }
    onEdgeDropped(callback: (payload: { key: string; attributes: Attributes; }) => void) {
        this.instance.on("edgeDropped", callback)
    }
    onCleared(callback: () => void) {
        this.instance.on("cleared", callback)
    }

    // SERIALIZATION  (not returning instance)

    copy() {
        return this.instance.copy();
    }
    export() {
        return this.instance.export();
    }
    import(data: Partial<SerializedGraph<Attributes, Attributes, Attributes>>, merge?: boolean) {
        this.instance.import(data, merge);
    }

    toJSON() {
        return JSON.stringify(this.instance.toJSON());
    }


    // RENDER FUNCS
    getCamera() {
        return this.renderer.getCamera();
    }

    on<Event extends keyof SigmaAdditionalEvents>(eventName: Event, listener: SigmaEvents[Event]) {
        this.renderer.on(eventName, listener);

    }
    off<Event extends keyof SigmaAdditionalEvents>(eventName: Event, listener: SigmaEvents[Event]) {
        this.renderer.off(eventName, listener);
    }
    onMouseCaptor<Event extends keyof MouseCaptorEvents>(type: Event, listener:MouseCaptorEvents[Event]) {
        this.renderer.getMouseCaptor().on(type, listener);
    }
    offMouseCaptor<Event extends keyof MouseCaptorEvents>(type: Event, listener:MouseCaptorEvents[Event]) {
        this.renderer.getMouseCaptor().off(type, listener)
    }

    enableElasticAnimation() {
        // On mouse down on a node
        //  - we enable the drag mode
        //  - save in the dragged node in the state
        //  - highlight the node
        //  - disable the camera so its state is not updated
        this.renderer.on("downNode", (e) => {
            this.isDragging = true;
            this.draggedNode = e.node;
            this.instance.setNodeAttribute(this.draggedNode, "highlighted", true);
        });
        
        // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
        this.renderer.getMouseCaptor().on("mousemovebody", (e) => {
            if (!this.isDragging || !this.draggedNode) return;
        
            // Get new position of node
            const pos = this.renderer.viewportToGraph(e);
        
            this.instance.setNodeAttribute(this.draggedNode, "x", pos.x);
            this.instance.setNodeAttribute(this.draggedNode, "y", pos.y);
        
            // Prevent sigma to move camera:
            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
        });
        
        // On mouse up, we reset the autoscale and the dragging mode
        this.renderer.getMouseCaptor().on("mouseup", () => {
            if (this.draggedNode) {
                this.instance.removeNodeAttribute(this.draggedNode, "highlighted");
            }
            this.isDragging = false;
            this.draggedNode = null;
        });
        
        // Disable the autoscale at the first down interaction
        this.renderer.getMouseCaptor().on("mousedown", () => {
            if (!this.renderer.getCustomBBox()) this.renderer.setCustomBBox(this.renderer.getBBox());
        });
    }

 }