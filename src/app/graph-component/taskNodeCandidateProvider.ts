import {
    DefaultPortCandidate, IGraph,
    IInputModeContext, INode, IPort,
    IPortCandidate, List,
    PortCandidateProviderBase,
    PortCandidateValidity
} from "yfiles";

export default class TaskNodeCandidateProvider extends PortCandidateProviderBase {
    private readonly node:INode;
    private readonly inCount: number;
    private readonly outCount: number;

    constructor(node: INode, inCount: number, outCount: number) {
        super();
        this.node = node;
        this.inCount = inCount;
        this.outCount = outCount;
    }

    getTargetPortCandidates(context: IInputModeContext, source: IPortCandidate): List<IPortCandidate> {
        let candidates = new List<IPortCandidate>();
        let graph : IGraph | null = context.graph;
            this.node.ports.forEach((port:IPort) => {
                if (graph != null) {
                let portCandidate: IPortCandidate = new DefaultPortCandidate(port);
                portCandidate.validity = (graph.inDegree(this.node) < this.inCount) ? PortCandidateValidity.VALID : PortCandidateValidity.INVALID;
                candidates.add(portCandidate);
                }
            });
        return candidates;
    }

    getPortCandidates(context: IInputModeContext): List<IPortCandidate> {
        const candidates = new List<IPortCandidate>();
        this.addExistingPorts(this.node, candidates);
        if (context.graph != null && context.graph.outDegree(this.node) < this.outCount) {
            return candidates;
        }
        // @ts-ignore
        return null;
    }
}