---
title: "[Swift] 구조체와 클래스(Struct, Class)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
toc: true
toc_sticky: true
toc_label: 목차
---

## 클래스 그리고 구조체

클래스와 구조체는 새로운 타입을 만드는 것입니다. 타입의 이름은 클래스명, 구조체명이 되겠지요?

왜 만드냐? 바로 프로그램 코드를 효율성있게 그룹화하는데 그 목적이 있습니다.

**객체지향**이라는 패러다임을 위한 필수 요소이기도 하지요!

클래스와 구조체의 특성에 대해 가볍게 알아봅시다!

## 클래스와 구조체의 비교

### 공통점

1. 값을 저장하기 위한 **프로퍼티**를 정의할 수 있습니다.
2. 특별한 기능을 위해 **메소드**를 정의할 수 있습니다.
3. **subscript**를 사용하여 특정 값에 접근할 수 있습니다.
4. 초기화를 위한 **이니셜라이저**를 정의할 수 있습니다.
5. **extension**으로 기능을 확장할 수 있습니다.
6. 표준적인 기능을 정의한 **프로토콜**을 사용할 수 있습니다

### 차이점

다 똑같으면 클래스와 구조체를 구별할 필요가 없겠죠?

아래와 같은 클래스만을 위한 기능도 있습니다. 

1. 한 클래스의 여러 속성을 다른 클래스에 물려주는 **상속** 
2. 런타임에 클래스 인스턴스의 타입을 확인할 수 있는 **타입캐스팅**
3. 할당된 자원을 해제하는 **디이니셜라이저**
4. 클래스 인스턴스를 하나 이상 참조할 수 있고 메모리 관리와 관련이 깊은 **참조 카운트**

## 값 타입과 참조 타입

Swift에는 여러 타입들이 있습니다. 이런 타입들은 크게 값 타입과 참조 타입 2가지로 나눌 수 있는데요

각 타입의 특성과 종류에 대해 좀 더 깊게 알아 봅시다.

### 값 타입

값 타입은 뜻은 상수 혹은 변수에 전달될 때 그 값이 **복사되어 전달**되어집니다.

Swift에서 **구조체와 열거형**이 이러한 값 타입에 속합니다.

예제로 이해 해봅시다

```swift
struct UserInfo {
    var name = "sweetfood"
    var age = 10
}

var info = UserInfo()
let copyInfo = info
info.name = "dev"
info.age = 100

print("info name: \(info.name) age: \(info.age)")
// info name: dev age: 100
print("copyInfo name: \(copyInfo.name) age: \(copyInfo.age)")
// copyInfo name: sweetfood age: 10
```

info와 copyInfo는 값이 저장되어 있는 장소가 다르다는걸 확인할 수 있습니다.

> 대부분 아시겠지만 구조체는 struct 키워드를 사용하여 정의하고 내부 프로퍼티에 접근할 때는 .를 사용하여 접근할 수 있습니다!

열거형 또한 값 타입이라고 하였는데 열거형도 사용해볼까요?

```swift
enum ValueEnum {
    case number
    case strings
    case double
}

var valueType = ValueEnum.number
let copyValueType = valueType
valueType = ValueEnum.strings

print("valueType : \(valueType)")
// valueType : strings
print("copyValueType : \(copyValueType)")
// copyValueType : number
```

네 구조체와 결과가 같습니다!

구조체와 열거형같은 값 타입들은 변화가 있을 때 해당 인스턴스에만 영향이 있고 다른 인스턴스에는 아무 영향이 없다는걸 알 수 있습니다!

다른 변수 혹은 상수에 전달될 때는 단지 복사되어 지기 때문이죠. 우리가 어떤 A4용지를 복사한 후 원본에 낙서를 한다고 복사본에 영향이 안가는 것과 같은거지요!

### 참조 타입

참조 타입은 변수 혹은 상수에 값이 전달되어지거나 할당할 때 **복사가 아닌 참조**됩니다.

참조란 뜻은 전달된 값을 가지고 있는 메모리를 바라보고 있다는 뜻입니다! c언어에서의 **포인터**와 같은 개념이죠

클래스와 클로저가 바로 이 참조 타입에 속해있습니다.

```swift
class UserInfo {
    var name = "sweetfood"
    var age = 10
}

let info = UserInfo()
let copyInfo = info

info.name = "dev"
info.age = 100

print("info name: \(info.name) age: \(info.age)")
// info name: dev age: 100
print("copyInfo name: \(copyInfo.name) age: \(copyInfo.age)")
// copyInfo name: dev age: 100
```

구조체와 다른 결과가 나왔죠? info의 프로퍼티인 name, age값이 변하니까 copyInfo의 프로퍼티의 값도 동일하게 변경되었습니다.

값이 있는 메모리를 바라보고 있기 때문에 같은 값을 볼 수 있는거죠! 

이 코드에서 또 의문이 드는 부분이 있을텐데요 바로 info가 let으로 선언되었는데 어떻게 값이 바뀌는가? 하는 의문이 생길 수 있습니다.

참조 타입의 특징인데요 쉽게 말하면 info가 바라보고 있는 곳이 신라호텔의 305호실이라고 합시다.

305호실에 있는 투숙객의 이름은 sweetfood이구요. 얼마 후에 투숙객의 이름을 dev로 바꿔버린거에요.

그럼 투숙객의 이름이 변경된 거지 신라호텔의 305호실이 변경된건 아니잖아요?

305호실을 메모리, 투숙객의 이름을 값이라고 생각해보면 같은 이치겠죠. 바라보는 곳을 변경하는게 아니라 바라보는 곳의 값을 변경하는 것 이기때문에 let을 사용하여도 가능한거랍니다.

#### 식별 연산자

참조 타입들은 여러 상수와 변수에서 같은 인스턴스를 참조할 수 있습니다. 그 상수와 변수들이 **같은 인스턴스를 참조**하고 있는지 비교하기 위해서 사용하는 연산자가 바로 식별 연산자 입니다. 

식별연산자는 !==, ===를 사용합니다

```swift
class UserInfo {
    var name = "sweetfood"
    var age = 10
}

let info = UserInfo()
let copyInfo = info
print(info === copyInfo)
// true
let anotherInfo = UserInfo()
print(info === anotherInfo)
// false
```

같은 타입이라도 같은 인스턴스를 참조하고 있지 않으면 false가 되겠죠

==, != 는 비교 연산자로 값을 비교하기 떄문에 식별연산자와는 다릅니다!

## 기본데이터 타입

Swift에서 사용하는 String, Array, Dictionary 같은 기본 데이터 타입들은 구조체로 구현되어 있습니다.

그 말인 즉슨 변수나 상수에 할당, 전달할 때 값이 복사되어 진다는 거겠죠? 

하지만 Swift에서의 성능을 위해 바로 복사되어지는게 아니라 실제로 사용이 되어 질 때 복사가 되어진다고 합니다! 똑똑해요 스위프트!

아 참고로 NSString, NSArray, NSDictionary 또한 기본 데이터 타입이지만 요놈들은 클래스로 구현되어 있어서 참조 타입이라고 합니다! 저도 이번에 알았네요..!

## 정리

1. Swift는 크게 값 타입과 참조 타입이 있다
2. 값 타입엔 구조체와 열거형이 있으며 값이 복사되어 전달 된다
3. 참조 타입엔 클래스와 클로저가 있으며 참조 된다!(포인터 개념)
