package com.baeksutalchul.hiddendoor.error.enums;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    // security auth
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_404", "유효하지 않은 이메일입니다."),
    ADMIN_ALREADY_EXISTS(HttpStatus.CONFLICT, "ADMIN_409", "이미 사용 중인 관리자 ID입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "PASSWORD_401", "비밀번호가 일치하지 않습니다."),
    ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "ACCESS_TOKEN_EXPIRED", "Access Token이 만료되었습니다."),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "REFRESH_TOKEN_EXPIRED", "다시 로그인 해주세요."),
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED_ACCESS", "인증되지 않은 접근입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "ACCESS_DENIED", "접근이 거부되었습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "유효하지 않은 토큰입니다."),

    // * common
    ESCAPE_ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "ESCAPE_ROOM_404", "방탈출 카페 정보를 찾을 수 없습니다."),
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "RESERVATION_404", "예약 정보를 찾을 수 없습니다."),
    PAYMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "PAYMENT_404", "결제 정보를 찾을 수 없습니다."),
    NOTICE_NOT_FOUND(HttpStatus.NOT_FOUND, "NOTICE_404", "공지사항을 찾을 수 없습니다."),
    EVENT_NOT_FOUND(HttpStatus.NOT_FOUND, "EVENT_404", "이벤트 정보를 찾을 수 없습니다."),
    CS_NOT_FOUND(HttpStatus.NOT_FOUND, "CS_404", "문의사항을 찾을 수 없습니다."),
    FAQ_NOT_FOUND(HttpStatus.NOT_FOUND, "FAQ_404", "FAQ 정보를 찾을 수 없습니다."),
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "INPUT_400", "유효하지 않은 입력입니다."),
    FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, "ACCESS_403", "접근이 금지되었습니다."),
    CAUTION_NOT_FOUND(HttpStatus.NOT_FOUND, "CAUTION_404", "주의사항을 찾을 수 없습니다."),
    THEME_NOT_FOUND(HttpStatus.NOT_FOUND, "THEME_404", "테마 정보를 찾을 수 없습니다."),

    // * admin
    NO_CHANGES_DETECTED(HttpStatus.BAD_REQUEST, "NO_CHANGES_DETECTED", "변경된 내용이 없습니다."),
    DELETE_FAILED(HttpStatus.BAD_REQUEST, "DELETE_FAILED", "삭제에 실패했습니다."),
    UPDATE_FAILED(HttpStatus.BAD_REQUEST, "UPDATE_FAILED", "정보를 업데이트하는 데에 실패했습니다."),
    FILE_SIZE_EXCEEDED(HttpStatus.EXPECTATION_FAILED, "FILE_SIZE_417", "파일 크기가 너무 큽니다! 최대 크기는 10MB입니다."),
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_FAILED", "이미지 저장에 실패했습니다."),
    DUPLICATE_ENTITY(HttpStatus.CONFLICT, "DUPLICATE_409", "이미 존재하는 항목입니다."),
    FILE_PROCESSING_ERROR(HttpStatus.BAD_REQUEST, "FILE_400", "파일 처리 중 오류가 발생했습니다."),
    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, "ADMIN_404", "관리자 정보를 찾을 수 없습니다."),
    ADMIN_DUPLICATE_EMAIL(HttpStatus.BAD_REQUEST, "DUPLICATE_EMAIL", "이미 사용 중인 이메일입니다."),
    ADMIN_DUPLICATE_PHONE(HttpStatus.BAD_REQUEST, "DUPLICATE_PHONE", "이미 사용 중인 휴대폰번호입니다."),
    DASHBOARD_TOTAL_RESERVATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "DASHBOARD_500", "전체 예약 데이터를 불러오지 못했습니다."),

    // * user
    MAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "MAIL_500", "예약 확인 메일 전송에 실패했습니다. 1:1 문의 부탁드립니다."),

    // * page
    PAGINATION_ERROR(HttpStatus.BAD_REQUEST, "PAGINATION_400", "페이지 정보가 유효하지 않습니다."),

    // * img
    INVALID_INPUT_FILE(HttpStatus.BAD_REQUEST, "INPUT_FILE_400", "유효하지 않은 파일입니다."),

    // * timeSlot
    TIME_SLOT_NOT_FOUND(HttpStatus.NOT_FOUND, "TIMESLOT_404", "해당 시간대의 예약 정보를 찾을 수 없습니다."),
    ALREADY_RESERVED(HttpStatus.CONFLICT, "RESERVATION_409", "이미 예약된 시간대입니다."),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "SERVER_500", "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."),
    INVALID_DATE_FORMAT(HttpStatus.BAD_REQUEST, "DATE_400", "잘못된 날짜 형식입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String msg;

    ErrorCode(HttpStatus httpStatus, String code, String msg) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.msg = msg;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
