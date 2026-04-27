package com.paiagent.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paiagent.api.entity.WorkflowEntity;

public interface WorkflowRepository extends JpaRepository<WorkflowEntity, Long> {

    List<WorkflowEntity> findAllByOrderByUpdatedAtDescIdDesc();
}
