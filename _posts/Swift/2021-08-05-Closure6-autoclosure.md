---
title: "[Swift] Auto Closure (@autoclosure)"
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Closure
toc: true
toc_sticky: true
toc_label: 목차
---

# Autoclosure

함수의 인자로 전달되는 코드를 감싸서 자동으로 클로저로 만들어 줍니다.

클로저는 { } 사이에 코드를 작성하여 만들잖아요? 이거를 { }를 생략하고 코드만 넣어줘도 알아서 클로저로 만들어준다고 합니다!

단 조건이 있는데요. 바로 **인수**가 없는 클로저만이 Auto-Closure로 만들어 줄 수 있습니다!

Auto-closure로 사용하려면 @escaping 키워드 처럼 인자 타입 앞에 @autoclosure 키워드를 붙여줍니다!

## 예제 코드

### @autoclosure 사용하지 않을 때

매우 일반적인 경우입니다.

```swift
func foo(_ closure: () -> Void) {
    closure()
}

foo({ print("hello world") })
// or 
foo { print("hello world") }

```

### @autoclosure 사용

일반 인자처럼 표현할 수 있습니다!

```swift
func foo(_ closure: @autoclosure () -> Void) {
    closure()
}

foo(print("hello world"))
foo { print("hello world") } // autoclosure를 사용할 땐 후행 클로저방식은 사용 x
```

autoclosure로 사용할 땐 후행 클로저 표현은 사용할 수 없습니다 !

### 가독성

autoclosure는 {}를 없애줘서 편리할 수도 있지만

자칫 잘못 사용하면 가독성을 해치거나 인수의 타입에 대해 혼돈할 수 있습니다.

아래 코드를 보시죠!

```swift

var waitingCustomers = ["sweet", "dev"]

func serve(_ customers: @autoclosure () -> String) {
    print("now serving \(customers())")
}

serve( waitingCustomers.removeLast() )
```

함수 serve(_:)는 인수로 () → String 타입의 클로저를 받습니다.

autoclosure로 사용되어서 그냥 코드를 삽입하면 자동으로 클로저로 만들어 줍니다!

함수를 사용할 때를 볼까요?

배열의 removeLast()는 배열의 마지막 아이템을 삭제하고 해당 아이템을 return 하는 메소드입니다.

String 배열이기 때문에 String을 반환하겠죠? 

그래서 잘못 보면 serve(_:) 함수는 String 타입을 인자로 받는 함수로 비춰질 수 있습니다.

주의하면서 써야겠죠?

## 정리

클로저를 인수로 받는 함수에서 @autoclosure를 사용하면 코드가 간결하게 보일 수 있다.

하지만 그로인해 인자의 타입을 잘못 착각하는 오류를 범할 수도 있다!
