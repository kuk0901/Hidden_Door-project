package com.baeksutalchul.hiddendoor.customer.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;

@Service
public class CustomerService {
  private MongoTemplate mongoTemplate;
  private CustomerRepository customerRepository;
  private final ModelMapper modelMapper;
  private final Logger logger = LoggerFactory.getLogger(CustomerService.class);
  private final Instant defaulInstant = Instant.parse("1970-01-01T00:00:00Z");

  public CustomerService(CustomerRepository customerRepository, ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
    this.customerRepository = customerRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<CustomerDto>> getCustomerAll(PageDto pageDto, String searchField, String searchTerm) {
    Pageable pageable = PageableUtil.createPageRequest(
        Math.max(0, pageDto.getPage() - 1),
        pageDto.getSize(),
        pageDto.getSortField(),
        pageDto.getSortDirection());

    Page<Customer> customerList;

    if (searchTerm != null && !searchTerm.trim().isEmpty()) {
      switch (searchField) {
        case "customerTitle":
          customerList = customerRepository.findByCustomerTitleContaining(searchTerm, pageable);
          break;
        case "customerContent":
          customerList = customerRepository.findByCustomerContentContaining(searchTerm, pageable);
          break;
        default:
          customerList = customerRepository.findByCustomerTitleContainingOrCustomerContentContaining(searchTerm,
              searchTerm, pageable);
      }
    } else {
      customerList = customerRepository.findAll(pageable);
    }
    if (customerList.isEmpty()) {
      throw new CustomException(ErrorCode.FAQ_NOT_FOUND);
    }

    List<CustomerDto> customerDtoList = customerList.getContent().stream()
        .map(customer -> {
          CustomerDto customerDto = modelMapper.map(customer, CustomerDto.class);

          customerDto.setKstQueCreDate(DateTimeUtil.convertToKoreanDate(customer.getQueCreDate()));
          customerDto.setKstAnsCreDate(DateTimeUtil.convertToKoreanDate(customer.getAnsCreDate()));

          return customerDto;
        })
        .toList();

    PageDto resultPageDto = PageableUtil.createPageDto(customerList);
    logger.info("resultPageDto: {}", resultPageDto);

    return new ResponseDto<>(customerDtoList, "success", resultPageDto, searchField, searchTerm);
  }

  public ResponseDto<CustomerDto> getCustomerById(String customerId) {
    Optional<Customer> customerOptional = customerRepository.findById(customerId);

    if (customerOptional.isPresent()) {
      Customer customer = customerOptional.get();
      CustomerDto customerDto = modelMapper.map(customer, CustomerDto.class);

      customerDto.setKstQueCreDate(DateTimeUtil.convertToKoreanDate(customer.getQueCreDate()));
      customerDto.setKstAnsCreDate(DateTimeUtil.convertToKoreanDate(customer.getAnsCreDate()));

      return new ResponseDto<>(customerDto, "고객센터 상세 정보 반환");
    } else {
      return new ResponseDto<>(null, "고객센터 정보를 찾을 수 없습니다.");
    }

  }

  @Transactional
  public ResponseDto<String> addCustomer(CustomerDto customerDto) {

    Customer customer = new Customer();
    customer.setCustomerName(customerDto.getCustomerName());
    customer.setCustomerEmail(customerDto.getCustomerEmail());
    customer.setCustomerTitle(customerDto.getCustomerTitle());
    customer.setCustomerContent(customerDto.getCustomerContent());
    customer.setCustomerCheck(customerDto.getCustomerCheck());
    customer.setCustomerPwd(customerDto.getCustomerPwd());
    customer.setQueCreDate(Instant.now());
    customer.setAnsCreDate(defaulInstant);

    Customer saveCustomer = mongoTemplate.save(customer);

    return new ResponseDto<>(saveCustomer.getCustomerId(), "succes");
  }

  @Transactional
  public ResponseDto<CustomerDto> updateCustomerOne(String id, CustomerDto customerDto) {

    Customer customer = customerRepository.findById(id).orElseThrow();

    customer.setCustomerCheck(customerDto.getCustomerCheck());
    customer.setCustomerAnswer(customerDto.getCustomerAnswer());
    customer.setAdminName(customerDto.getAdminName());
    customer.setAnsCreDate(Instant.now());

    Customer updatedCustomer = customerRepository.save(customer);
    CustomerDto updatedCustomerDto = modelMapper.map(updatedCustomer, CustomerDto.class);

    return new ResponseDto<>(updatedCustomerDto, customer.getCustomerTitle() + "의 질문이 수정되었습니다.");
  }

  @Transactional
  public ResponseDto<String> deleteCustomerOne(String id) throws CustomException {

    Customer customerToDelete = customerRepository.findById(id)
        .orElseThrow(() -> new CustomException(null));

    customerRepository.deleteById(id);
    return new ResponseDto<>("", "질문 " + customerToDelete.getCustomerTitle() + "이(가) 삭제되었습니다.");
  }
}