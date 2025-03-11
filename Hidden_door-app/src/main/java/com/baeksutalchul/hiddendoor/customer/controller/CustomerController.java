package com.baeksutalchul.hiddendoor.customer.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.customer.service.CustomerService;
import com.baeksutalchul.hiddendoor.dto.CustomerDto;
import com.baeksutalchul.hiddendoor.dto.FaqDto;
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

  @GetMapping("/customer/{id}")
  public ResponseEntity<ResponseDto<CustomerDto>> getCustomerById(@PathVariable("id") String customerId) {
    return ResponseEntity.ok().body(customerService.getCustomerById(customerId));
  }

  @PostMapping("/customer/add")
  public ResponseEntity<ResponseDto<CustomerDto>> addCustomer(@RequestBody CustomerDto customerDto) {
    return ResponseEntity.ok().body(customerService.addCustomer(customerDto));
  }

   @PostMapping("/customer/update/{id}")
  public ResponseEntity<ResponseDto<CustomerDto>> updateCustomerOne(@PathVariable("id") String customerId, @RequestBody CustomerDto customerDto) {
      return ResponseEntity.ok().body(customerService.updateCustomer(customerId, customerDto));
  }


  @DeleteMapping("/customer/delete/{id}")
  public ResponseEntity<ResponseDto<String>> deleteCustomerOne(@PathVariable("id") String customerId) {
    return ResponseEntity.ok().body(customerService.deleteCustomerOne(customerId));
  }
}