---
title: "[Swift]초기화 Part3 (Initializer)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Initializer
toc: true
toc_sticky: true
toc_label: 목차
--- 
## 실패 가능한 초기화 (Failable Initializers)

잘못된 초기화 매개변수 값, 외부 리소스의 부재 등의 이유로 초기화가 실패할 가능성이 있는 경우 사용

init뒤에 물음표(?)를 붙여서 선언

> 실패 가능한 이니셜라이저와 실패 불가능한 평범한 이니셜라이저를 모두 사용할 경우 매개변수의 이름과 타입이 같아서는 안된다. 컴파일러에서는 이니셜라이저를 인식할 때 매개변수의 타입으로 구분짓기 때문인 것 같음

```swift
struct SomeStruct {
    var someproperty: Int
    init(parameter: String) { }
    init?(parameter: String) { }
}
```

위 코드의 경우 init과 init?의 매개변수 타입과 이름이 같기에 오류

실패 가능한 이니셜라이저는 반환 타입을 옵셔널 값으로 생성함

초기화 실패시 nil을 반환하므로써 실패를 트리거 한다.

> 이니셜라이저는 옳바르게 초기화를 하는 것이 역할이고 목표이기 때문에 값을 반환 하진 않는다
따라서, 초기화를 성공하였다는 값을 반환하지는 않지만, 실패를 나타나기 위해 예외적으로 **return nil**은 
허용하는 것 같음

### 예제

```swift
struct MovieTicket {
    var price: Int
    init?(age: Int, payment money: Int) {
        guard age > 19 else { return nil }
        price = money
    }
}

let parasite = MovieTicket(age: 17, payment: 5000)

if let validTicket = parasite {
	print("성인이므로 볼 수 있음 가격 \(validTicket.price)
}else {
	print("청소년은 볼 수 없음")
}
```

## 필수 이니셜라이저

상위 클래스의 모든 하위 클래스가 해당 이니셜라이저를 구현해야 할 때 init 앞에 required 키워드를 붙여서 
정의한다

필수초기자를 상속받은 서브클래스에서도 반드시 required 키워드를 붙여서 다른 서브클래스에게도 이 초기자는 필수 초기자라는 것을 알려야 한다.

필수 지정 이니셜라이저를 재정의할 때에는 override 키워드를 생략한다

### 예제

```swift
class SomeClass {
    var age: Int
    required init() {
        age = 20
    }
}

class SomeSubClass: SomeClass {
    var name: String
    var description: String { "\(age) \(name)" }
    required init() {
        name = "seetdev"
        super.init()
        age = 15
    }
}

let someSub = SomeSubClass()
print(someSub.description)
```
