package com.paiagent.api.entity;

import com.paiagent.api.domain.workflow.WorkflowNodeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "workflow_node",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_workflow_node_key", columnNames = {"workflow_id", "node_key"}),
                @UniqueConstraint(name = "uk_workflow_node_order", columnNames = {"workflow_id", "node_order"})
        })
public class WorkflowNodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private WorkflowEntity workflow;

    @Column(name = "node_key", nullable = false, length = 120)
    private String nodeKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "node_type", nullable = false, length = 20)
    private WorkflowNodeType nodeType;

    @Column(name = "node_order", nullable = false)
    private Integer nodeOrder;

    @Column(name = "config_json", length = 4000)
    private String configJson;

    public Long getId() {
        return id;
    }

    public WorkflowEntity getWorkflow() {
        return workflow;
    }

    public void setWorkflow(WorkflowEntity workflow) {
        this.workflow = workflow;
    }

    public String getNodeKey() {
        return nodeKey;
    }

    public void setNodeKey(String nodeKey) {
        this.nodeKey = nodeKey;
    }

    public WorkflowNodeType getNodeType() {
        return nodeType;
    }

    public void setNodeType(WorkflowNodeType nodeType) {
        this.nodeType = nodeType;
    }

    public Integer getNodeOrder() {
        return nodeOrder;
    }

    public void setNodeOrder(Integer nodeOrder) {
        this.nodeOrder = nodeOrder;
    }

    public String getConfigJson() {
        return configJson;
    }

    public void setConfigJson(String configJson) {
        this.configJson = configJson;
    }
}
