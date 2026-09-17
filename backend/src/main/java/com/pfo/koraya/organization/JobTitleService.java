package com.pfo.koraya.organization;

import jakarta.persistence.EntityNotFoundException;
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

    public List<JobTitle> findAll() {
        return jobTitleRepository.findAll();
    }

    public JobTitle findById(UUID id) {
        return jobTitleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Poste introuvable"));
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

    @Transactional
    public JobTitle create(String title, UUID createdBy) {
        String trimmed = title.trim();
        if (jobTitleRepository.findByTitleIgnoreCase(trimmed).isPresent()) {
            throw new IllegalStateException("Ce poste existe deja");
        }
        JobTitle jobTitle = new JobTitle();
        jobTitle.setTitle(trimmed);
        jobTitle.setCreatedBy(createdBy);
        return jobTitleRepository.save(jobTitle);
    }

    @Transactional
    public JobTitle update(UUID id, String title, boolean active) {
        JobTitle jobTitle = findById(id);
        jobTitle.setTitle(title.trim());
        jobTitle.setActive(active);
        return jobTitleRepository.save(jobTitle);
    }

    @Transactional
    public void deactivate(UUID id) {
        JobTitle jobTitle = findById(id);
        jobTitle.setActive(false);
        jobTitleRepository.save(jobTitle);
    }
}
