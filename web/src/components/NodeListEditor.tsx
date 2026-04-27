import type { CSSProperties } from 'react';

import type { WorkflowNode, WorkflowNodeType } from '../types/workflow';

type NodeListEditorProps = {
  nodes: WorkflowNode[];
  onChange: (nodes: WorkflowNode[]) => void;
};

export function NodeListEditor({ nodes, onChange }: NodeListEditorProps) {
  const handleNodeChange = (index: number, patch: Partial<WorkflowNode>) => {
    const nextNodes = nodes.map((node, currentIndex) =>
      currentIndex === index ? { ...node, ...patch } : node
    );

    onChange(withNormalizedNodeOrder(nextNodes));
  };

  const moveNode = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex <= 0 || targetIndex >= nodes.length - 1) return;

    const nextNodes = [...nodes];
    const [node] = nextNodes.splice(index, 1);
    nextNodes.splice(targetIndex, 0, node);
    onChange(withNormalizedNodeOrder(nextNodes));
  };

  const removeNode = (index: number) => {
    if (index === 0 || index === nodes.length - 1) return;

    const nextNodes = nodes.filter((_, currentIndex) => currentIndex !== index);
    onChange(withNormalizedNodeOrder(nextNodes));
  };

  const addNode = (nodeType: Extract<WorkflowNodeType, 'LLM' | 'TTS'>) => {
    const insertIndex = Math.max(nodes.length - 1, 1);
    const nextNodes = [...nodes];
    nextNodes.splice(insertIndex, 0, {
      nodeKey: createNodeKey(nodeType, nodes),
      nodeType,
      nodeOrder: insertIndex + 1,
      config: ''
    });

    onChange(withNormalizedNodeOrder(nextNodes));
  };

  return (
    <section style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <h3 style={sectionTitleStyle}>Serial Nodes</h3>
          <p style={sectionHintStyle}>Workflow order comes from this list order, so nodeOrder stays aligned with the visual sequence.</p>
        </div>
        <div style={actionRowStyle}>
          <button style={secondaryButtonStyle} type="button" onClick={() => addNode('LLM')}>
            Add LLM
          </button>
          <button style={secondaryButtonStyle} type="button" onClick={() => addNode('TTS')}>
            Add TTS
          </button>
        </div>
      </div>

      {nodes.map((node, index) => {
        const isBoundaryNode = index === 0 || index === nodes.length - 1;
        const canMoveUp = index > 1;
        const canMoveDown = index < nodes.length - 2;
        const typeOptions: WorkflowNodeType[] = isBoundaryNode
          ? [index === 0 ? 'START' : 'END']
          : ['LLM', 'TTS'];

        return (
          <article key={`${node.nodeKey}-${index}`} style={nodeCardStyle}>
            <div style={nodeCardHeaderStyle}>
              <div>
                <p style={nodeIndexStyle}>Step {index + 1}</p>
                <h4 style={nodeTitleStyle}>{node.nodeKey || 'Unnamed node'}</h4>
              </div>
              <div style={actionRowStyle}>
                <button
                  style={iconButtonStyle}
                  type="button"
                  onClick={() => moveNode(index, -1)}
                  disabled={!canMoveUp}
                >
                  Up
                </button>
                <button
                  style={iconButtonStyle}
                  type="button"
                  onClick={() => moveNode(index, 1)}
                  disabled={!canMoveDown}
                >
                  Down
                </button>
                <button
                  style={dangerButtonStyle}
                  type="button"
                  onClick={() => removeNode(index)}
                  disabled={isBoundaryNode}
                >
                  Remove
                </button>
              </div>
            </div>

            <div style={nodeGridStyle}>
              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Node Key</span>
                <input
                  style={inputStyle}
                  type="text"
                  value={node.nodeKey}
                  onChange={(event) => handleNodeChange(index, { nodeKey: event.target.value })}
                />
              </label>

              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Node Type</span>
                <select
                  style={inputStyle}
                  value={node.nodeType}
                  onChange={(event) =>
                    handleNodeChange(index, {
                      nodeType: event.target.value as WorkflowNodeType
                    })
                  }
                  disabled={isBoundaryNode}
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Config JSON</span>
              <textarea
                style={textAreaStyle}
                rows={4}
                value={node.config ?? ''}
                onChange={(event) => handleNodeChange(index, { config: event.target.value })}
                placeholder='{"prompt":"hello"}'
              />
            </label>
          </article>
        );
      })}
    </section>
  );
}

// Frontend owns display order so users manipulate sequence through list actions instead of editing raw nodeOrder numbers.
function withNormalizedNodeOrder(nodes: WorkflowNode[]): WorkflowNode[] {
  return nodes.map((node, index) => ({
    ...node,
    nodeOrder: index + 1
  }));
}

function createNodeKey(nodeType: 'LLM' | 'TTS', nodes: WorkflowNode[]): string {
  const prefix = nodeType.toLowerCase();
  const nextIndex = nodes.filter((node) => node.nodeKey.startsWith(prefix)).length + 1;
  return `${prefix}-${nextIndex}`;
}

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 16
};

const sectionHeaderStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: 16,
  justifyContent: 'space-between'
};

const sectionTitleStyle: CSSProperties = {
  color: '#17352f',
  fontSize: 20,
  margin: 0
};

const sectionHintStyle: CSSProperties = {
  color: '#587069',
  margin: '6px 0 0'
};

const actionRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap'
};

const nodeCardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.88)',
  border: '1px solid rgba(33, 94, 79, 0.14)',
  borderRadius: 18,
  display: 'grid',
  gap: 16,
  padding: 18
};

const nodeCardHeaderStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: 16,
  justifyContent: 'space-between'
};

const nodeIndexStyle: CSSProperties = {
  color: '#7d6f59',
  fontSize: 12,
  letterSpacing: 1,
  margin: 0,
  textTransform: 'uppercase'
};

const nodeTitleStyle: CSSProperties = {
  color: '#17352f',
  margin: '4px 0 0'
};

const nodeGridStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
};

const fieldStyle: CSSProperties = {
  display: 'grid',
  gap: 8
};

const fieldLabelStyle: CSSProperties = {
  color: '#365b53',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.3
};

const inputStyle: CSSProperties = {
  background: '#fffdf9',
  border: '1px solid rgba(33, 94, 79, 0.18)',
  borderRadius: 12,
  color: '#17352f',
  fontSize: 14,
  minHeight: 44,
  padding: '10px 12px'
};

const textAreaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 110,
  resize: 'vertical'
};

const secondaryButtonStyle: CSSProperties = {
  background: '#edf7f2',
  border: '1px solid rgba(33, 94, 79, 0.16)',
  borderRadius: 999,
  color: '#1f5447',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 700,
  minHeight: 38,
  padding: '0 14px'
};

const iconButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  minWidth: 68
};

const dangerButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  background: '#fff1ef',
  color: '#a13b31'
};
