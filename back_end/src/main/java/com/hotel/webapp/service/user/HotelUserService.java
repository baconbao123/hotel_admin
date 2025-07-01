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
    List<Object[]> hotelObjs = hotelRepository.findHotelDetail(hotelId);
    if (hotelObjs.isEmpty()) {
      return null; // Or throw HotelNotFoundException
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

    // Hotel details (from the first row, as hotel info is the same across rows)
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

    // Rooms
    List<HotelUserRes.RoomRes> roomResList = new ArrayList<>();
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

        roomResList.add(new HotelUserRes.RoomRes(
              (Integer) row[8],      // r.id
              (String) row[9],       // r.name
              (String) row[10],      // r.roomAvatar
              facilityRoomMap.getOrDefault(hotelId, Collections.emptyList()),
              (BigDecimal) row[11],  // r.roomArea
              (BigDecimal) row[12],  // r.priceNight
              (BigDecimal) row[13],  // r.priceHour
              (String) row[14]       // rt.name (as type)
        ));
      }
    }

    return new HotelUserRes(hotelRes, roomResList);
  }
}
