package com.hotel.webapp.service.user;

import com.hotel.webapp.dto.user_response.HomeRes;
import com.hotel.webapp.dto.user_response.RoomUserRes;
import com.hotel.webapp.entity.RoomImages;
import com.hotel.webapp.repository.FacilitiesRepository;
import com.hotel.webapp.repository.RoomImagesRepository;
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
public class RoomUserService {
  RoomRepository roomsRepository;
  FacilitiesRepository facilitiesRepository;
  RoomImagesRepository roomImagesRepository;
  DataOutput dataOutput;

  public RoomUserRes getRoomUserResponse(Integer roomId) {
    List<Object[]> roomObjs = roomsRepository.findRoomDetail(roomId);

    Object[] roomObj = roomObjs.get(0);
    Integer hotelId = (Integer) roomObj[10];

    String address = dataOutput.formatAddress((Integer) roomObj[2]);

    List<Object[]> facilitiesByRoom = facilitiesRepository.findFacilitiesByRoomId((Integer) roomObj[10]);
    Map<Integer, List<HomeRes.FacilitiesRes>> facilityRoomMap = new HashMap<>();
    for (Object[] facilityRow : facilitiesByRoom) {
      Integer facilityId = (Integer) facilityRow[1];
      String name = (String) facilityRow[2];
      String icon = (String) facilityRow[3];
      facilityRoomMap.computeIfAbsent((Integer) roomObj[0], k -> new ArrayList<>())
                     .add(new HomeRes.FacilitiesRes(facilityId, name, icon));
    }

    List<RoomImages> roomImages = roomImagesRepository.findAllByRoomIdAndDeletedAtIsNull(roomId);

    RoomUserRes.RoomRes roomRes = new RoomUserRes.RoomRes(
          (Integer) roomObj[0], // r.id
          (String) roomObj[1], // r.name
          address,
          (String) roomObj[3], // r.description
          (BigDecimal) roomObj[4], // r.roomArea
          (BigDecimal) roomObj[5], // priceHours
          (BigDecimal) roomObj[6], // priceNight
          (String) roomObj[7], // type
          (String) roomObj[8], // avatar
          (Integer) roomObj[9], // limitPerson
          facilityRoomMap.getOrDefault((Integer) roomObj[0], Collections.emptyList()),
          roomImages,
          new RoomUserRes.RoomRes.Policy(
                (Integer) roomObj[11],
                (String) roomObj[12],
                (String) roomObj[13]
          )
    );

    // Group rooms by RoomType
    List<Object[]> hotelRooms = roomsRepository.findRoomsByHotelId(hotelId);
    Map<String, List<RoomUserRes.TypeRes.RoomsRes>> typeMap = new HashMap<>();
    for (Object[] row : hotelRooms) {
      if (!row[0].equals(roomId)) {
        List<Object[]> facilitiesByRoomObj = facilitiesRepository.findFacilitiesByRoomId((Integer) row[0]);
        Map<Integer, List<HomeRes.FacilitiesRes>> facilityRoomMapInType = new HashMap<>();
        for (Object[] facilityRow : facilitiesByRoomObj) {
          Integer facilityId = (Integer) facilityRow[1];
          String name = (String) facilityRow[2];
          String icon = (String) facilityRow[3];
          facilityRoomMapInType.computeIfAbsent((Integer) row[0], k -> new ArrayList<>())
                               .add(new HomeRes.FacilitiesRes(facilityId, name, icon));
        }

        String typeName = (String) row[7]; // rt.name
        if (typeName != null) {
          RoomUserRes.TypeRes.RoomsRes roomResType = new RoomUserRes.TypeRes.RoomsRes(
                (Integer) row[0],      // r.id
                (String) row[1],       // r.name
                (String) row[2],       // r.roomAvatar
                (String) row[3],       // r.description
                facilityRoomMapInType.getOrDefault((Integer) row[0], Collections.emptyList()),
                (BigDecimal) row[4],   // r.roomArea
                (Integer) row[9],      // r.roomNumber
                (BigDecimal) row[6],   // r.priceNight
                (BigDecimal) row[5],   // r.priceHour
                typeName,              // rt.name
                (Integer) row[8]       // r.limitPerson
          );
          typeMap.computeIfAbsent(typeName, k -> new ArrayList<>()).add(roomResType);
        }
      }
    }

    // Chuyển typeMap thành List<TypeRes>
    List<RoomUserRes.TypeRes> typeResList = typeMap.entrySet().stream()
                                                   .map(entry -> new RoomUserRes.TypeRes(entry.getKey(),
                                                         entry.getValue()))
                                                   .toList();

    return new RoomUserRes(roomRes, typeResList);
  }
}