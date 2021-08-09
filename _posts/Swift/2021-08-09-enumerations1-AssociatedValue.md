---
title: "[Swift] 연관값 (Associated Values)"
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

## 연관값?

직역하면 관련있는 값, 연관 있는 값이므로 쉽게 생각하면 열거형의 각 case와 관련이 있는 값 입니다.

애플의 설명에 따르면 각 **케이스에 다른 타입의 값을 저장**할 수 있다! 라고 되어 있습니다.

요약하면 연관 값은 케이스에 값을 저장하는 것! 입니다.

말로 하기는 참 애매해요 ㅠ 코드를 보면 이해가 잘 될거에요! 바로 보시죠!

```swift
enum WithDrawalResult {
    case success(newBalance: Int)
    case failed(message: String)
}
```

case가 마치 함수의 형태죠? 인자레이블이 있고 해당 인자의 타입이 함께 명시되어있습니다.

> 인자레이블을 지우고 case success(Int) 처럼 타입만 명시해도 됩니다!

저 인자레이블에 지정한 값이 저장되어지는거에요! 그럼 어떻게 사용하는지 코드를 마저 봅시다

```swift
enum WithDrawalResult {
    case success(newBalance: Int)
    case failed(message: String)
}

var balance = 10000
func withdraw(amount: Int) -> WithDrawalResult {
    if balance >= amount {
        balance -= amount
            return .success(newBalance: balance)	
    }else {
        return .failed(message: "돈이 모자라요!")
    }
}

let result = withdraw(amount: 9000)

switch result {
    case .success(let newBalance):
        print("남은돈은 \(newBalance)")
    case .failed(let msg):
        print(msg)
}

// 남은 돈은 1000
```

withdraw 함수내부를 봐볼가요

.success(newBalance: balance) 마치 함수 같죠?  반환된 WithDrawalResult 타입을 result에서 받아

switch 문을 사용해 .success의 연관 값을 가져 오는 부분도 주목할 필요가 있어요

새로운 상수 let newBalance를 사용해 값을 가져옵니다. 이런 방식을 **바인딩**이라 한다고 하네요!

.failed(let msg)를 보면 아시겠지만 바인딩으로 값을 가져올 때는 열거형 내부에서 정의한 이름과 꼭 같을 필요는 없어요. 

물론 1개의 값만 되는건 아닙니다!

```swift
enum PrivacyInfo {
    case name(firstName: String, lastName: String)
    case height(cm: Int)
}

let nameInfo = PrivacyInfo.name(firstName:"데브", lastName: "스윗푸드")
switch nameInfo {
    case let .name(first, last):
        print("first:\(first), last: \(last)")
    case let .height(cm):
        print(cm)
}
// first:데브, last: 스윗푸드
```

예시로 든 코드가 꽤나 적절하진 않지만

2개의 값도 사용가능한 것을 알 수 있습니다!

그리고 인수 레이블에 각각 let을 써주지 않고 case 바로 뒤에 let을 넣어 줄 수도 있단 것!! (물론 var로 선언도 가능합니다!)

```swift
enum HTTPRequest {
    case get
    case post(body: String)
}

let request = HTTPRequest.post(body: "Hello world")

guard case .post(let body) = request else {
    fatalError("post 방식이 아닙니다")
}

print(body)
```

guard case 문을 사용할 수도 있습니다.

guard case 문은 request가 .post 이면 body에 연관 값을 바인딩 시키고 .post가 아니면 에러를 발생시킵니다!

## 옵셔널

여기서 왜 옵셔널이 나와? 

사실 옵셔널도 열거형의 연관 값이라고 하네요!! 

```swift
var age: Int?
age = 17
age = nil
```

위와 같이 옵셔널은 2가지 케이스가 있는 열거형입니다

```swift
enum Optional {
    case .값이 있다(어떤값)
    case .값이 없다
}
```

어때요? **값이 있으면 연관 값**에서 가져오고 값이 없으면 그냥 **.값이 없다** 겠죠?

진짜 옵셔널은 봐봅시다

```swift
@frozen public enum Optional<Wrapped> : ExpressibleByNilLiteral {
    case none
    case some(Wrapped)
......
}
```

case가 2개 있는데 바로 값이 없는 none과 값이 있는 some이네요 연관 값은 Wrapped이구요

그렇다면 연관 값을 바인딩하는 것처럼 옵셔널의 값도 가져 올 수 있겠죠?

```swift
var age: Int?
age = 17

switch age {
    case let .some(value): print("value is :\(value)")
    case .none : print("value is nil")
}
// value is :17 

age = nil
switch age {
    case let .some(value): print("value is :\(value)")
    case .none : print("value is nil")
}
// value is nil
```

와우 옵셔널이 열거형이였다니 살짝 놀랐네요

## 정리

1. 연관값은 .열거값(인자레이블: 타입) 혹은  .열거값(타입)으로 선언한다
2. 사용할 때는 **case .열거값(let/var 변수명)** 혹은 **case let/var .열거값(변수명)**으로 바인딩하여 사용할 수 있다
3. 옵셔널은 값이 있는 .some(연관값)과 값이 없는 .none으로 이루어진 열거형이다.
