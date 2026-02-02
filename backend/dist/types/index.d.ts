export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    section: string;
    createdAt: Date;
    updatedAt: Date;
    links: string[];
}
export interface NoteMetadata {
    id: string;
    title: string;
    tags: string[];
    section: string;
    createdAt: Date;
    updatedAt: Date;
    linkCount: number;
}
export interface GraphNode {
    id: string;
    title: string;
    section: string;
    radius: number;
}
export interface GraphLink {
    source: string;
    target: string;
}
export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}
//# sourceMappingURL=index.d.ts.map