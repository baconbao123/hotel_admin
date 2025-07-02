package com.hotel.webapp.service.user;

import com.hotel.webapp.dto.user_response.HomeRes;
import com.hotel.webapp.dto.user_response.HotelUserRes;
import com.hotel.webapp.entity.HotelImages;
import com.hotel.webapp.repository.FacilitiesRepository;
import com.hotel.webapp.repository.HotelImagesRepository;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.repository.RoomRepository;
import com.hotel.webapp.util.DataOutput;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelUserService {
  HotelRepository hotelRepository;
  FacilitiesRepository facilitiesRepository;
  RoomRepository roomRepository;
  DataOutput dataOutput;
  HotelImagesRepository hotelImagesRepository;

  public HotelUserRes getData(int hotelId) {
    // Gọi truy vấn với hotelId
    List<Object[]> hotelObjs = hotelRepository.findHotelDetail(hotelId);
    if (hotelObjs.isEmpty()) {
      return null;
    }

    // Facilities - hotel
    List<Object[]> facilitiesByHotels = facilitiesRepository.findFacilitiesByHotelId(hotelId);
    Map<Integer, List<HomeRes.FacilitiesRes>> facilityMap = new HashMap<>();
    for (Object[] row : facilitiesByHotels) {
      Integer hId = (Integer) row[0];
      Integer facilityId = (Integer) row[1];
      String name = (String) row[2];
      String icon = (String) row[3];
      facilityMap.computeIfAbsent(hId, k -> new ArrayList<>())
                 .add(new HomeRes.FacilitiesRes(facilityId, name, icon));
    }

    // Hotel Images
    List<HotelImages> hotelImageRes = hotelImagesRepository.findAllByHotelIdAndDeletedAtIsNull(hotelId);

    // Hotel details (from the first row)
    Object[] firstRow = hotelObjs.get(0);
    String addressString = dataOutput.formatAddress((Integer) firstRow[2]);
    HotelUserRes.HotelRes hotelRes = new HotelUserRes.HotelRes(
          (Integer) firstRow[0], // h.id
          (String) firstRow[1],  // h.name
          addressString,         // address
          (String) firstRow[4],  // description
          (String) firstRow[3],  // avatar
          facilityMap.getOrDefault(hotelId, Collections.emptyList()),
          hotelImageRes,
          new HotelUserRes.HotelRes.Policy(
                (Integer) firstRow[5], // hp.id
                (String) firstRow[6],  // hp.name
                (String) firstRow[7]   // hp.description
          )
    );

    // Group rooms by RoomType
    Map<String, List<HotelUserRes.TypeRes.RoomsRes>> typeMap = new HashMap<>();
    for (Object[] row : hotelObjs) {
      if (row[8] != null) { // Check if room data exists (r.id is not null)
        // Facilities - room
        List<Object[]> facilitiesByRoom = facilitiesRepository.findFacilitiesByRoomId((Integer) row[8]);
        Map<Integer, List<HomeRes.FacilitiesRes>> facilityRoomMap = new HashMap<>();
        for (Object[] facilityRow : facilitiesByRoom) {
          Integer facilityId = (Integer) facilityRow[1];
          String name = (String) facilityRow[2];
          String icon = (String) facilityRow[3];
          facilityRoomMap.computeIfAbsent((Integer) row[8], k -> new ArrayList<>())
                         .add(new HomeRes.FacilitiesRes(facilityId, name, icon));
        }

        String typeName = (String) row[14]; // rt.name
        if (typeName != null) {
          HotelUserRes.TypeRes.RoomsRes roomRes = new HotelUserRes.TypeRes.RoomsRes(
                (Integer) row[8],      // r.id
                (String) row[9],       // r.name
                (String) row[10],      // r.roomAvatar
                (String) row[17],      // r.description
                facilityRoomMap.getOrDefault((Integer) row[8], Collections.emptyList()),
                (BigDecimal) row[11],  // r.roomArea
                (Integer) row[15],     // r.roomNumber
                (BigDecimal) row[12],  // r.priceNight
                (BigDecimal) row[13],  // r.priceHour
                typeName,              // rt.name (as type)
                (Integer) row[16]      // r.limitPerson
          );
          typeMap.computeIfAbsent(typeName, k -> new ArrayList<>()).add(roomRes);
        }
      }
    }

    // Convert typeMap to List<TypeRes>
    List<HotelUserRes.TypeRes> typeResList = new ArrayList<>();
    for (Map.Entry<String, List<HotelUserRes.TypeRes.RoomsRes>> entry : typeMap.entrySet()) {
      typeResList.add(new HotelUserRes.TypeRes(entry.getKey(), entry.getValue()));
    }

    return new HotelUserRes(hotelRes, typeResList);
  }
}