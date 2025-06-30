package com.hotel.webapp.service.user;

import com.hotel.webapp.dto.user_response.HomeRes;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.repository.FacilitiesRepository;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.repository.RoomRepository;
import com.hotel.webapp.util.DataOutput;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeService {
  HotelRepository hotelRepository;
  FacilitiesRepository facilitiesRepository;
  RoomRepository roomRepository;
  DataOutput dataOutput;

  public HomeRes getData(int page) {
    var provinces = hotelRepository.geProvinceCodeByHotels();

    // -------------- hotels --------------
    int size = 10;

    Page<Hotels> hotelPage = hotelRepository.getHotelsInfo(PageRequest.of(page, size));

    List<Hotels> hotels = hotelPage.getContent();
    List<Integer> hotelIds = hotels.stream().map(Hotels::getId).toList();

    // facilities
    List<Object[]> facilitiesByHotels = facilitiesRepository.findFacilitiesByHotelId(hotelIds);

    Map<Integer, List<HomeRes.FacilitiesRes>> facilityMap = new HashMap<>();

    for (Object[] row : facilitiesByHotels) {
      Integer hotelId = (Integer) row[0];
      Integer facilityId = (Integer) row[1];
      String name = (String) row[2];
      String icon = (String) row[3];

      facilityMap.computeIfAbsent(hotelId, k -> new ArrayList<>())
                 .add(new HomeRes.FacilitiesRes(facilityId, name, icon));
    }

    Long totalElements = hotelPage.getTotalElements();

    List<HomeRes.HotelsRes.HotelRes> hotelResList = hotels.stream().map(h -> {
      String addressString = h.getAddressId() != null ? dataOutput.formatAddress(h.getAddressId()) : "N/A";
      BigDecimal priceNight = roomRepository.findPriceNightByHotelId(h.getId());
      return new HomeRes.HotelsRes.HotelRes(
            h.getId(),
            h.getAvatar(),
            addressString,
            facilityMap.getOrDefault(h.getId(), Collections.emptyList()),
            priceNight
      );
    }).toList();


    // -------------- filters --------------
    List<HomeRes.FacilitiesRes> facilitiesRes = facilitiesRepository.findFacilities()
                                                                    .stream()
                                                                    .map(row -> new HomeRes.FacilitiesRes(
                                                                          (Integer) row[0],
                                                                          (String) row[1],
                                                                          (String) row[2]
                                                                    ))
                                                                    .toList();

    Object[] priceMinMax = roomRepository.findMinMaxPrice().get(0);


    return new HomeRes(provinces, new HomeRes.HotelsRes(hotelResList, size, totalElements),
          new HomeRes.FilterRes(facilitiesRes,
                new HomeRes.FilterRes.PriceRes((BigDecimal) priceMinMax[0], (BigDecimal) priceMinMax[1])));
  }


}
