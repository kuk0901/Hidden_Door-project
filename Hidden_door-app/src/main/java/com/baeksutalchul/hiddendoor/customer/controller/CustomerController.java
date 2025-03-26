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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.customer.service.CustomerService;
import com.baeksutalchul.hiddendoor.dto.CustomerDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;

@RestController
@RequestMapping("/api/v1/customers") // * -> 여기만 복수형태로 작성함
public class CustomerController {
  private final CustomerService customerService;
  private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

  public CustomerController(CustomerService customerService) {
    this.customerService = customerService;
  }

  @GetMapping("/list")
  public ResponseEntity<ResponseDto<List<CustomerDto>>> getCustomerAll(
      @RequestParam(name= "page", required = false, defaultValue = "1") int page,
      @RequestParam(name= "size", required = false, defaultValue = "10") int size,
      @RequestParam(name= "sortField", required = false, defaultValue = "id") String sortField,
      @RequestParam(name= "sortDirection", required = false, defaultValue = "ASC") String sortDirection,
      @RequestParam(name= "searchField", required = false) String searchField,
      @RequestParam(name= "searchTerm", required = false) String searchTerm
  ) {
      PageDto pageDto = new PageDto(
      page,
      size,
      0L,
      0,
      page == 1,
      false,
      sortField,
      sortDirection);
    return ResponseEntity.ok().body(customerService.getCustomerAll(pageDto, searchField, searchTerm));
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
      return ResponseEntity.ok().body(customerService.updateCustomerOne(customerId, customerDto));
  }


  @DeleteMapping("/customer/delete/{id}")
  public ResponseEntity<ResponseDto<String>> deleteCustomerOne(@PathVariable("id") String customerId) {
    return ResponseEntity.ok().body(customerService.deleteCustomerOne(customerId));
  }
}