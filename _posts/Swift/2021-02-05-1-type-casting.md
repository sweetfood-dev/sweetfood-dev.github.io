---
title: "[Swift] as as? as!"
categories:
- Swift
---

|  | 설명 | 실행 시점 | 캐스팅 종류
| -------- | -------- | -------- | -------- |
| as     | 컴파일러가 타입 변환의 성공을 보장     | 컴파일 타임     | 업 캐스팅|
| as?     | 변환에 실패하는 경우 nil을 반환     | 런타임     | 다운 캐스팅 |
| as!     | 변환에 실패하는 경우 런타임에러 발생     | 런타임     | 다운 캐스팅 |
