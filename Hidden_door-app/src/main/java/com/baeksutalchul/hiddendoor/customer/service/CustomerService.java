package com.baeksutalchul.hiddendoor.customer.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.customer.domain.Customer;
import com.baeksutalchul.hiddendoor.customer.repository.CustomerRepository;
import com.baeksutalchul.hiddendoor.dto.CustomerDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;

@Service
public class CustomerService {
  private MongoTemplate mongoTemplate;
  private CustomerRepository customerRepository;
  private final ModelMapper modelMapper;
  private final Logger logger = LoggerFactory.getLogger(CustomerService.class);
  private final Instant defaulInstant = Instant.parse("1970-01-01T00:00:00Z");

  public CustomerService(CustomerRepository customerRepository, ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.mongoTemplate =mongoTemplate;
    this.customerRepository = customerRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<CustomerDto>> getCustomerAll() {
    List<Customer> customerList = customerRepository.findAll();

    if (customerList.isEmpty()) {
      throw new CustomException(ErrorCode.FAQ_NOT_FOUND);
    }

    List<CustomerDto> customerDtoList = customerList.stream()
        .map(customer -> {
          CustomerDto customerDto = modelMapper.map(customer, CustomerDto.class);
          customerDto.setKstQueCreDate(DateTimeUtil.convertToKoreanDate(customer.getQueCreDate()));
          customerDto.setKstAnsCreDate(DateTimeUtil.convertToKoreanDateTime(customer.getAnsCreDate()));

          return customerDto;
        })
        .toList();

    logger.info("customerDtoList: {}", customerDtoList);

    return new ResponseDto<>(customerDtoList, "고객센터 데이터 반환");
  }

  public ResponseDto<CustomerDto> getCustomerById(String customerId) {
    Optional<Customer> customerOptional = customerRepository.findById(customerId);

    if (customerOptional.isPresent()) {
      Customer customer = customerOptional.get();
      CustomerDto customerDto = modelMapper.map(customer, CustomerDto.class);

      customerDto.setKstQueCreDate(DateTimeUtil.convertToKoreanDate(customer.getQueCreDate()));
      customerDto.setKstAnsCreDate(DateTimeUtil.convertToKoreanDateTime(customer.getAnsCreDate()));

      return new ResponseDto<>(customerDto, "고객센터 상세 정보 반환");
    } else {
      return new ResponseDto<>(null, "고객센터 정보를 찾을 수 없습니다.");
    }

  }

  @Transactional
  public ResponseDto<CustomerDto> addCustomer(CustomerDto customerDto) {

    Customer customer = new Customer();
    customer.setCustomerName(customerDto.getCustomerName());
    customer.setCustomerEmail(customerDto.getCustomerEmail());
    customer.setCustomerTitle(customerDto.getCustomerTitle());
    customer.setCustomerContent(customerDto.getCustomerContent());
    customer.setCustomerCheck(customerDto.getCustomerCheck());
    customer.setCustomerPwd(customerDto.getCustomerPwd());
    customer.setQueCreDate(Instant.now());
    customer.setAnsCreDate(customerDto.getAnsCreDate());

    Customer saveCustomer = mongoTemplate.save(customer);

    CustomerDto resCustomerDto = modelMapper.map(saveCustomer, CustomerDto.class);

    return new ResponseDto<>(resCustomerDto, customer.getCustomerTitle() + "의 질문이 추가되었습니다.");
  }

  @Transactional
  public ResponseDto<String> deleteCustomerOne(String id) throws CustomException {

    Customer customerToDelete = customerRepository.findById(id)
        .orElseThrow(() -> new CustomException(null));

    customerRepository.deleteById(id);
    return new ResponseDto<>("", "질문 " + customerToDelete.getCustomerTitle() + "이(가) 삭제되었습니다.");
  }
}