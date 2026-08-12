package com.comicverse.sync.repository;

import com.comicverse.sync.model.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
}
