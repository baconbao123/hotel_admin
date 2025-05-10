package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.HotelPolicyDTO;
import com.hotel.webapp.entity.HotelPolicy;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.HotelPolicyRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelPolicyServiceImpl extends BaseServiceImpl<HotelPolicy, Integer, HotelPolicyDTO, HotelPolicyRepository> {

  public HotelPolicyServiceImpl(
        HotelPolicyRepository repository,
        BaseMapper<HotelPolicy, HotelPolicyDTO> mapper,
        AuthService authService) {
    super(repository, mapper, authService);
  }

  @Override
  protected void validateUpdate(Integer id, HotelPolicyDTO update) {
    var hotelPolicy = getById(id);

    if (hotelPolicy.getHotelId() != null &&
          (update.getHotelId() == null || update.getHotelId() == 0)) {
      throw new AppException(ErrorCode.NOT_NULL, "Hotel");
    }
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Policy");
  }
}