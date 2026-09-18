package com.pfo.koraya.organization;

import com.pfo.koraya.audit.AuditLogService;
import com.pfo.koraya.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobTitleService {

    private final JobTitleRepository jobTitleRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public List<JobTitle> findAllActive() {
        return jobTitleRepository.findAll().stream()
                .filter(JobTitle::isActive)
                .toList();
    }

    public Page<JobTitle> findAll(Pageable pageable) {
        return jobTitleRepository.findAll(pageable);
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
        JobTitle saved = jobTitleRepository.save(jobTitle);
        auditLogService.record(createdBy, "JOB_TITLE_CREATED", "JobTitle", saved.getId(),
                "Poste cree : " + saved.getTitle());
        return saved;
    }

    @Transactional
    public JobTitle update(UUID id, String title, boolean active, UUID actorId) {
        JobTitle jobTitle = findById(id);
        String trimmed = title.trim();
        if (jobTitleRepository.existsByTitleIgnoreCaseAndIdNot(trimmed, id)) {
            throw new IllegalStateException("Ce poste existe deja");
        }
        jobTitle.setTitle(trimmed);
        jobTitle.setActive(active);
        JobTitle saved = jobTitleRepository.save(jobTitle);
        auditLogService.record(actorId, "JOB_TITLE_UPDATED", "JobTitle", saved.getId(),
                "Poste mis a jour : " + saved.getTitle());
        return saved;
    }

    @Transactional
    public void deactivate(UUID id, UUID actorId) {
        JobTitle jobTitle = findById(id);
        jobTitle.setActive(false);
        jobTitleRepository.save(jobTitle);
        auditLogService.record(actorId, "JOB_TITLE_DEACTIVATED", "JobTitle", jobTitle.getId(),
                "Poste desactive : " + jobTitle.getTitle());
    }

    /**
     * Suppression physique, irreversible. Refusee si le poste est encore
     * reference par un utilisateur (contrainte FK reelle en base sur
     * app_user.job_title_id).
     */
    @Transactional
    public void hardDelete(UUID id, UUID actorId) {
        JobTitle jobTitle = findById(id);
        if (userRepository.existsByJobTitleId(id)) {
            throw new IllegalStateException(
                    "Impossible de supprimer definitivement ce poste : encore reference par au moins un utilisateur.");
        }
        String title = jobTitle.getTitle();
        jobTitleRepository.delete(jobTitle);
        auditLogService.record(actorId, "JOB_TITLE_HARD_DELETED", "JobTitle", id,
                "Poste supprime definitivement : " + title);
    }
}
