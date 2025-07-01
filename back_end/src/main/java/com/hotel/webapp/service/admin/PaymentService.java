package com.hotel.webapp.service.admin;

import com.hotel.webapp.entity.PaymentMethod;
import com.hotel.webapp.repository.seeder.PaymentMethodRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {
  PaymentMethodRepository paymentMethodRepository;

  public List<PaymentMethod> findAllPayment() {
    return paymentMethodRepository.findAllPayment();
  }


}
