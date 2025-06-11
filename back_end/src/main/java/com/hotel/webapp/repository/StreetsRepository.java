package com.hotel.webapp.repository;

import com.hotel.webapp.entity.Streets;

import jakarta.persistence.criteria.CriteriaBuilder.In;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreetsRepository extends JpaRepository<Streets, Integer> {
}
