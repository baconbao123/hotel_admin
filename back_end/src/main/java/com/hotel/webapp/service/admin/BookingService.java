package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.BookingDTO;
import com.hotel.webapp.dto.response.BookingRes;
import com.hotel.webapp.entity.Booking;
import com.hotel.webapp.entity.Rooms;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.BookingRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService extends BaseServiceImpl<Booking, Integer, BookingDTO, BookingRepository> {
  public BookingService(
        BookingRepository repository,
        BaseMapper<Booking, BookingDTO> mapper,
        AuthService authService) {
    super(repository, mapper, authService);
  }

  public Page<BookingRes> findBookingsByRoomId(Integer roomId, Map<String, String> filters, Map<String, String> sort,
        int size,
        int page) {
    Map<String, Object> filterMap = removedFiltersKey(filters);
    Map<String, Object> sortMap = removedSortedKey(sort);

    Specification<Rooms> spec = buildSpecification(filterMap);
    Pageable defaultPage = buildPageable(sortMap, page, size);

    return repository.findBookingsByRoomId(roomId, spec, defaultPage);
  }


  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    throw new AppException(ErrorCode.NOT_FOUND, "Room");
  }
}
