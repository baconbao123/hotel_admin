package com.hotel.webapp.util;

import com.hotel.webapp.dto.user_response.AddressRes;
import com.hotel.webapp.repository.AddressRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataOutput {
  AddressRepository addressRepository;

  public String formatAddress(Integer addressId) {
    AddressRes addressRes = addressRepository.findAddressDetail(addressId);

    List<String> parts = new ArrayList<>();

    parts.add(addressRes.getNumber());
    parts.add(addressRes.getStreet() + " Street,");
    parts.add("Ward " + addressRes.getWard() + ",");
    parts.add(addressRes.getDistrict() + " District,");
    parts.add(addressRes.getProvince() + " City");
    if (addressRes.getNote() != null && !addressRes.getNote().isEmpty()) parts.add("-" + addressRes.getNote());
    return String.join(" ", parts);
  }
}
