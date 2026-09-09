package com.pfo.koraya.organization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobTitleService {

    private final JobTitleRepository jobTitleRepository;

    public List<JobTitle> findAllActive() {
        return jobTitleRepository.findAll().stream()
                .filter(JobTitle::isActive)
                .toList();
    }

    /**
     * Retourne le poste existant (recherche insensible a la casse),
     * ou le cree a la volee si aucun ne correspond.
     */
    @Transactional
    public JobTitle getOrCreate(String title, UUID createdBy) {
        String trimmed = title.trim();
        return jobTitleRepository.findByTitleIgnoreCase(trimmed)
                .orElseGet(() -> {
                    JobTitle jobTitle = new JobTitle();
                    jobTitle.setTitle(trimmed);
                    jobTitle.setCreatedBy(createdBy);
                    return jobTitleRepository.save(jobTitle);
                });
    }
}
