package com.hotel.webapp.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/payment")
public class VnPayController {
  private static final Logger logger = LoggerFactory.getLogger(VnPayController.class);

  @Value("${vnpay.vnp_TmnCode}")
  private String vnp_TmnCode;

  @Value("${vnpay.vnpHashSecret}")
  private String vnpHashSecret;

  @Value("${vnpay.vnp_ApiUrl}")
  private String vnp_ApiUrl;

  @GetMapping("/pay")
  public ResponseEntity<?> createPayment(
        HttpServletRequest request,
        @RequestParam(defaultValue = "10000") long amount,
        @RequestParam String txnRef
  ) {
    try {
      if (amount <= 0) {
        logger.error("Số tiền không hợp lệ: {}", amount);
        return ResponseEntity.badRequest().body("Số tiền phải lớn hơn 0!");
      }
      if (txnRef == null || txnRef.trim().isEmpty()) {
        logger.error("Mã đơn thanh toán không hợp lệ: {}", txnRef);
        return ResponseEntity.badRequest().body("Mã đơn thanh toán không được để trống!");
      }

      String vnp_Version = "2.1.0";
      String vnp_Command = "pay";
      String orderType = "billpayment";
      amount = amount * 100L;

      String vnp_IpAddr = request.getHeader("X-Forwarded-For") != null
            ? request.getHeader("X-Forwarded-For")
            : request.getRemoteAddr();
      String vnp_ReturnUrl = "http://localhost:5175/payment-result"; // FE port 8080
      String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
      String vnpPayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

      Map<String, String> vnpParams = new HashMap<>();
      vnpParams.put("vnp_Version", vnp_Version);
      vnpParams.put("vnp_Command", vnp_Command);
      vnpParams.put("vnp_TmnCode", vnp_TmnCode);
      vnpParams.put("vnp_Amount", String.valueOf(amount));
      vnpParams.put("vnp_CurrCode", "VND");
      vnpParams.put("vnp_TxnRef", txnRef);
      vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + txnRef + " voi so tien " + (amount / 100));
      vnpParams.put("vnp_OrderType", orderType);
      vnpParams.put("vnp_Locale", "vn");
      vnpParams.put("vnp_ReturnUrl", vnp_ReturnUrl);
      vnpParams.put("vnp_IpAddr", vnp_IpAddr);
      vnpParams.put("vnp_CreateDate", vnp_CreateDate);

      List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
      Collections.sort(fieldNames);
      StringBuilder hashData = new StringBuilder();
      StringBuilder query = new StringBuilder();

      for (int i = 0; i < fieldNames.size(); i++) {
        String fieldName = fieldNames.get(i);
        String value = vnpParams.get(fieldName);
        if (value != null && !value.isEmpty()) {
          hashData.append(fieldName).append('=').append(URLEncoder.encode(value, "UTF-8"));
          query.append(fieldName).append('=').append(URLEncoder.encode(value, "UTF-8"));
          if (i != fieldNames.size() - 1) {
            hashData.append('&');
            query.append('&');
          }
        }
      }
      String secureHash = hmacSHA512(vnpHashSecret, hashData.toString());
      query.append("&vnp_SecureHash=").append(secureHash);

      String paymentUrl = vnpPayUrl + "?" + query.toString();
      logger.info("Payment URL for amount {}: {}", amount / 100, paymentUrl);
      logger.debug("Hash data: {}", hashData.toString());

      return ResponseEntity.ok(Collections.singletonMap("paymentUrl", paymentUrl));
    } catch (UnsupportedEncodingException e) {
      logger.error("Lỗi tạo URL thanh toán", e);
      return ResponseEntity.badRequest().body("Lỗi hệ thống, thử lại sau!");
    }
  }

  @GetMapping("/return")
  public ResponseEntity<?> vnpReturn(@RequestParam Map<String, String> params) {
    String vnp_SecureHash = params.get("vnp_SecureHash");
    params.remove("vnp_SecureHash");
    params.remove("vnp_SecureHashType");

    List<String> fieldNames = new ArrayList<>(params.keySet());
    Collections.sort(fieldNames);
    StringBuilder hashData = new StringBuilder();

    for (int i = 0; i < fieldNames.size(); i++) {
      String fieldName = fieldNames.get(i);
      String value = params.get(fieldName);
      if (value != null && !value.isEmpty()) {
        hashData.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8));
        if (i != fieldNames.size() - 1) {
          hashData.append('&');
        }
      }
    }

    String calculatedHash = hmacSHA512(vnpHashSecret, hashData.toString());
    logger.debug("Return hash data: {}", hashData.toString());
    logger.debug("Calculated hash: {}, Received hash: {}", calculatedHash, vnp_SecureHash);

    String responseCode = params.get("vnp_ResponseCode");
    String txnRef = params.get("vnp_TxnRef");

    if (!calculatedHash.equals(vnp_SecureHash)) {
      params.put("vnp_ResponseCode", "97"); // Invalid checksum
    }

    String redirectUrl =
          "http://localhost:5175/payment-result?" + buildQueryString(params);
    return ResponseEntity.status(302).header("Location", redirectUrl).build();
  }

  @GetMapping("/verify")
  public ResponseEntity<?> verifyPayment(@RequestParam String txnRef, HttpServletRequest request) {
    try {
      String vnp_IpAddr = request.getHeader("X-Forwarded-For") != null
            ? request.getHeader("X-Forwarded-For")
            : request.getRemoteAddr();
      String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

      Map<String, String> vnpParams = new HashMap<>();
      vnpParams.put("vnp_Version", "2.1.0");
      vnpParams.put("vnp_Command", "querydr");
      vnpParams.put("vnp_TmnCode", vnp_TmnCode);
      vnpParams.put("vnp_TxnRef", txnRef);
      vnpParams.put("vnp_OrderInfo", "Kiem tra giao dich " + txnRef);
      vnpParams.put("vnp_TransDate", vnp_CreateDate); // Use actual transaction date if available
      vnpParams.put("vnp_CreateDate", vnp_CreateDate);
      vnpParams.put("vnp_IpAddr", vnp_IpAddr);

      List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
      Collections.sort(fieldNames);
      StringBuilder hashData = new StringBuilder();
      for (int i = 0; i < fieldNames.size(); i++) {
        String fieldName = fieldNames.get(i);
        String value = vnpParams.get(fieldName);
        if (value != null && !value.isEmpty()) {
          hashData.append(fieldName).append('=').append(URLEncoder.encode(value, "UTF-8"));
          if (i != fieldNames.size() - 1) {
            hashData.append('&');
          }
        }
      }
      String secureHash = hmacSHA512(vnpHashSecret, hashData.toString());
      vnpParams.put("vnp_SecureHash", secureHash);

      String queryString = buildQueryString(vnpParams);
      String response = sendPostRequest(vnp_ApiUrl, queryString);

      // Parse response (simplified, adjust based on actual VNPay response format)
      if (response.contains("00")) {
        return ResponseEntity.ok(Collections.singletonMap("message", "Thanh toán thành công! Mã giao dịch: " + txnRef));
      } else {
        return ResponseEntity.badRequest().body("Thanh toán thất bại hoặc giao dịch không tồn tại!");
      }
    } catch (Exception e) {
      logger.error("Lỗi kiểm tra giao dịch", e);
      return ResponseEntity.badRequest().body("Lỗi kiểm tra giao dịch!");
    }
  }

  private String hmacSHA512(String key, String data) {
    try {
      Mac hmac512 = Mac.getInstance("HmacSHA512");
      SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
      hmac512.init(secretKey);
      byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
      StringBuilder hash = new StringBuilder();
      for (byte b : bytes) {
        hash.append(String.format("%02x", b));
      }
      return hash.toString();
    } catch (Exception ex) {
      logger.error("Lỗi tạo chữ ký", ex);
      throw new RuntimeException("Lỗi tạo chữ ký", ex);
    }
  }

  private String buildQueryString(Map<String, String> params) {
    StringBuilder query = new StringBuilder();
    List<String> fieldNames = new ArrayList<>(params.keySet());
    Collections.sort(fieldNames);

    for (int i = 0; i < fieldNames.size(); i++) {
      String fieldName = fieldNames.get(i);
      String value = params.get(fieldName);
      if (value != null && !value.isEmpty()) {
        query.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8));
        if (i != fieldNames.size() - 1) {
          query.append('&');
        }
      }
    }
    return query.toString();
  }

  private String sendPostRequest(String url, String data) throws Exception {
    URL apiUrl = new URL(url);
    HttpURLConnection conn = (HttpURLConnection) apiUrl.openConnection();
    conn.setRequestMethod("POST");
    conn.setDoOutput(true);
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

    try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
      wr.writeBytes(data);
      wr.flush();
    }

    StringBuilder response = new StringBuilder();
    try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
      String inputLine;
      while ((inputLine = in.readLine()) != null) {
        response.append(inputLine);
      }
    }
    return response.toString();
  }
}