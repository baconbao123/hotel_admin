package com.hotel.webapp.service.system;

import com.hotel.webapp.repository.DocumentTypeRepository;
import com.hotel.webapp.repository.FacilityTypeRepository;
import com.hotel.webapp.repository.MapResourceActionRepository;
import com.hotel.webapp.repository.TypeHotelRepository;
import com.hotel.webapp.util.ValidateDataInput;
import com.nimbusds.jose.util.Pair;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SystemSeeder {
  MapResourceActionRepository mapResourceActionRepository;
  DocumentTypeRepository documentTypeRepository;
  FacilityTypeRepository facilityTypeRepository;
  TypeHotelRepository typeHotelRepository;
  ValidateDataInput validateDataInput;

  //
  // create update delete

  List<String> DEFAULT_RESOURCE = List.of("Hotel", "User", "Permissions", "Role", "Street", "Dashboard", "Facilities");

  List<String> DEFAULT_ACTION = List.of("view", "create", "update", "delete", "change_password");

  List<String> DEFAULT_DOCUMENT_TYPE = List.of("Booking Confirmation", "Guest Registration", "Guest Folio");

  List<String> DEFAULT_HOTEL_FACILITIES_TYPE = List.of("Guest Room", "Food & Beverage", "Recreational",
        "Meeting & Event", "General Facilities", "Safety & Support");

  List<String> DEFAULT_TYPE_HOTEL = List.of("Business", "Resort", "Airport", "Casino", "Extended Stay");

  @Transactional
  public void seeder() {
    Map<String, Integer> resourceIds = seederResources();

    Map<String, Integer> actionIds = seederActions();

    // create resource-actions mapping
    seederResourceActionMapping(resourceIds, actionIds);

    seederType();
  }

  //  seederResources
  private Map<String, Integer> seederResources() {
    Map<String, Integer> resourceIds = new HashMap<>();
    LocalDateTime now = LocalDateTime.now();

    for (String resourceName : DEFAULT_RESOURCE) {
      int resourceId = mapResourceActionRepository.findResourceIdByName(resourceName)
                                                  .orElseGet(() -> {
                                                    mapResourceActionRepository.insertResources(resourceName, now, 0);
                                                    return mapResourceActionRepository
                                                          .findResourceIdByName(resourceName)
                                                          .orElseThrow(() -> new RuntimeException(
                                                                "Failed to insert resource "
                                                                      + resourceName));
                                                  });
      resourceIds.put(resourceName, resourceId);
    }

    return resourceIds;
  }

  //  seederActions
  private Map<String, Integer> seederActions() {
    Map<String, Integer> actionIds = new HashMap<>();
    LocalDateTime now = LocalDateTime.now();

    for (String actionName : DEFAULT_ACTION) {
      int actionId = mapResourceActionRepository.findActionIdByName(actionName)
                                                .orElseGet(() -> {
                                                  mapResourceActionRepository.insetActions(actionName, now, 0);
                                                  return mapResourceActionRepository.findActionIdByName(actionName)
                                                                                    .orElseThrow(
                                                                                          () -> new RuntimeException(
                                                                                                "Failed to insert action " + actionName));
                                                });
      actionIds.put(actionName, actionId);
    }
    return actionIds;
  }

  //  seederResourceActionMapping
  private Map<Pair<Integer, Integer>, Integer> seederResourceActionMapping(Map<String, Integer> resourceIds,
        Map<String, Integer> actionIds) {
    Map<Pair<Integer, Integer>, Integer> mappings = new HashMap<>();
    Timestamp now = new Timestamp(System.currentTimeMillis());

    for (String resourceName : DEFAULT_RESOURCE) {
      int resourceId = resourceIds.get(resourceName);

      List<String> actions = resourceName.equals("User") ?
            DEFAULT_ACTION : DEFAULT_ACTION.stream()
                                           .filter(a -> !a.equals("change_password")).toList();

      for (String actionName : actions) {
        int actionId = actionIds.get(actionName);

        int mappingId = mapResourceActionRepository.findIdByResourceIdAndActionId(resourceId, actionId)
                                                   .orElseGet(() -> {
                                                     mapResourceActionRepository.insertMapping(resourceId, actionId,
                                                           now, 0);
                                                     return mapResourceActionRepository
                                                           .findIdByResourceIdAndActionId(resourceId, actionId)
                                                           .orElseThrow(() -> new RuntimeException(
                                                                 "Failed create mapping for resource " + resourceName + " and action " + actionName
                                                           ));

                                                   });
        mappings.put(Pair.of(resourceId, actionId), mappingId);
      }
    }
    return mappings;
  }

  // seeder type
  @Transactional
  public void seederType() {
    for (String type : DEFAULT_DOCUMENT_TYPE) {
      String colName = validateDataInput.generateColName(type);
      documentTypeRepository.findByNameAndDeletedAtIsNull(type)
                            .orElseGet(() -> {
                              documentTypeRepository.insertDocumentType(type, colName, LocalDateTime.now(), 0);
                              return documentTypeRepository.findByNameAndDeletedAtIsNull(type)
                                                           .orElseThrow(
                                                                 () -> new RuntimeException("Failed insert type"));
                            });
    }

    for (String facility : DEFAULT_HOTEL_FACILITIES_TYPE) {
      String colName = validateDataInput.generateColName(facility);
      facilityTypeRepository.findByNameAndDeletedAtIsNull(facility)
                            .orElseGet(() -> {
                              facilityTypeRepository.insertType(facility, colName, LocalDateTime.now(), 0);
                              return facilityTypeRepository.findByNameAndDeletedAtIsNull(facility)
                                                           .orElseThrow(
                                                                 () -> new RuntimeException("Failed insert type"));
                            });
    }

    for (String type : DEFAULT_TYPE_HOTEL) {
      String colName = validateDataInput.generateColName(type);
      typeHotelRepository.findByNameAndDeletedAtIsNull(type)
                         .orElseGet(() -> {
                           typeHotelRepository.insertTypeHotel(type, colName, LocalDateTime.now(), 0);
                           return typeHotelRepository.findByNameAndDeletedAtIsNull(type)
                                                     .orElseThrow(() -> new RuntimeException("Failed insert type"));
                         });
    }
  }

}
