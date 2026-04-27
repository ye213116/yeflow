package com.paiagent.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paiagent.api.entity.WorkflowRunStepEntity;

public interface WorkflowRunStepRepository extends JpaRepository<WorkflowRunStepEntity, Long> {

    List<WorkflowRunStepEntity> findAllByRunIdOrderByStepOrderAsc(Long runId);
}
