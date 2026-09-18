package com.pfo.koraya.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailEndingWithIgnoreCase(String emailSuffix);

    boolean existsBySiteId(UUID siteId);

    boolean existsByDepartmentId(UUID departmentId);

    boolean existsByJobTitleId(UUID jobTitleId);
}
