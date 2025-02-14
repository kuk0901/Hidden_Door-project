package com.baeksutalchul.hiddendoor.customer.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.customer.service.CustomerService;
import com.baeksutalchul.hiddendoor.dto.CustomerDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

@RestController
@RequestMapping("/api/v1/customers") // * -> 여기만 복수형태로 작성함
public class CustomerController {
  private final CustomerService customerService;
  private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

  public CustomerController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @GetMapping("/list")
  public ResponseEntity<ResponseDto<List<CustomerDto>>> getCustomerAll() {
    return ResponseEntity.ok().body(customerService.getCustomerAll());
  }

  @PostMapping("/customer/add")
  public ResponseEntity<ResponseDto<String>> addCustomer(@RequestBody CustomerDto customerDto) {
    try {
      logger.info("CustomerDto: {}", customerDto);

      ResponseDto<String> res = customerService.addCustomer(customerDto);
      return ResponseEntity.ok().body(res);
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(new ResponseDto<>("", "서버 오류로 인해 좌석 추가에 실패하였습니다. 잠시 후 다시 시도해 주세요."));
    }
  }

  @PutMapping("/customer/update")
  public ResponseEntity<ResponseDto<?>> updateCustomerOne(@RequestBody CustomerDto customerDto) {
    try {
      return ResponseEntity.ok().body(customerService.updateCustomerOne(customerDto));
    } catch (CustomException e) {
      return ResponseEntity.badRequest().body(new ResponseDto<>("", e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(new ResponseDto<>("", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
    }
  }

  @DeleteMapping("/customer/delete/{id}")
  public ResponseEntity<ResponseDto<String>> deleteCustomerOne(@PathVariable("id") String customerId) {
    try {
      return ResponseEntity.ok().body(customerService.deleteCustomerOne(customerId));
    } catch (CustomException e) {
      return ResponseEntity.badRequest().body(new ResponseDto<>("", e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(new ResponseDto<>("", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
    }
  }
}