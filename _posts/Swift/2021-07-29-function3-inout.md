---
title: Function(3) in-out
layout: single
author_profile: true
comments: true
share: true
related: true
popular: true
categories:
- Swift
tag:
- Function
toc: true
toc_sticky: true
toc_label: 목차
---

## In-Out

함수의 파라미터는 let으로 정의된 상수와 같다.

따라서 함수안에서 파라미터의 값을 변경하려 하면 컴파일 에러가 발생한다.

```swift
func increseAndPrint(_ param: Int) {
    param += 1 // 컴파일 에러
    print(param)
}

var value = 5
increseAndPrint(value)
```

이해를 돕기 위해 위의 코드를 풀어보면

```swift
var value = 5
let param = value // == increseAndPrint(value)
// 함수의 본문 
param += 1
print(param)
```

이렇게 보면 에러가 나는 것이 당연한 것 처럼 보인다.

Swift에서 함수에 값을 전달할 때 변수 자체를 전달하는 것이 아니라 변수의 값을 파라미터에 **복사**한다

이런 방식을 값에 의한 전달, pass by value라고 한다. 그럼 어떻게 파라미터로 들어온 변수의 값을 변경할 수 있을까?

설명을 쉽게하기 위해 위 코드에서 함수 호출시 사용한 변수 value를 **인수,** 해당 인수의 값을 함수 내부에서 사용하는 param을 **파라미터**로 정의하겠다.

함수가 실행되고 끝날 때 파라미터의 값을 인수에 재차 복사를 해주면 된다. 이를 copy-**in** copy-**out** 이라 한다.

>그래서 이름이 inout일지도???

단계를 다시 설명하면

1. 함수가 호출되면 인수(value)값이 파라미터(param)에 복사된다.
2. 함수 본문에서 파라미터(param)값이 수정이 된다.
3. 함수가 종료 혹은 반환되면 파라미터(param)값이 인수(value)에 할당된다.

inout 키워드는 파라미터가 이렇게 인수에 다시 복사되어야함을 알려준다. 

```swift
func increseAndPrint(_ param: inout Int) { // inout은 파라미터의 Type 앞에 선언
    param += 1 // 컴파일 에러
    print("param is \(param)")
}

var value = 5
increseAndPrint(&value) // &은 뭐지?
print("value is \(value)")
```

함수 호출에서도 다른점이 보이는데 inout 으로 선언된 파라미터에 전달된 인수에는 &을 붙여 전달해야 한다.

> 내 생각인데 c언어의 포인터와 같은 개념으로 복사를 하기위해 해당 인수의 주소값을 받는 거란 생각이 든다.

실행해 보면 모두 6이 출력되는걸 확인할 수 있다!

유의할 점은 기본값이 있는 파라미터와 가변 파라미터에는 inout으로 정의할 수 없다.
