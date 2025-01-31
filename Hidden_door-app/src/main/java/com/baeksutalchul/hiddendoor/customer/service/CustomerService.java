package com.baeksutalchul.hiddendoor.customer.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.customer.domain.Customer;
import com.baeksutalchul.hiddendoor.customer.repository.CustomerRepository;
import com.baeksutalchul.hiddendoor.dto.CustomerDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

@Service
public class CustomerService {
  private CustomerRepository customerRepository;
  private final ModelMapper modelMapper;
  private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);

  public CustomerService(CustomerRepository customerRepository, ModelMapper modelMapper) {
    this.customerRepository = customerRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<CustomerDto>> getCustomerAll() {
    List<Customer> customerList = customerRepository.findAll();

    List<CustomerDto> customerDtoList = customerList.stream()
        .map(customer -> modelMapper.map(customer, CustomerDto.class))
        .toList();

    return new ResponseDto<>(customerDtoList, "Customer 데이터 반환");
  }

    public ResponseDto<String> addCustomer(CustomerDto customerDto) {
    
    Customer customer = customerRepository.save(modelMapper.map(customerDto, Customer.class));

    return new ResponseDto<>("", customer.getCustomerId() + "번 질문이 추가되었습니다.");
  }

  @Transactional
  public ResponseDto<String> updateCustomerOne(CustomerDto customerDto) throws CustomException {
    return customerRepository.findById(customerDto.getCustomerId())
        .map(currentCustomer -> {

          currentCustomer.setCustomerAnswer(customerDto.getCustomerAnswer());
          currentCustomer.setAdminName(customerDto.getAdminName());
          customerRepository.save(currentCustomer);
          return new ResponseDto<>("", "좌석에 대한 정보가 수정되었습니다.");
        })
        .orElseThrow(() -> new CustomException(null));
  }

  @Transactional
  public ResponseDto<String> deleteCustomerOne(String id) throws CustomException { 

    Customer customerToDelete = customerRepository.findById(id)
      .orElseThrow(() -> new CustomException(null));
    
      customerRepository.deleteById(id);
    return new ResponseDto<>("", "질문 " + customerToDelete.getCustomerId() + "이(가) 삭제되었습니다.");
  }
}