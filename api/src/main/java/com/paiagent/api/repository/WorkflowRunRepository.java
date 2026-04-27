package com.paiagent.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paiagent.api.entity.WorkflowRunEntity;

public interface WorkflowRunRepository extends JpaRepository<WorkflowRunEntity, Long> {
}
