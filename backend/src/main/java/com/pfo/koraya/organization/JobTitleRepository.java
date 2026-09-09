package com.pfo.koraya.organization;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JobTitleRepository extends JpaRepository<JobTitle, UUID> {

    Optional<JobTitle> findByTitleIgnoreCase(String title);
}
